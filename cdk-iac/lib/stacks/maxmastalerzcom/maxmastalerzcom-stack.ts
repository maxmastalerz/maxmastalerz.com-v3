import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { MaxmastalerzcomStackProps, SubnetGroupId } from '../../types'; 
import { Vpc } from './constructs/vpc/vpc';
import {
  aws_ec2 as ec2,
  aws_ecs as ecs,
  aws_elasticloadbalancingv2 as elbv2,
  aws_autoscaling as autoscaling,
  aws_iam as iam,
  aws_ssm as ssm,
  aws_ecr as ecr,
  aws_lambda as lambda,
  aws_events as events,
  aws_efs as efs,
  aws_servicediscovery as servicediscovery,
  aws_rds as rds,
  aws_logs as logs,
  RemovalPolicy,
  Duration,
  CfnOutput
} from 'aws-cdk-lib';

export class MaxMastalerzComStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: MaxmastalerzcomStackProps) {
    super(scope, id, props);

    const clusterName = `maxmastalerzcom-cluster-${props.envName}`;

    const customVPC = new Vpc(this, 'Vpc', {
      vpc: props.vpc,
      region: this.region,
      availabilityZones: this.availabilityZones,
      envName: props.envName
    });

    const mysqlPublicAccessSG = new ec2.CfnSecurityGroup(this, 'MysqlPublicAccessSG', {
      groupName: `mysql-public-access-${props.envName}`,
      groupDescription: 'Allows public mysql access',
      securityGroupIngress: [
        { ipProtocol: 'tcp', cidrIp: '0.0.0.0/0', fromPort: 3306, toPort: 3306 },
        { ipProtocol: 'tcp', cidrIpv6: '::/0',    fromPort: 3306, toPort: 3306 }
      ],
      securityGroupEgress: [
        { ipProtocol: '-1', cidrIp: '0.0.0.0/0' },
        { ipProtocol: '-1', cidrIpv6: '::/0' }
      ],
      vpcId: customVPC.id
    });

    const maxmastalerzcomManageRDSSnapshots = new iam.ManagedPolicy(this, 'MaxmastalerzcomManageRDSSnapshots', {
      managedPolicyName: `cdk-maxmastalerzcomManageRDSSnapshots`,
      statements: [
        new iam.PolicyStatement({
          actions: ['rds:DescribeDBSnapshots'],
          resources: [`arn:aws:rds:${this.region}:${process.env.CDK_DEFAULT_ACCOUNT}:db:maxmastalerzcom`],
          effect: iam.Effect.ALLOW,
        }),
        new iam.PolicyStatement({
          actions: ['rds:DeleteDBSnapshot'],
          resources: [`arn:aws:rds:${this.region}:${process.env.CDK_DEFAULT_ACCOUNT}:snapshot:maxmastalerzcomstack-snapshot-database-*`],
          effect: iam.Effect.ALLOW,
        })
      ]
    });

    const getLatestRDSSnapShotLambdaExecRole = new iam.Role(this, 'GetLatestRDSSnapShotLambdaExecRole', {
      roleName: `cdk-getLatestRDSSnapShotLambdaExecRole`,
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromManagedPolicyArn(this, 'ManagedPolicy', maxmastalerzcomManageRDSSnapshots.managedPolicyArn),
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')
      ],
      permissionsBoundary: iam.ManagedPolicy.fromManagedPolicyArn(
        this,
        'PermissionsBoundary1',
        `arn:aws:iam::${process.env.CDK_DEFAULT_ACCOUNT}:policy/BoundaryPolicyCDKDeveloper`
      ),
    });

    const getLatestRDSSnapshotLogGroup = new logs.LogGroup(this, 'GetLatestRDSSnapshotLogGroup', {
      logGroupName: '/aws/lambda/get-latest-rds-snapshot',
      removalPolicy: RemovalPolicy.DESTROY,
      retention: logs.RetentionDays.ONE_DAY
    });
    const getLatestRDSSnapshotProvider = new lambda.SingletonFunction(this, 'GetLatestRDSSnapshotProvider', {
      functionName: 'get-latest-rds-snapshot',
      uuid: 'get-latest-rds-snapshot',
      role: getLatestRDSSnapShotLambdaExecRole,
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_20_X,
      timeout: Duration.seconds(30),
      logGroup: getLatestRDSSnapshotLogGroup,
      code: lambda.Code.fromInline(`
const { RDSClient, DescribeDBSnapshotsCommand, DeleteDBSnapshotCommand } = require('@aws-sdk/client-rds');

function send(event, context, responseStatus, responseData, physicalResourceId, noEcho) {
    return new Promise((resolve, reject) => {
        var responseBody = JSON.stringify({
            Status: responseStatus,
            Reason: "See the details in CloudWatch Log Stream: " + context.logStreamName,
            PhysicalResourceId: physicalResourceId || context.logStreamName,
            StackId: event.StackId,
            RequestId: event.RequestId,
            LogicalResourceId: event.LogicalResourceId,
            NoEcho: noEcho || false,
            Data: responseData
        });

        console.log("Response body:\\n", responseBody);

        var https = require("https");
        var url = require("url");

        var parsedUrl = url.parse(event.ResponseURL);
        var options = {
            hostname: parsedUrl.hostname,
            port: 443,
            path: parsedUrl.path,
            method: "PUT",
            headers: {
                "content-type": "",
                "content-length": responseBody.length
            }
        };

        var request = https.request(options, function(response) {
            console.log("Status code: " + parseInt(response.statusCode));
            resolve(context.done());
        });

        request.on("error", function(error) {
            console.log("send(..) failed executing https.request(..): " + error);
            reject(context.done(error));
        });

        request.write(responseBody);
        request.end();
    });
}

exports.handler = async function(event, context) {
  const client = new RDSClient({ region: '${this.region}' });
  const dbInstanceIdentifier = 'maxmastalerzcom';

  console.log('Event: ', JSON.stringify(event, null, 2));
  const requestType = event.RequestType;
  if(requestType === 'Create' || requestType === 'Update') {

    try {
      const command = new DescribeDBSnapshotsCommand({ DBInstanceIdentifier: dbInstanceIdentifier });
      const response = await client.send(command);

      const snapshotsMadeByStackDeletionEvent = response.DBSnapshots?.filter(snapshot =>
        snapshot.DBSnapshotIdentifier.startsWith('maxmastalerzcomstack-snapshot-database-')
      );

      const latestSnapshot = snapshotsMadeByStackDeletionEvent?.reduce((latest, current) =>
        (new Date(current.SnapshotCreateTime) > new Date(latest.SnapshotCreateTime)) ? current : latest
      );

      if (latestSnapshot) {
        const deletePromises = snapshotsMadeByStackDeletionEvent
          .filter(snapshot => snapshot.DBSnapshotIdentifier !== latestSnapshot.DBSnapshotIdentifier)
          .map(async snapshot => {
            const deleteCommand = new DeleteDBSnapshotCommand({ DBSnapshotIdentifier: snapshot.DBSnapshotIdentifier });
            await client.send(deleteCommand);
            console.log(\`Deleted old snapshot: \${snapshot.DBSnapshotIdentifier}\`);
          });
        await Promise.all(deletePromises);

        await send(event, context, "SUCCESS", {
          snapshotId: latestSnapshot.DBSnapshotIdentifier
        });
      } else {
        await send(event, context, "SUCCESS", {
          snapshotId: 'maxmastalerzcom-snapshot'
        });
      }
    } catch (error) {
      console.error(\`Error: \${error.message}\`);
      await send(event, context, "FAILED", {
        snapshotId: 'maxmastalerzcom-snapshot'
      });
    }
  } else if(requestType === 'Delete') {
    await send(event, context, "SUCCESS", {
      message: 'deleted custom resource.'
    });
  }

};
      `)
    });

    const getLatestRDSSnapshot = new cdk.CustomResource(this, 'GetLatestRDSSnapshot', {
      serviceToken: getLatestRDSSnapshotProvider.functionArn
    });

    const dbSubnetGroup = new rds.CfnDBSubnetGroup(this, 'DbSubnetGroup', {
      dbSubnetGroupName: 'maxmastalerzcom-db-subnet-group',
      dbSubnetGroupDescription: 'Db subnet group for maxmastalerzcom db.',
      subnetIds: customVPC.subnets
        .filter((subnet) => (subnet.subnetGroupId === SubnetGroupId.PUBLIC_SUBNET))
        .map((subnet) => (subnet.construct.attrSubnetId))
    });

    const database = new rds.CfnDBInstance(this, 'Database', {
      dbInstanceIdentifier: 'maxmastalerzcom',
      dbInstanceClass: 'db.t3.micro',
      allocatedStorage: '20',
      engine: 'mysql',
      engineVersion: '8.0.35',
      availabilityZone: this.availabilityZones[0],
      backupRetentionPeriod: 7,
      caCertificateIdentifier: 'rds-ca-rsa2048-g1',
      vpcSecurityGroups: [mysqlPublicAccessSG.attrGroupId],
      dbSnapshotIdentifier: getLatestRDSSnapshot.getAttString('snapshotId'),
      publiclyAccessible: true,
      dbSubnetGroupName: dbSubnetGroup.dbSubnetGroupName,
      maxAllocatedStorage: 100,
      multiAz: false,
      networkType: 'IPV4',
      optionGroupName: 'default:mysql-8-0',
      storageType: 'gp2',
      masterUsername: 'root',
      masterUserPassword: ssm.StringParameter.fromSecureStringParameterAttributes(this, 'DbPassword', { parameterName: 'MYSQL_ROOT_PASSWORD' }).stringValue
    });
    database.addDependency(dbSubnetGroup);

    const loadBalancerSG = new ec2.CfnSecurityGroup(this, 'LoadBalancerSG', {
      groupName: 'maxmastalerzcom-load-balancer-sg-cdk',
      groupDescription: 'Security Group for load balancer',
      securityGroupIngress: [
        { ipProtocol: 'tcp', cidrIp: '0.0.0.0/0', fromPort: 443, toPort: 443 },
        { ipProtocol: 'tcp', cidrIp: '0.0.0.0/0', fromPort: 80, toPort: 80 },
        { ipProtocol: 'tcp', cidrIpv6: '::/0',    fromPort: 443, toPort: 443 },
        { ipProtocol: 'tcp', cidrIpv6: '::/0',    fromPort: 80, toPort: 80 }
      ],
      securityGroupEgress: [
        { ipProtocol: '-1', cidrIp: '0.0.0.0/0' },
        { ipProtocol: '-1', cidrIpv6: '::/0' }
      ],
      vpcId: customVPC.id
    });
    loadBalancerSG.applyRemovalPolicy(RemovalPolicy.DESTROY);

    const loadBalancer = new elbv2.CfnLoadBalancer(this, 'LoadBalancer', {
      name: `maxmastalerzcom-load-bal-${props.envName}`,
      type: 'application',
      scheme: 'internet-facing',
      ipAddressType: 'dualstack',
      subnets: customVPC.subnets
        .filter((subnet) => (subnet.subnetGroupId === SubnetGroupId.PUBLIC_SUBNET))
        .map((subnet) => (subnet.construct.attrSubnetId)),
      securityGroups: [ loadBalancerSG.attrGroupId ]
    });
    loadBalancer.applyRemovalPolicy(RemovalPolicy.DESTROY);

    const ecsMaxmasProxyTargetGroup = new elbv2.CfnTargetGroup(this, 'ECSMaxMasProxyTargetGroup', {
      name: `ecs-maxmas-proxy-${props.envName}`,
      ipAddressType: 'ipv4',
      protocol: 'HTTP',
      protocolVersion: 'HTTP1',
      port: 80,
      healthCheckPath: '/nginx-proxy-status',
      healthCheckTimeoutSeconds: 5,
      healthyThresholdCount: 2,
      targetType: 'ip',
      vpcId: customVPC.id
    });

    const httpListener = new elbv2.CfnListener(this, 'HttpListener', {
      defaultActions: [{
        type: 'forward',
        targetGroupArn: ecsMaxmasProxyTargetGroup.attrTargetGroupArn,
      }],
      loadBalancerArn: loadBalancer.attrLoadBalancerArn,
      port: 80,
      protocol: 'HTTP'
    });
    httpListener.addDependency(ecsMaxmasProxyTargetGroup);

    const httpsListener = new elbv2.CfnListener(this, 'HttpsListener', {
      defaultActions: [{
        type: 'forward',
        targetGroupArn: ecsMaxmasProxyTargetGroup.attrTargetGroupArn,
      }],
      loadBalancerArn: loadBalancer.attrLoadBalancerArn,
      port: 443,
      protocol: 'HTTPS',
      certificates: [{
        //TODO: Pass the certificate arn dynamically. We could either pass it in or make it via cdk?
        certificateArn: `arn:aws:acm:${this.region}:${process.env.CDK_DEFAULT_ACCOUNT}:certificate/df41621f-b4d1-4439-b724-c23cd32d01ab`,
      }]
    });
    httpsListener.addDependency(ecsMaxmasProxyTargetGroup);

    const ecsInstanceRole = new iam.CfnRole(this, 'EcsInstanceRole', {
      roleName: `cdk-ecsInstanceRole-${props.envName}`,
      assumeRolePolicyDocument: {
        "Version": "2008-10-17",
        "Statement": [
          {
            "Effect": "Allow",
            "Principal": {
              "Service": "ec2.amazonaws.com"
            },
            "Action": "sts:AssumeRole"
          }
        ]
      },
      managedPolicyArns: ['arn:aws:iam::aws:policy/service-role/AmazonEC2ContainerServiceforEC2Role'],
      permissionsBoundary: `arn:aws:iam::${process.env.CDK_DEFAULT_ACCOUNT}:policy/BoundaryPolicyCDKDeveloper`
    });

    const ecsInstanceProfile = new iam.CfnInstanceProfile(this, 'EcsInstanceProfile', {
      roles: [ecsInstanceRole.roleName!],
      instanceProfileName: `cdk-ecsInstanceRole-${props.envName}`
    });
    ecsInstanceProfile.addDependency(ecsInstanceRole);

    //dangerous test
    const ecsSecurityGroup = new ec2.CfnSecurityGroup(this, 'ecsSecurityGroup', {
      groupName: 'EC2ContainerService-maxmastalerzcom-cluster-EcsSecurityGroup',
      groupDescription: 'ecs security group',
      securityGroupIngress: [
        { ipProtocol: '-1', cidrIp: '0.0.0.0/0' },
        { ipProtocol: '-1', cidrIpv6: '::/0' }
      ],
      securityGroupEgress: [
        { ipProtocol: '-1', cidrIp: '0.0.0.0/0' },
        { ipProtocol: '-1', cidrIpv6: '::/0' }
      ],
      vpcId: customVPC.id
    });

    const launchConfiguration = new autoscaling.CfnLaunchConfiguration(this, 'LaunchConfiguration', {
      launchConfigurationName: 'ECS-maxmastalerzcom-cluster-instance-lc',
      imageId: 'ami-03a74f907535015d5',
      instanceType: 't3.small',
      blockDeviceMappings: [{
        deviceName: '/dev/xvda',
        ebs: {
          encrypted: false,
          volumeSize: 30,
          volumeType: 'gp2',
        }
      }],
      iamInstanceProfile: ecsInstanceProfile.attrArn,
      instanceMonitoring: false,
      keyName: 'maxmastalerz-cluster-keypair',
      metadataOptions: {
        httpTokens: 'optional',
      },
      placementTenancy: 'default',
      securityGroups: [ecsSecurityGroup.ref],
      userData: Buffer.from(`#!/bin/bash
echo ECS_CLUSTER=${clusterName} >> /etc/ecs/ecs.config;
echo ECS_BACKEND_HOST= >> /etc/ecs/ecs.config;
`).toString('base64'),
    });

    const asgForMaxmastalerzcomClusterCapacityProvider = new autoscaling.CfnAutoScalingGroup(this, 'AsgForMaxmastalerzcomClusterCapacityProvider', {
      autoScalingGroupName: `ASG-for-maxmastalerzcom-cluster-capacity-provider-${props.envName}`,
      maxSize: '2',
      desiredCapacity: '1',
      minSize: '1',
      launchConfigurationName: launchConfiguration.launchConfigurationName,
      newInstancesProtectedFromScaleIn: false,
      serviceLinkedRoleArn: `arn:aws:iam::${process.env.CDK_DEFAULT_ACCOUNT}:role/aws-service-role/autoscaling.amazonaws.com/AWSServiceRoleForAutoScaling`,
      tags: [{
        key: 'AmazonECSManaged',
        value: '',
        propagateAtLaunch: true
      }],
      terminationPolicies: ['Default'],
      vpcZoneIdentifier: customVPC.subnets
        .filter((subnet) => (subnet.subnetGroupId === SubnetGroupId.PRIVATE_SUBNET))
        .map((subnet) => (subnet.construct.attrSubnetId))
    });
    asgForMaxmastalerzcomClusterCapacityProvider.addDependency(launchConfiguration);

    const capacityProvider = new ecs.CfnCapacityProvider(this, 'MyCfnCapacityProvider', {
      name: `maxmastalerzcom-cluster-capacity-provider-${props.envName}`,
      autoScalingGroupProvider: {
        autoScalingGroupArn: asgForMaxmastalerzcomClusterCapacityProvider.autoScalingGroupName!,
        managedDraining: 'ENABLED',
        managedScaling: {
          status: 'ENABLED',
          targetCapacity: 100
        }
      }
    });
    capacityProvider.addDependency(asgForMaxmastalerzcomClusterCapacityProvider);

    const add1CapacityUnitLambdaPerms = new iam.ManagedPolicy(this, 'Add1CapacityUnitLambdaPerms', {
      managedPolicyName: `cdk-add-1-capacity-unit-lambda-perms`,
      statements: [
        new iam.PolicyStatement({
          actions: ['autoscaling:DescribeAutoScalingGroups'],
          resources: ['*'],
          effect: iam.Effect.ALLOW,
        }),
        new iam.PolicyStatement({
          actions: ['autoscaling:SetDesiredCapacity'],
          resources: [
            `arn:aws:autoscaling:${this.region}:${process.env.CDK_DEFAULT_ACCOUNT}:autoScalingGroup:*:autoScalingGroupName/${asgForMaxmastalerzcomClusterCapacityProvider.autoScalingGroupName}`
          ],
          effect: iam.Effect.ALLOW,
        }),
        // CloudWatch Logs permissions
        new iam.PolicyStatement({
          actions: ['logs:CreateLogGroup'],
          resources: [
            `arn:aws:logs:${this.region}:${process.env.CDK_DEFAULT_ACCOUNT}:*`
          ],
          effect: iam.Effect.ALLOW,
        }),
        new iam.PolicyStatement({
          actions: ['logs:CreateLogStream', 'logs:PutLogEvents'],
          resources: [
            `arn:aws:logs:${this.region}:${process.env.CDK_DEFAULT_ACCOUNT}:log-group:/aws/lambda/add-1-capacity-unit-to-${clusterName}-asg:*`
          ],
          effect: iam.Effect.ALLOW,
        })
      ]
    });

    const add1CapacityUnitLambdaExecRole = new iam.CfnRole(this, 'Add1CapacityUnitLambdaExecRole', {
      roleName: `cdk-${clusterName}-LambdaExecRole-${props.envName}`,
      assumeRolePolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: {
              Service: 'lambda.amazonaws.com'
            },
            Action: 'sts:AssumeRole'
          }
        ]
      },
      managedPolicyArns: [
        add1CapacityUnitLambdaPerms.managedPolicyArn
      ],
      permissionsBoundary: `arn:aws:iam::${process.env.CDK_DEFAULT_ACCOUNT}:policy/BoundaryPolicyCDKDeveloper`
    });

    const add1CapacityUnitToClusterASG = new lambda.CfnFunction(this, 'Add1CapacityUnitToClusterASG', {
      functionName: `add-1-capacity-unit-to-${clusterName}-asg`,
      runtime: 'nodejs20.x',
      handler: 'index.handler',
      code: {
        zipFile: `
const { AutoScalingClient, DescribeAutoScalingGroupsCommand, SetDesiredCapacityCommand } = require("@aws-sdk/client-auto-scaling");

const client = new AutoScalingClient({});

const describeASGs = async (params) => {
  try {
    const command = new DescribeAutoScalingGroupsCommand(params);
    const data = await client.send(command);
    return data;
  } catch (err) {
    throw err;
  }
};

const setASGSize = async (asgName, newSize) => {
  try {
    const params = {
      AutoScalingGroupName: asgName,
      DesiredCapacity: newSize
    };
    const command = new SetDesiredCapacityCommand(params);
    await client.send(command);
  } catch (err) {
    throw err;
  }
};

const allowedResources = [
  "arn:aws:ecs:${this.region}:${process.env.CDK_DEFAULT_ACCOUNT}:service/${clusterName}/proxy-service",
  "arn:aws:ecs:${this.region}:${process.env.CDK_DEFAULT_ACCOUNT}:service/${clusterName}/cms-service",
  "arn:aws:ecs:${this.region}:${process.env.CDK_DEFAULT_ACCOUNT}:service/${clusterName}/gatsby-service",
  "arn:aws:ecs:${this.region}:${process.env.CDK_DEFAULT_ACCOUNT}:service/${clusterName}/remark42-service"
];

exports.handler = async (event) => {
  if(event.source !== "aws.ecs") {
    throw new Error('Function only supports input from events with a source type of aws.ecs');
  }
  if(event['detail-type'] !== "ECS Service Action") {
    throw new Error('Function only supports input from events with a detail-type of "ECS Service Action"');
  }
  event.resources.forEach((resource) => {
    if(!allowedResources.includes(resource)) {
      throw new Error(\`Function does not support events coming in with a resource of \${resource}\`);
    }
  });
  if(event.detail.eventType !== "ERROR") {
    throw new Error('Function only supports input from events with a detail.eventType of ERROR');
  }
  if(event.detail.eventName !== "SERVICE_TASK_PLACEMENT_FAILURE") {
    throw new Error('Function only supports input from events with a detail.eventName of SERVICE_TASK_PLACEMENT_FAILURE');
  }
  if(event.detail.clusterArn !== "arn:aws:ecs:${this.region}:${process.env.CDK_DEFAULT_ACCOUNT}:cluster/${clusterName}") {
    throw new Error('Function only supports input from events in the arn:aws:ecs:${this.region}:${process.env.CDK_DEFAULT_ACCOUNT}:cluster/${clusterName} ECS cluster');
  }
  
  const asgName = "${asgForMaxmastalerzcomClusterCapacityProvider.autoScalingGroupName}";
  const params = { AutoScalingGroupNames: [asgName] };
  
  const asgs = await describeASGs(params);

  if(asgs.AutoScalingGroups.length === 1) {
    const desiredCapacity = asgs.AutoScalingGroups[0].DesiredCapacity;
    
    const newCapacity = desiredCapacity + 1;
    await setASGSize(asgName, newCapacity);
    
    return {
      statusCode: 200,
      body: JSON.stringify(\`\${asgName} desiredCapacity updated to \${newCapacity}\`)
    };
  } else {
    throw new Error('${clusterName} cluster must have an ASG such that this function can update its size.');
  }
};
        `
      },
      role: add1CapacityUnitLambdaExecRole.attrArn
    });

    const serviceTaskPlacementFailureRule = new events.CfnRule(this, 'ServiceTaskPlacementFailureRule', {
      name: `${clusterName}-SERVICE_TASK_PLACEMENT_FAILURE`,
      description: 'Monitors the ECS cluster for a SERVICE_TASK_PLACEMENT_FAILURE (includes RESOURCE:ENI errors)',
      eventPattern: {
        source: ["aws.ecs"],
        "detail-type": ["ECS Service Action"],
        resources: [
          `arn:aws:ecs:${this.region}:${process.env.CDK_DEFAULT_ACCOUNT}:service/${clusterName}/gatsby-service`,
          `arn:aws:ecs:${this.region}:${process.env.CDK_DEFAULT_ACCOUNT}:service/${clusterName}/proxy-service`,
          `arn:aws:ecs:${this.region}:${process.env.CDK_DEFAULT_ACCOUNT}:service/${clusterName}/cms-service`,
          `arn:aws:ecs:${this.region}:${process.env.CDK_DEFAULT_ACCOUNT}:service/${clusterName}/remark42-service`
        ],
        detail: {
          eventType: ["ERROR"],
          eventName: ["SERVICE_TASK_PLACEMENT_FAILURE"],
          clusterArn: [`arn:aws:ecs:${this.region}:${process.env.CDK_DEFAULT_ACCOUNT}:cluster/${clusterName}`]
        }
      },
      targets: [{
        arn: add1CapacityUnitToClusterASG.attrArn,
        id: 'ServiceTaskPlacementFailureRuleLambdaTarget'
      }]
    });

    const allowLambdaInvokeFromEventBridge = new lambda.CfnPermission(this, 'AllowLambdaInvokeFromEventBridge', {
      action: 'lambda:InvokeFunction',
      functionName: add1CapacityUnitToClusterASG.attrArn,
      principal: 'events.amazonaws.com',
      sourceArn: serviceTaskPlacementFailureRule.attrArn
    });

    const maxmastalerzcomCluster = new ecs.CfnCluster(this, 'MaxmastalerzcomCluster', {
      capacityProviders: [capacityProvider.name!],
      clusterName: clusterName
    });
    maxmastalerzcomCluster.addDependency(capacityProvider);
    maxmastalerzcomCluster.addDependency(serviceTaskPlacementFailureRule);

    const ssmParameterStoreRemark42Task = new iam.ManagedPolicy(this, 'SsmParameterStoreRemark42Task', {
      managedPolicyName: `cdk-ssmParameterStore-remark42-task-${props.envName}`,
      statements: [
        new iam.PolicyStatement({
          actions: ['ssm:GetParameters'],
          resources: [
            `arn:aws:ssm:${this.region}:${process.env.CDK_DEFAULT_ACCOUNT}:parameter/REMARK42_PORT`,
            `arn:aws:ssm:${this.region}:${process.env.CDK_DEFAULT_ACCOUNT}:parameter/PROD_BASE_URL`,
            `arn:aws:ssm:${this.region}:${process.env.CDK_DEFAULT_ACCOUNT}:parameter/REMARK42_SECRET`,
            `arn:aws:ssm:${this.region}:${process.env.CDK_DEFAULT_ACCOUNT}:parameter/REMARK42_GITHUB_OAUTH_CLIENT_ID`,
            `arn:aws:ssm:${this.region}:${process.env.CDK_DEFAULT_ACCOUNT}:parameter/REMARK42_GITHUB_OAUTH_CLIENT_SECRET`
          ],
          effect: iam.Effect.ALLOW,
        }),
      ]
    });

    const remark42TaskExecRole = new iam.CfnRole(this, 'Remark42TaskExecRole', {
      roleName: `cdk-remark42TaskExecRole-${props.envName}`,
      assumeRolePolicyDocument: {
        "Version": "2012-10-17",
        "Statement": [
          {
            "Effect": "Allow",
            "Principal": {
              "Service": "ecs-tasks.amazonaws.com"
            },
            "Action": "sts:AssumeRole"
          }
        ]
      },
      managedPolicyArns: [
        'arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy',
        ssmParameterStoreRemark42Task.managedPolicyArn
      ],
      permissionsBoundary: `arn:aws:iam::${process.env.CDK_DEFAULT_ACCOUNT}:policy/BoundaryPolicyCDKDeveloper`
    });
    
    const proxyServiceSg = new ec2.CfnSecurityGroup(this, 'ProxyServiceSg', {
      groupName: 'proxy-service',
      groupDescription: 'ecs proxy service',
      securityGroupIngress: [
        {
          ipProtocol: 'tcp',
          fromPort: 80,
          toPort: 80,
          cidrIp: '0.0.0.0/0'
        },
        {
          ipProtocol: '-1',
          description: 'nat instance traffic inbound',
          sourceSecurityGroupId: customVPC.nat.sg.attrGroupId
        }
      ],
      securityGroupEgress: [
        { ipProtocol: '-1', cidrIp: '0.0.0.0/0' },
        { ipProtocol: '-1', cidrIpv6: '::/0' }
      ],
      vpcId: customVPC.id
    });

    // TODO: Probably not needed anymore as we're using Netlify for this. Also the gatsby service should probably just be used
    // in development. Better to have the static site files on the proxy service.
    const gatsbyServiceSg = new ec2.CfnSecurityGroup(this, 'GatsbyServiceSg', {
      groupName: 'gatsby-service',
      groupDescription: 'ecs gatsby service',
      securityGroupIngress: [
        {
          ipProtocol: 'tcp',
          fromPort: 80,
          toPort: 80,
          cidrIp: '0.0.0.0/0'
        },
        {
          ipProtocol: 'tcp',
          fromPort: 8000,
          toPort: 8000,
          sourceSecurityGroupId: proxyServiceSg.attrGroupId
        },
        {
          ipProtocol: '-1',
          description: 'nat instance traffic inbound',
          sourceSecurityGroupId: customVPC.nat.sg.attrGroupId
        }
      ],
      securityGroupEgress: [
        { ipProtocol: '-1', cidrIp: '0.0.0.0/0' },
        { ipProtocol: '-1', cidrIpv6: '::/0' }
      ],
      vpcId: customVPC.id
    });

    const cmsServiceSg = new ec2.CfnSecurityGroup(this, 'CmsServiceSg', {
      groupName: 'cms-service',
      groupDescription: 'ecs cms service',
      securityGroupIngress: [
        {
          ipProtocol: 'tcp',
          description: 'gatsby-service',
          fromPort: 1340,
          toPort: 1340,
          sourceSecurityGroupId: gatsbyServiceSg.attrGroupId
        },
        {
          ipProtocol: 'tcp',
          description: 'proxy service',
          fromPort: 1340,
          toPort: 1340,
          sourceSecurityGroupId: proxyServiceSg.attrGroupId
        },
        //TODO: might be able to remove this?
        {
          ipProtocol: 'tcp',
          fromPort: 1340,
          toPort: 1340,
          cidrIp: '0.0.0.0/0'
        },
        {
          ipProtocol: '-1',
          description: 'nat instance traffic inbound',
          sourceSecurityGroupId: customVPC.nat.sg.attrGroupId
        },
        {
          ipProtocol: 'tcp',
          fromPort: 80,
          toPort: 80,
          cidrIp: '0.0.0.0/0'
        }
      ],
      securityGroupEgress: [
        { ipProtocol: '-1', cidrIp: '0.0.0.0/0' },
        { ipProtocol: '-1', cidrIpv6: '::/0' }
      ],
      vpcId: customVPC.id
    });

    const remark42ServiceSg = new ec2.CfnSecurityGroup(this, 'Remark42ServiceSg', {
      groupName: 'remark-service',
      groupDescription: 'ecs remark service',

      securityGroupIngress: [
        {
          ipProtocol: '-1',
          description: 'nat instance traffic inbound',
          sourceSecurityGroupId: customVPC.nat.sg.attrGroupId
        },
        {
          ipProtocol: 'tcp',
          fromPort: 8080,
          toPort: 8080,
          sourceSecurityGroupId: proxyServiceSg.attrGroupId
        },
        {
          ipProtocol: 'tcp',
          fromPort: 80,
          toPort: 80,
          cidrIp: '0.0.0.0/0'
        }
      ],
      securityGroupEgress: [
        { ipProtocol: '-1', cidrIp: '0.0.0.0/0' },
        { ipProtocol: '-1', cidrIpv6: '::/0' }
      ],
      vpcId: customVPC.id
    });

    const efsAccessForRemarkServiceSg = new ec2.CfnSecurityGroup(this, 'EfsAccessForRemarkServiceSg', {
      groupName: 'EFS-access-for-remark-service-sg',
      groupDescription: 'allows remark service to access efs',
      securityGroupIngress: [
        { ipProtocol: 'tcp', fromPort: 2049, toPort: 2049, sourceSecurityGroupId: remark42ServiceSg.attrGroupId }
      ],
      securityGroupEgress: [
        { ipProtocol: 'tcp', fromPort: 2049, toPort: 2049, destinationSecurityGroupId: remark42ServiceSg.attrGroupId }
      ],
      vpcId: customVPC.id
    });

    const remark42EfsId = 'fs-4d4dbb36';
    customVPC.subnets.filter((subnet) => (subnet.subnetGroupId === SubnetGroupId.PUBLIC_SUBNET)).forEach((subnet, i) => {
      new efs.CfnMountTarget(this, `Remark42EfsMountTarget${i}`, {
        fileSystemId: remark42EfsId,
        securityGroups: [efsAccessForRemarkServiceSg.attrGroupId],
        subnetId: subnet.construct.attrSubnetId
      });
    });

    const remark42LogGroup = new logs.LogGroup(this, 'Remark42LogGroup', {
      logGroupName: '/ecs/remark42-ec2',
      removalPolicy: RemovalPolicy.DESTROY,
      retention: logs.RetentionDays.ONE_DAY
    });
    const remark42TaskDef = new ecs.CfnTaskDefinition(this, 'Remark42TaskDef', {
      networkMode: 'awsvpc',
      executionRoleArn: remark42TaskExecRole.attrArn,
      family: 'remark42-ec2',
      volumes: [{
        name: 'remark42-data',
        efsVolumeConfiguration: {
          filesystemId: remark42EfsId,
          rootDirectory: '/'
        }
      }],
      containerDefinitions: [{
        image: 'umputun/remark42:latest',
        name: 'remark42',
        essential: true,
        memoryReservation: 191,
        mountPoints: [{
          sourceVolume: 'remark42-data',
          containerPath: '/srv/var'
        }],
        portMappings: [{
          containerPort: 8080,
          protocol: 'tcp'
        }],
        secrets: [
          { name: 'AUTH_GITHUB_CID', valueFrom: `arn:aws:ssm:${this.region}:${process.env.CDK_DEFAULT_ACCOUNT}:parameter/REMARK42_GITHUB_OAUTH_CLIENT_ID`},
          { name: 'AUTH_GITHUB_CSEC', valueFrom: `arn:aws:ssm:${this.region}:${process.env.CDK_DEFAULT_ACCOUNT}:parameter/REMARK42_GITHUB_OAUTH_CLIENT_SECRET`},
          { name: 'REMARK_PORT', valueFrom: `arn:aws:ssm:${this.region}:${process.env.CDK_DEFAULT_ACCOUNT}:parameter/REMARK42_PORT`},
          { name: 'SECRET', valueFrom: `arn:aws:ssm:${this.region}:${process.env.CDK_DEFAULT_ACCOUNT}:parameter/REMARK42_SECRET`}
        ],
        environment: [
          { name: 'ANON_VOTE', value: 'true' },
          { name: 'SITE', value: 'maxmastalerz.com' },
          { name: 'REMARK_URL', value: 'https://remark42.maxmastalerz.com' },
          { name: 'ADMIN_SHARED_ID', value: 'github_ce2d4e381aa49ffbf800f7d6527e2b774a1be617' },
          { name: 'AUTH_ANON', value: 'true' }
        ],
        logConfiguration: {
          logDriver: 'awslogs',
          options: {
            'awslogs-group': remark42LogGroup.logGroupName,
            'awslogs-region': this.region,
            'awslogs-stream-prefix': 'ecs'
          }
        }
      }]
    });

    const ssmParameterStoreCmsTask = new iam.ManagedPolicy(this, 'SsmParameterStoreCmsTask', {
      managedPolicyName: `cdk-ssmParameterStore-cms-task-${props.envName}`,
      statements: [
        new iam.PolicyStatement({
          actions: ['ssm:GetParameters'],
          resources: [
            `arn:aws:ssm:${this.region}:${process.env.CDK_DEFAULT_ACCOUNT}:parameter/STRAPI_INTERNAL_PORT`,
            `arn:aws:ssm:${this.region}:${process.env.CDK_DEFAULT_ACCOUNT}:parameter/MYSQL_PASSWORD`,
            `arn:aws:ssm:${this.region}:${process.env.CDK_DEFAULT_ACCOUNT}:parameter/MYSQL_PORT`,
            `arn:aws:ssm:${this.region}:${process.env.CDK_DEFAULT_ACCOUNT}:parameter/BASE_URL`,
            `arn:aws:ssm:${this.region}:${process.env.CDK_DEFAULT_ACCOUNT}:parameter/STRAPI_JWT_SECRET`,
            `arn:aws:ssm:${this.region}:${process.env.CDK_DEFAULT_ACCOUNT}:parameter/STRAPI_ADMIN_JWT_SECRET`,
            `arn:aws:ssm:${this.region}:${process.env.CDK_DEFAULT_ACCOUNT}:parameter/STRAPI_AWS_S3_KEY`,
            `arn:aws:ssm:${this.region}:${process.env.CDK_DEFAULT_ACCOUNT}:parameter/STRAPI_AWS_S3_SECRET`,
            `arn:aws:ssm:${this.region}:${process.env.CDK_DEFAULT_ACCOUNT}:parameter/STRAPI_AWS_SES_USER_KEY`,
            `arn:aws:ssm:${this.region}:${process.env.CDK_DEFAULT_ACCOUNT}:parameter/STRAPI_AWS_SES_USER_SECRET`,
            `arn:aws:ssm:${this.region}:${process.env.CDK_DEFAULT_ACCOUNT}:parameter/STRAPI_HCAPTCHA_SECRET_KEY`
          ],
          effect: iam.Effect.ALLOW,
        }),
      ]
    });

    const cmsTaskExecRole = new iam.CfnRole(this, 'CmsTaskExecRole', {
      roleName: `cdk-cmsTaskExecRole-${props.envName}`,
      assumeRolePolicyDocument: {
        "Version": "2012-10-17",
        "Statement": [
          {
            "Effect": "Allow",
            "Principal": {
              "Service": "ecs-tasks.amazonaws.com"
            },
            "Action": "sts:AssumeRole"
          }
        ]
      },
      managedPolicyArns: [
        'arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy',
        ssmParameterStoreCmsTask.managedPolicyArn
      ],
      permissionsBoundary: `arn:aws:iam::${process.env.CDK_DEFAULT_ACCOUNT}:policy/BoundaryPolicyCDKDeveloper`
    });

    const strapiECRRepository = ecr.Repository.fromRepositoryName(this, 'StrapiRepository', 'strapi');
    const cmsLogGroup = new logs.LogGroup(this, 'CmsLogGroup', {
      logGroupName: '/ecs/cms-ec2',
      removalPolicy: RemovalPolicy.DESTROY,
      retention: logs.RetentionDays.ONE_DAY
    });
    const cmsTaskDef = new ecs.CfnTaskDefinition(this, 'CmsTaskDef', {
      networkMode: 'awsvpc',
      executionRoleArn: cmsTaskExecRole.attrArn,
      family: 'cms-ec2',
      containerDefinitions: [{
        image: strapiECRRepository.repositoryUri,
        name: 'strapi',
        essential: true,
        memoryReservation: 1100,
        command: ['npm','run','start'],
        workingDirectory: '/strapi-app',
        portMappings: [{
          containerPort: 1340,
          protocol: 'tcp'
        }],
        secrets: [
          { name: 'ADMIN_JWT_SECRET', valueFrom: `arn:aws:ssm:${this.region}:${process.env.CDK_DEFAULT_ACCOUNT}:parameter/STRAPI_ADMIN_JWT_SECRET`},
          { name: 'AWS_S3_KEY', valueFrom: `arn:aws:ssm:${this.region}:${process.env.CDK_DEFAULT_ACCOUNT}:parameter/STRAPI_AWS_S3_KEY`},
          { name: 'AWS_S3_SECRET', valueFrom: `arn:aws:ssm:${this.region}:${process.env.CDK_DEFAULT_ACCOUNT}:parameter/STRAPI_AWS_S3_SECRET`},
          { name: 'BASE_URL', valueFrom: `arn:aws:ssm:${this.region}:${process.env.CDK_DEFAULT_ACCOUNT}:parameter/BASE_URL`},
          { name: 'JWT_SECRET', valueFrom: `arn:aws:ssm:${this.region}:${process.env.CDK_DEFAULT_ACCOUNT}:parameter/STRAPI_JWT_SECRET`},
          { name: 'MYSQL_PASSWORD', valueFrom: `arn:aws:ssm:${this.region}:${process.env.CDK_DEFAULT_ACCOUNT}:parameter/MYSQL_PASSWORD`},
          { name: 'MYSQL_PORT', valueFrom: `arn:aws:ssm:${this.region}:${process.env.CDK_DEFAULT_ACCOUNT}:parameter/MYSQL_PORT`},
          { name: 'PORT', valueFrom: `arn:aws:ssm:${this.region}:${process.env.CDK_DEFAULT_ACCOUNT}:parameter/STRAPI_INTERNAL_PORT`}, 
        ],
        environment: [
          { name: 'MYSQL_HOST', value: database.attrEndpointAddress },
          { name: 'AWS_CLOUDFRONT', value: 'https://daavgqhmwmui1.cloudfront.net/' },
          { name: 'AWS_S3_BUCKET', value: 'maxmastalerzcom-strapi-images' },
          { name: 'AWS_S3_REGION', value: this.region },
          { name: 'HOST', value: '0.0.0.0' },
          { name: 'MYSQL_DATABASE', value: 'strapi_cms' },
          { name: 'MYSQL_USER', value: 'strapi' },
          { name: 'NODE_ENV', value: 'production' },
          { name: 'PROTOCOL', value: 'https://' },
        ],
        logConfiguration: {
          logDriver: 'awslogs',
          options: {
            'awslogs-group': cmsLogGroup.logGroupName,
            'awslogs-region': this.region,
            'awslogs-stream-prefix': 'ecs'
          }
        }
      }]
    });

    const ssmParameterStoreProxyTask = new iam.ManagedPolicy(this, 'SsmParameterStoreProxyTask', {
      managedPolicyName: `cdk-ssmParameterStore-proxy-task-${props.envName}`,
      statements: [
        new iam.PolicyStatement({
          actions: ['ssm:GetParameters'],
          resources: [
            `arn:aws:ssm:${this.region}:${process.env.CDK_DEFAULT_ACCOUNT}:parameter/GATSBY_SERVICE_HOSTNAME`,
            `arn:aws:ssm:${this.region}:${process.env.CDK_DEFAULT_ACCOUNT}:parameter/GATSBY_PORT`,
            `arn:aws:ssm:${this.region}:${process.env.CDK_DEFAULT_ACCOUNT}:parameter/STRAPI_SERVICE_HOSTNAME`,
            `arn:aws:ssm:${this.region}:${process.env.CDK_DEFAULT_ACCOUNT}:parameter/STRAPI_INTERNAL_PORT`,
            `arn:aws:ssm:${this.region}:${process.env.CDK_DEFAULT_ACCOUNT}:parameter/REMARK42_PORT`,
            `arn:aws:ssm:${this.region}:${process.env.CDK_DEFAULT_ACCOUNT}:parameter/BASE_URL`
          ],
          effect: iam.Effect.ALLOW,
        }),
      ]
    });

    const proxyTaskExecRole = new iam.CfnRole(this, 'ProxyTaskExecRole', {
      roleName: `cdk-proxyTaskExecRole-${props.envName}`,
      assumeRolePolicyDocument: {
        "Version": "2012-10-17",
        "Statement": [
          {
            "Effect": "Allow",
            "Principal": {
              "Service": "ecs-tasks.amazonaws.com"
            },
            "Action": "sts:AssumeRole"
          }
        ]
      },
      managedPolicyArns: [
        'arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy',
        ssmParameterStoreProxyTask.managedPolicyArn
      ],
      permissionsBoundary: `arn:aws:iam::${process.env.CDK_DEFAULT_ACCOUNT}:policy/BoundaryPolicyCDKDeveloper`
    });

    const nginxECRRepository = ecr.Repository.fromRepositoryName(this, 'NginxRepository', 'nginx');
    const nginxContainerPort = 80;
    const proxyLogGroup = new logs.LogGroup(this, 'ProxyLogGroup', {
      logGroupName: '/ecs/proxy-ec2',
      removalPolicy: RemovalPolicy.DESTROY,
      retention: logs.RetentionDays.ONE_DAY
    });
    const nginxContainerDefn: ecs.CfnTaskDefinition.ContainerDefinitionProperty = {
      image: nginxECRRepository.repositoryUri,
      name: 'nginx',
      essential: true,
      memoryReservation: 200,
      portMappings: [{
        containerPort: nginxContainerPort,
        protocol: 'tcp'
      }],
      secrets: [
        { name: 'BASE_URL', valueFrom: `arn:aws:ssm:${this.region}:${process.env.CDK_DEFAULT_ACCOUNT}:parameter/BASE_URL`},
        { name: 'GATSBY_PORT', valueFrom: `arn:aws:ssm:${this.region}:${process.env.CDK_DEFAULT_ACCOUNT}:parameter/GATSBY_PORT`},
        { name: 'REMARK42_PORT', valueFrom: `arn:aws:ssm:${this.region}:${process.env.CDK_DEFAULT_ACCOUNT}:parameter/REMARK42_PORT`},
        { name: 'STRAPI_INTERNAL_PORT', valueFrom: `arn:aws:ssm:${this.region}:${process.env.CDK_DEFAULT_ACCOUNT}:parameter/STRAPI_INTERNAL_PORT`},
        { name: 'STRAPI_SERVICE_HOSTNAME', valueFrom: `arn:aws:ssm:${this.region}:${process.env.CDK_DEFAULT_ACCOUNT}:parameter/STRAPI_SERVICE_HOSTNAME`}
      ],
      environment: [
        { name: 'PROTOCOL', value: 'https://' },
        { name: 'GATSBY_SERVICE_HOSTNAME', value: 'maxmastalerzcom.netlify.app' },
        { name: 'REMARK42_SERVICE_HOSTNAME', value: 'remark42-service.maxmastalerz.com-private' },
        { name: 'NGINX_PORT', value: '80' }
      ],
      logConfiguration: {
        logDriver: 'awslogs',
        options: {
          'awslogs-group': proxyLogGroup.logGroupName,
          'awslogs-region': this.region,
          'awslogs-stream-prefix': 'ecs'
        }
      }
    }
    const proxyTaskDef = new ecs.CfnTaskDefinition(this, 'ProxyTaskDef', {
      networkMode: 'awsvpc',
      executionRoleArn: proxyTaskExecRole.attrArn,
      family: 'proxy-ec2',
      containerDefinitions: [nginxContainerDefn]
    });

    const privateSrvcDiscNamespace = new servicediscovery.CfnPrivateDnsNamespace(this, 'PrivateSrvcDiscNamespace', {
      name: `maxmastalerz.com-private`,
      vpc: customVPC.id,
      properties: {
        dnsProperties: {
          soa: {
            ttl: 15,
          },
        },
      }
    });

    const cmsSrvcDiscService = new servicediscovery.CfnService(this, 'CmsSrvcDiscService', {
      name: 'cms-service',
      namespaceId: privateSrvcDiscNamespace.attrId,
      dnsConfig: {
        dnsRecords: [{ type: 'A', ttl: 60 }],
        routingPolicy: 'MULTIVALUE'
      },
      healthCheckCustomConfig: {
        failureThreshold: 1,
      }
    });

    const remark42SrvcDiscService = new servicediscovery.CfnService(this, 'Remark42SrvcDiscService', {
      name: 'remark42-service',
      namespaceId: privateSrvcDiscNamespace.attrId,
      dnsConfig: {
        dnsRecords: [{ type: 'A', ttl: 60 }],
        routingPolicy: 'MULTIVALUE'
      },
      healthCheckCustomConfig: {
        failureThreshold: 1,
      }
    });

    const cmsEcsService = new ecs.CfnService(this, 'CmsEcsService', {
      cluster: maxmastalerzcomCluster.attrArn,
      serviceName: 'cms-service',
      schedulingStrategy: 'REPLICA',
      launchType: 'EC2',
      taskDefinition: cmsTaskDef.attrTaskDefinitionArn,
      networkConfiguration: {
        awsvpcConfiguration: {
          securityGroups: [cmsServiceSg.attrGroupId],
          subnets: customVPC.subnets
            .filter((subnet) => (subnet.subnetGroupId === SubnetGroupId.PRIVATE_SUBNET))
            .map((subnet) => (subnet.construct.attrSubnetId))
        }
      },
      desiredCount: 1,
      deploymentConfiguration: {
        minimumHealthyPercent: 0,
        maximumPercent: 200
      },
      placementStrategies: [
        { type: 'spread', field: 'attribute:ecs.availability-zone' },
        { type: 'spread', field: 'instanceId' }
      ],
      serviceRegistries: [{
        registryArn: cmsSrvcDiscService.attrArn
      }]
    });

    const remark42EcsService = new ecs.CfnService(this, 'Remark42EcsService', {
      cluster: maxmastalerzcomCluster.attrArn,
      serviceName: 'remark42-service',
      schedulingStrategy: 'REPLICA',
      launchType: 'EC2',
      taskDefinition: remark42TaskDef.attrTaskDefinitionArn,
      networkConfiguration: {
        awsvpcConfiguration: {
          securityGroups: [remark42ServiceSg.attrGroupId],
          subnets: customVPC.subnets
            .filter((subnet) => (subnet.subnetGroupId === SubnetGroupId.PRIVATE_SUBNET))
            .map((subnet) => (subnet.construct.attrSubnetId))
        }
      },
      //TODO: You could make the desired count 0 here so as to not run an extra instance just for comments.
      desiredCount: 1,
      deploymentConfiguration: {
        minimumHealthyPercent: 0,
        maximumPercent: 200
      },
      placementStrategies: [
        { type: 'spread', field: 'attribute:ecs.availability-zone' },
        { type: 'spread', field: 'instanceId' }
      ],
      serviceRegistries: [{
        registryArn: remark42SrvcDiscService.attrArn
      }]
    });

    const proxyEcsService = new ecs.CfnService(this, 'ProxyEcsService', {
      cluster: maxmastalerzcomCluster.attrArn,
      serviceName: 'proxy-service',
      schedulingStrategy: 'REPLICA',
      launchType: 'EC2',
      taskDefinition: proxyTaskDef.attrTaskDefinitionArn,
      loadBalancers: [{
        containerName: nginxContainerDefn.name,
        containerPort: nginxContainerPort,
        targetGroupArn: ecsMaxmasProxyTargetGroup.attrTargetGroupArn,
      }],
      networkConfiguration: {
        awsvpcConfiguration: {
          securityGroups: [proxyServiceSg.attrGroupId],
          subnets: customVPC.subnets
            .filter((subnet) => (subnet.subnetGroupId === SubnetGroupId.PRIVATE_SUBNET))
            .map((subnet) => (subnet.construct.attrSubnetId))
        }
      },
      desiredCount: 1,
      deploymentConfiguration: {
        minimumHealthyPercent: 0,
        maximumPercent: 200
      },
      placementStrategies: [
        { type: 'spread', field: 'attribute:ecs.availability-zone' },
        { type: 'spread', field: 'instanceId' }
      ]
    });
    proxyEcsService.addDependency(httpsListener);
    proxyEcsService.addDependency(httpListener);

    //Custom resource below which does nothing on creation, but on deletion disables capacity provider managed draining
    //and sets asg to 0 because the NAT instance needed to stay around for a while for ecs.CfnService's to delete properly.
    //Workaround is to disable managed draining and scale asg down which will make the services shutdown.
    const disableManagedDrainingClearASGLambdaExecRole = new iam.Role(this, 'DeleteCapacityProviderLambdaExecRole', {
      roleName: `cdk-deleteCapacityProviderLambdaExecRole`,
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
        iam.ManagedPolicy.fromAwsManagedPolicyName('AutoScalingFullAccess'),
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonECS_FullAccess')
      ],
      permissionsBoundary: iam.ManagedPolicy.fromManagedPolicyArn(
        this,
        'PermissionsBoundary2',
        `arn:aws:iam::${process.env.CDK_DEFAULT_ACCOUNT}:policy/BoundaryPolicyCDKDeveloper`
      )
    });
    const disableManagedDrainingClearASGProviderLogGroup = new logs.LogGroup(this, 'DisableManagedDrainingClearASGProviderLogGroup', {
      logGroupName: '/aws/lambda/disable-managed-draining-clear-asg',
      removalPolicy: RemovalPolicy.DESTROY,
      retention: logs.RetentionDays.ONE_DAY,
    });
    const disableManagedDrainingClearASGLambdaProvider = new lambda.SingletonFunction(this, 'DisableManagedDrainingClearASGLambdaProvider', {
      functionName: 'disable-managed-draining-clear-asg',
      uuid: 'disable-managed-draining-clear-asg',
      role: disableManagedDrainingClearASGLambdaExecRole,
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_20_X,
      timeout: Duration.seconds(60),
      logGroup: disableManagedDrainingClearASGProviderLogGroup,
      code: lambda.Code.fromInline(`
const { ECSClient, UpdateCapacityProviderCommand } = require("@aws-sdk/client-ecs");
const { AutoScalingClient, UpdateAutoScalingGroupCommand } = require("@aws-sdk/client-auto-scaling");

function send(event, context, responseStatus, responseData, physicalResourceId, noEcho) {
    return new Promise((resolve, reject) => {
        var responseBody = JSON.stringify({
            Status: responseStatus,
            Reason: "See the details in CloudWatch Log Stream: " + context.logStreamName,
            PhysicalResourceId: physicalResourceId || context.logStreamName,
            StackId: event.StackId,
            RequestId: event.RequestId,
            LogicalResourceId: event.LogicalResourceId,
            NoEcho: noEcho || false,
            Data: responseData
        });

        console.log("Response body:\\n", responseBody);

        var https = require("https");
        var url = require("url");

        var parsedUrl = url.parse(event.ResponseURL);
        var options = {
            hostname: parsedUrl.hostname,
            port: 443,
            path: parsedUrl.path,
            method: "PUT",
            headers: {
                "content-type": "",
                "content-length": responseBody.length
            }
        };

        var request = https.request(options, function(response) {
            console.log("Status code: " + parseInt(response.statusCode));
            resolve(context.done());
        });

        request.on("error", function(error) {
            console.log("send(..) failed executing https.request(..): " + error);
            reject(context.done(error));
        });

        request.write(responseBody);
        request.end();
    });
}

exports.handler = async function(event, context) {
console.log('Event: ', JSON.stringify(event, null, 2));
    const requestType = event.RequestType;
    const capacityProviderName = event.ResourceProperties.CapacityProviderName;
    const asgName = event.ResourceProperties.AsgName;

    const ecsClient = new ECSClient({ region: '${this.region}' });
    const asgClient = new AutoScalingClient({ region: '${this.region}' });

    try {
        if (requestType === 'Create' || requestType === 'Update') {
            console.log('Create/Update event, nothing to do here.');
            await send(event, context, "SUCCESS", {
                message: 'Lambda function invoked successfully.'
            });
        } else if (requestType === 'Delete') {
            console.log('Disabling managed draining and setting ASG size to 0.');

            // Disable managed draining for the ECS Capacity Provider
            const updateCapacityProviderCommand = new UpdateCapacityProviderCommand({
                name: capacityProviderName,
                autoScalingGroupProvider: {
                    autoScalingGroupArn: asgName,
                    managedDraining: 'DISABLED',
                }
            });

            await ecsClient.send(updateCapacityProviderCommand);
            console.log('Disabled managed draining for ECS Capacity Provider:', capacityProviderName);

            // Set desired capacity and minimum size of ASG to 0
            const updateAutoScalingGroupCommand = new UpdateAutoScalingGroupCommand({
                AutoScalingGroupName: asgName,
                DesiredCapacity: 0,
                MinSize: 0 // Set minimum size to 0
            });

            await asgClient.send(updateAutoScalingGroupCommand);
            console.log('Set desired capacity and minimum size of ASG to 0:', asgName);

            await send(event, context, "SUCCESS", {
                message: 'Disabled managed draining and set ASG desired capacity and minimum size to 0.'
            });
        }
    } catch (error) {
        console.error('Error:', error);
        await send(event, context, "FAILED", {
            message: error.message
        });
    }
};
      `),
    });
    const disableManagedDrainingClearASGCustomResource = new cdk.CustomResource(this, 'DisableManagedDrainingClearASGCustomResource', {
      serviceToken: disableManagedDrainingClearASGLambdaProvider.functionArn,
      properties: {
        CapacityProviderName: capacityProvider.name,
        AsgName: asgForMaxmastalerzcomClusterCapacityProvider.autoScalingGroupName
      }
    });

    new CfnOutput(this, 'MakeTheseDNSUpdatesToNelify1', {
      value: `CNAME api.maxmastalerz.com ${loadBalancer.attrDnsName} 3600`,
      description: 'The record you need to update on netlify for the cms to be wired up.',
      exportName: 'MakeTheseDNSUpdatesToNelify1'
    });

    new CfnOutput(this, 'MakeTheseDNSUpdatesToNelify2', {
      value: `CNAME remark42.maxmastalerz.com ${loadBalancer.attrDnsName} 3600`,
      description: 'The record you need to update on netlify for remark42 to be wired up.',
      exportName: 'MakeTheseDNSUpdatesToNelify2'
    });
  }
}
