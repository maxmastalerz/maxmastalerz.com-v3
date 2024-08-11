import { aws_ec2 as ec2, Fn, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { VpcConfig, RouteTableType, Subnet, Nat, SubnetGroupId } from '../../../../types';
import { numToAZLetter } from '../../../../helpers/availability-zones';
 
export interface VpcProps {
    vpc: VpcConfig;
    region: string;
    availabilityZones: string[];
    envName: string;
}

export class Vpc extends Construct {
    readonly id: string;
    readonly subnets: Subnet[] = [];
    readonly nat: Nat;
 
    constructor(scope: Construct, id: string, props: VpcProps) {
        super(scope, id);
 
        const vpc = new ec2.CfnVPC(this, `MaxmastalerzcomVPC`, {
            cidrBlock: props.vpc.cidr,
            enableDnsHostnames: true,
            tags: [ { key: 'Name', value: `maxmastalerzcom-vpc-${props.envName}` } ]
        });
        this.id = vpc.attrVpcId;
        vpc.applyRemovalPolicy(RemovalPolicy.DESTROY);
 
        const internetGateway = new ec2.CfnInternetGateway(this, `MaxmastalerzcomIGW`, {
            tags: [ { key: 'Name', value: `Maxmastalerzcom-IGW` } ]
        });
        internetGateway.applyRemovalPolicy(RemovalPolicy.DESTROY);
 
        const attachment = new ec2.CfnVPCGatewayAttachment(this, 'VPCGatewayAttachment', {
            vpcId: this.id,
            internetGatewayId: internetGateway.attrInternetGatewayId,
        });
        attachment.applyRemovalPolicy(RemovalPolicy.DESTROY);
 
        // Create route tables.
        const routeTables = [
            {
                logicalId: 'MaxmastalerzcomPublicRouteTable',
                construct: new ec2.CfnRouteTable(this, `MaxmastalerzcomPublicRouteTable`, {
                    vpcId: this.id,
                    tags: [ { key: 'Name', value: `Maxmastalerzcom-Public` } ]
                }),
                type: RouteTableType.PUBLIC
 
            },
            {
                logicalId: 'MaxmastalerzcomPrivateRouteTable',
                construct: new ec2.CfnRouteTable(this, `MaxmastalerzcomPrivateRouteTable`, {
                    vpcId: this.id,
                    tags: [ { key: 'Name', value: `Maxmastalerzcom-Private` } ]
                }),
                type: RouteTableType.PRIVATE
            }
        ];
 
        routeTables.forEach((routeTable) => {
            // Make "Public" route tables actually public by connecting them to the internet gateway.
            if(routeTable.type === RouteTableType.PUBLIC) {
                const igwRouteIpv4 = new ec2.CfnRoute(this, `${routeTable.logicalId}IGWRouteIPV4`, {
                    routeTableId: routeTable.construct.attrRouteTableId,
                    destinationCidrBlock: '0.0.0.0/0',
                    gatewayId: internetGateway.attrInternetGatewayId
                });
                const igwRouteIpv6 = new ec2.CfnRoute(this, `${routeTable.logicalId}IGWRouteIPV6`, {
                    routeTableId: routeTable.construct.attrRouteTableId,
                    destinationIpv6CidrBlock: '::/0',
                    gatewayId: internetGateway.attrInternetGatewayId
                });
                igwRouteIpv4.applyRemovalPolicy(RemovalPolicy.DESTROY);
                igwRouteIpv6.applyRemovalPolicy(RemovalPolicy.DESTROY);
            }
 
            // For created route tables, apply removal policy.
            routeTable.construct.applyRemovalPolicy(RemovalPolicy.DESTROY);
        });

        // Create subnets
        props.vpc.subnetGroups.forEach((subnetGroup) => {
            const cidrBlocksForAZs = subnetGroup.cidrBlocksForAZs.slice(0, props.availabilityZones.length); // Cidr blocks depend on number of available AZs
            cidrBlocksForAZs.forEach((cidrBlockForAZ, cidrBlockI) => {
                const az = `${props.region}${numToAZLetter(cidrBlockI)}`;
                const subnetName = `${subnetGroup.namePrefix} ${numToAZLetter(cidrBlockI).toUpperCase()}`;
 
                const subnetConstruct = new ec2.CfnSubnet(this, subnetName.replace(/ /g, ''), {
                    vpcId: this.id,
                    availabilityZone: az,
                    cidrBlock: cidrBlockForAZ,
                    tags: [
                        { key: 'Name', value: subnetName }
                    ]
                });
                subnetConstruct.applyRemovalPolicy(RemovalPolicy.DESTROY);
 
                this.subnets.push({
                    name: subnetName,
                    subnetGroupId: subnetGroup.id,
                    availabilityZone: az,
                    construct: subnetConstruct,
                    routeTableMapping: subnetGroup.routeTableMapping
                });
 
            });
        });
 
        const ipv6cidr = new ec2.CfnVPCCidrBlock(this, 'CIDR6', {
            vpcId: this.id,
            amazonProvidedIpv6CidrBlock: true,
        });

        // Create Subnet Route Table Associations
        const associations = [];
        this.subnets.forEach((subnet, i) => {
            if(subnet.subnetGroupId === SubnetGroupId.PUBLIC_SUBNET) {
                subnet.construct.addDependency(ipv6cidr);
                subnet.construct.ipv6CidrBlock = Fn.select(i, Fn.cidr(Fn.select(0, vpc.attrIpv6CidrBlocks), 256, '64'));
                subnet.construct.assignIpv6AddressOnCreation = true;
            }

            const routeTableMapped = routeTables.find(rt => rt.logicalId === subnet.routeTableMapping);
 
            if(routeTableMapped) {
                const subnetRouteTableAssociation = new ec2.CfnSubnetRouteTableAssociation(this, `${subnet.name.replace(/ /g, '')}Assoc`, {
                    routeTableId: routeTableMapped.construct.attrRouteTableId,
                    subnetId: subnet.construct.attrSubnetId
                });
                subnetRouteTableAssociation.applyRemovalPolicy(RemovalPolicy.DESTROY);
                associations.push(subnetRouteTableAssociation);
            } else {
                throw new Error(`Route table "${subnet.routeTableMapping}" could not be found even though though a subnet ${subnet.name} expected it to exist.`);
            }
        });

        const azForNatInstance = props.availabilityZones[0];
        const subnetForNatInstance = this.subnets.find((subnet) => {
            return (subnet.availabilityZone === azForNatInstance && subnet.subnetGroupId === SubnetGroupId.PUBLIC_SUBNET);
        });
        // If there's a private subnet/route table and a place for the nat instance in a public subnet,
        // create the nat instance and a mapping to it from the private subnet
        if(routeTables.find(routeTable => routeTable.type === RouteTableType.PRIVATE) && subnetForNatInstance) {
            const natInstanceSG = new ec2.CfnSecurityGroup(this, 'NatInstanceSG', {
                groupName: `nat-instance-sg-${props.envName}`,
                groupDescription: 'the security group of the nat instance',
                securityGroupIngress: [{
                    ipProtocol: '-1', cidrIp: '0.0.0.0/0',
                    description: 'TEMPORARY TEST ipv4'
                },
                {
                    ipProtocol: '-1', cidrIpv6: '::/0',
                    description: 'TEMPORARY TEST ipv6'
                }],
                securityGroupEgress: [{
                    ipProtocol: '-1', cidrIp: '0.0.0.0/0'
                },
                {
                    ipProtocol: '-1', cidrIpv6: '::/0'
                }],
                vpcId: this.id
            });
            const natInstance = new ec2.CfnInstance(this, 'NatInstance', {
                instanceType: 't3a.nano',
                availabilityZone: azForNatInstance,
                blockDeviceMappings: [{
                    deviceName: '/dev/xvda',
                    ebs: {
                      volumeSize: 8,
                      volumeType: ec2.EbsDeviceVolumeType.GP2,
                    }
                }],
                ebsOptimized: true,
                imageId: 'ami-06d4b7182ac3480fa',
                keyName: 'maxmastalerz-cluster-keypair',
                networkInterfaces: [{
                    deviceIndex: '0',
                    associatePublicIpAddress: true,
                    deleteOnTermination: true,
                    groupSet: [natInstanceSG.attrGroupId],
                    subnetId: subnetForNatInstance.construct.attrSubnetId
                }],
                sourceDestCheck: false,
                tags: [{ key: 'Name', value: 'My nat instance' }],
                userData: Buffer.from(`#!/bin/bash
sudo yum install iptables-services -y
sudo systemctl enable iptables
sudo systemctl start iptables

# Turning on IP Forwarding
sudo touch /etc/sysctl.d/custom-ip-forwarding.conf
sudo chmod 666 /etc/sysctl.d/custom-ip-forwarding.conf
sudo echo "net.ipv4.ip_forward=1" >> /etc/sysctl.d/custom-ip-forwarding.conf
sudo sysctl -p /etc/sysctl.d/custom-ip-forwarding.conf

# Making a catchall rule for routing and masking the private IP
sudo /sbin/iptables -t nat -A POSTROUTING -o ens5 -j MASQUERADE
sudo /sbin/iptables -F FORWARD
sudo service iptables save\n
    `).toString('base64')
            });
            natInstance.applyRemovalPolicy(RemovalPolicy.DESTROY);

            this.nat = {
                instance: natInstance,
                sg: natInstanceSG
            }

            routeTables.forEach((routeTable) => {
                if(routeTable.type === RouteTableType.PRIVATE) {
                    const natInstanceRouteIPV4 = new ec2.CfnRoute(this, `${routeTable.logicalId}NatInstanceRouteIPV4`, {
                        routeTableId: routeTable.construct.attrRouteTableId,
                        destinationCidrBlock: '0.0.0.0/0',
                        instanceId: natInstance.attrInstanceId
                    });
                    const natInstanceRouteIPV6 = new ec2.CfnRoute(this, `${routeTable.logicalId}NatInstanceRouteIPV6`, {
                        routeTableId: routeTable.construct.attrRouteTableId,
                        destinationIpv6CidrBlock: '::/0',
                        instanceId: natInstance.attrInstanceId
                    });
                    natInstanceRouteIPV4.applyRemovalPolicy(RemovalPolicy.DESTROY);
                    natInstanceRouteIPV6.applyRemovalPolicy(RemovalPolicy.DESTROY);
                }
            });
        }
 
    }
}