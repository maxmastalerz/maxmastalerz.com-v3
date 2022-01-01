#maxmastalerz.com v3!

## LOCAL SET UP:

### Update your hosts file

Edit your operating system hosts file to include the line:

127.0.0.1        dev.maxmastalerz.com

### To run locally:

$ sudo docker-compose --env-file .env.dev -f docker-compose.dev.yml build

$ sudo docker-compose --env-file .env.dev -f docker-compose.dev.yml up

### To run locally with gatsby production build:

$ sudo docker-compose --env-file .env.prod -f docker-compose.prod.yml build

$ sudo docker-compose --env-file .env.prod -f docker-compose.prod.yml up

### Login:

John Doe <johndoe@gmail.com> Password123

## PRODUCTION DEPLOYMENT:

### Retrieve auth token and authenticate your Docker client to the registry.

$ aws ecr get-login-password --region us-east-2 | docker login --username AWS --password-stdin 244252657288.dkr.ecr.us-east-2.amazonaws.com

### Deploy strapi image

$ docker tag maxmastalerzcom_cms-service.maxmastalerz.com-private:latest 244252657288.dkr.ecr.us-east-2.amazonaws.com/strapi:latest

$ docker push 244252657288.dkr.ecr.us-east-2.amazonaws.com/strapi:latest

### Deploy gatsby image:

$ docker tag maxmastalerzcom_gatsby-service.maxmastalerz.com-private:latest 244252657288.dkr.ecr.us-east-2.amazonaws.com/gatsby:latest

$ docker push 244252657288.dkr.ecr.us-east-2.amazonaws.com/gatsby:latest

### Deploy nginx image

$ docker tag maxmastalerzcom_nginx:latest 244252657288.dkr.ecr.us-east-2.amazonaws.com/nginx:latest

$ docker push 244252657288.dkr.ecr.us-east-2.amazonaws.com/nginx:latest

### In-place deployment (Has downtime)

Go into AWS ECS > the maxmastalerzcom-cluster > Services:

For the service you want to in-place deploy, update the service to have a minimum healthy percentage of 0.

Now you can run a redeploy command for the service you wanted to update:

aws ecs update-service --cluster maxmastalerzcom-cluster --service cms-service --force-new-deployment

aws ecs update-service --cluster maxmastalerzcom-cluster --service gatsby-service --force-new-deployment

aws ecs update-service --cluster maxmastalerzcom-cluster --service proxy-service --force-new-deployment

aws ecs update-service --cluster maxmastalerzcom-cluster --service remark42-service --force-new-deployment

### 0 Downtime deployment (Manual step by step process for now):

Prerequisite: Make sure all ECS services(except remark42 which has 0) have a minimum healthy percentage of 100 set.
Go into AWS ECS > the maxmastalerzcom-cluster > Services. For each service(except remark42) set the minimum healthy percentage to 100.
Remark42 currently doesn't work as multiple processes due to the database type it uses.

Set the desired capacity of the autoscaling group ( https://us-east-2.console.aws.amazon.com/ec2autoscaling/home?region=us-east-2#/details/EC2ContainerService-maxmastalerzcom-cluster-EcsInstanceAsg-1C0YFKEAYY25V?view=details ) to 3.

Deploy/Update the service twice so that the service jumps to the new instance and then back to the old instance.

Set the desired capacity of the autoscaling group ( https://us-east-2.console.aws.amazon.com/ec2autoscaling/home?region=us-east-2#/details/EC2ContainerService-maxmastalerzcom-cluster-EcsInstanceAsg-1C0YFKEAYY25V?view=details ) back to 2 when the 3rd instance has no tasks on it. This is to avoid incurring extra costs.