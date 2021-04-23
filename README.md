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

