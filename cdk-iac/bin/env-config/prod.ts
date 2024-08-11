import { SubnetGroupId } from '../../lib/types';
 
const props = {
    envName: 'Prod', /* DO NOT USE THIS IN IF STATEMENTS. Used for simpler naming of resources. Use config here for env differences. */
    vpc: {
        cidr: '10.0.0.0/16',
        subnetGroups: [
            {
                id: SubnetGroupId.PUBLIC_SUBNET,
                namePrefix: 'Public Subnet',
                cidrBlocksForAZs: ['10.0.0.0/24', '10.0.1.0/24', '10.0.2.0/24'],
                routeTableMapping:  'MaxmastalerzcomPublicRouteTable'
            },
            {
                id: SubnetGroupId.PRIVATE_SUBNET,
                namePrefix: 'Private Subnet',
                cidrBlocksForAZs: ['10.0.10.0/24', '10.0.11.0/24', '10.0.12.0/24'],
                routeTableMapping:  'MaxmastalerzcomPrivateRouteTable'
            }
        ]
    }
};
 
export default props;