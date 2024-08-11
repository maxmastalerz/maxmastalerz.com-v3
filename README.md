# maxmastalerz.com

## LOCAL SET UP:

### Update your hosts file

Edit your operating system hosts file to include the lines:

127.0.0.1       api.dev.maxmastalerz.com

127.0.0.1       remark42.dev.maxmastalerz.com

127.0.0.1       dev.maxmastalerz.com

127.0.0.1       www.dev.maxmastalerz.com

### To run locally:

$ sudo docker-compose --env-file .env.dev -f docker-compose.dev.yml build

$ sudo docker-compose --env-file .env.dev -f docker-compose.dev.yml up

Go to http://dev.maxmastalerz.com
Go to http://api.dev.maxmastalerz.com/admin
Go to http://dev.maxmastalerz.com/__graphql

### To run locally with a gatsby production build(AKA preprod):

Temporarily edit your computer's /etc/hosts to contain:

127.0.0.1       maxmastalerz.com

$ sudo docker-compose --env-file .env.preprod -f docker-compose.preprod.yml build

$ sudo docker-compose --env-file .env.preprod -f docker-compose.preprod.yml up

Go to http://maxmastalerz.com

Go to http://api.maxmastalerz.com/admin

TODO: Note that remark42 comments do not seem to work properly on preprod due to http/https differences.

### Login:

John Doe <johndoe@gmail.com> Password123

## PRODUCTION

Prerequisites:
- Node v20.12.2
- Python 3.10.12
- Your SSO user with "Admin" permission set consisting of AdministratorAccess & AWSSSOMemberAccountAdministrator policies.
- Use your user's Admin SSO profile to create a permission set for you and other developers:
$ aws cloudformation create-stack --stack-name CDKDeveloperPermissionSet --template-body file://cdk-iac/bootstrap/cdk-developer-permission-set.yaml --capabilities CAPABILITY_NAMED_IAM --profile Admin
- Once the PowerUserAccessWithCDK permission set for developers is created, assign it to to yourself and/or other developers.

- A boostrapped AWS account/region (1 time step) (Change the account ids to relevant ones):
	$ cdk bootstrap --show-template > ./cdk-iac/bootstrap/bootstrap-template-orig.yaml
	$ python3 cdk-iac/bootstrap/update_cdk_bootstrap_template.py "arn:aws:iam::244252657288:policy/BoundaryPolicyCDKDeveloper"
	$ cdk bootstrap aws://244252657288/us-east-2 --template ./cdk-iac/bootstrap/bootstrap-template.yaml --custom-permissions-boundary BoundaryPolicyCDKDeveloper --profile PowerUserAccessWithCDK

- Edit/Save bin/cdk-iac.ts with your preferred AWS account and region for infrastructure. Deploy the infrastructure:
$ aws sso login --profile PowerUserAccessWithCDK
$ cd cdk-iac
$ npx cdk deploy --profile PowerUserAccessWithCDK

Cdk will print out instructions for what cname records to place on the domain. Do this manually.

## PRODUCTION DEPLOYMENT:

### Retrieve auth token and authenticate your Docker client to the registry.

$ aws ecr get-login-password --region us-east-2 | docker login --username AWS --password-stdin 244252657288.dkr.ecr.us-east-2.amazonaws.com

### Build the PROD images locally

$ sudo docker-compose --env-file .env.prod -f docker-compose.prod.yml build

### Deploy strapi image

$ docker tag maxmastalerzcom_cms-service.maxmastalerz.com-private:latest 244252657288.dkr.ecr.us-east-2.amazonaws.com/strapi:latest

$ docker push 244252657288.dkr.ecr.us-east-2.amazonaws.com/strapi:latest

### Deploy gatsby:

This is done via the netlify admin page or whenever you push to master.

### Deploy nginx image

$ docker tag maxmastalerzcom_nginx:latest 244252657288.dkr.ecr.us-east-2.amazonaws.com/nginx:latest

$ docker push 244252657288.dkr.ecr.us-east-2.amazonaws.com/nginx:latest

### In-place deployment

Go into AWS ECS > the maxmastalerzcom-cluster > Services:

For the service you want to in-place deploy, update the service to have a minimum healthy percentage of 0.

Now you can run a redeploy command for the service you wanted to update:

aws ecs update-service --cluster maxmastalerzcom-cluster --service cms-service --force-new-deployment

aws ecs update-service --cluster maxmastalerzcom-cluster --service proxy-service --force-new-deployment

aws ecs update-service --cluster maxmastalerzcom-cluster --service remark42-service --force-new-deployment

### Once deployed...

Once deployed, you can visit:

https://maxmastalerz.com

https://api.maxmastalerz.com/admin
