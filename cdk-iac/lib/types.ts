import * as cdk from 'aws-cdk-lib';
import { aws_ec2 as ec2 } from 'aws-cdk-lib';
 
/*Other examples include PRIVATE_ISOLATED*/
export enum RouteTableType {
    PUBLIC,
    PRIVATE
}

/*Better naming examples include things like DB_SUBNET, LOAD_BALANCER_SUBNET, WEB_SERVER_SUBNET, etc.*/
export enum SubnetGroupId {
	PUBLIC_SUBNET,
	PRIVATE_SUBNET
}
 
export interface Subnet {
    name: string;
    subnetGroupId: SubnetGroupId;
    availabilityZone: string;
    construct: ec2.CfnSubnet;
    routeTableMapping: string;
}

export interface Nat {
    instance: ec2.CfnInstance,
    sg: ec2.CfnSecurityGroup
}
 
interface SubnetGroup {
    id: SubnetGroupId;
    namePrefix: string;
    cidrBlocksForAZs: string[];
    routeTableMapping: string;
}
 
export interface VpcConfig {
    cidr: string;
    subnetGroups: SubnetGroup[];
}
 
export interface MaxmastalerzcomStackProps extends cdk.StackProps {
    envName: string; /* DO NOT USE THIS IN IF STATEMENTS. Used for simpler naming of resources. Use the env-config folder for env differences. */
    vpc: VpcConfig;
}