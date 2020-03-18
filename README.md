# WebbyLab's Node.JS startkit

1. Based on ideas of Clean Architecture
2. Well defined abstractions (controllers, service layer, domain model etc).
3. Works for small and large projects
4. Follows 12 factor app approach
5. Modern JS (including ES6 for sequalize)
6. Supports both REST API and GraphQL
7. Follows security best practices
8. Docker support
9. Covered with tests
10. Battle tested
11. Built on top of express.js
12. User management out of the box
13. SMTP support


## RUN DEVELOPMENT VERSION
1. npm install
2. npm run migration:dev
3. npm run nodemon


## RUN IN CONTAINER (DOCKER)
1. make sure docker and docker-compose are installed 
2. run `docker-compose -f docker-compose.yml -f docker-compose.dev.yml up`


## RUN PRODUCTION VERSION
1. apt-get install mysql-server // (5.7.8 version)
2. run mysql-server: ```service mysql start```
3. create mysql schema // new db
4. cp etc/config.json.sample etc/config.json // Set SMTP options (or use local sendmail)
5. cp etc/db.json.sample etc/db.json // Set correct database options
6. npm install
7. npm run migration
8. npm start


## RUN AS LAMBDA
1. npm install -g claudia
2. make sure that you have installed aws cli and setup it
3. prepare RDS or other MySql server and run migration
3. npm run migration
4. claudia generate-serverless-express-proxy --express-module runner
5. claudia create --handler lambda.handler --deploy-proxy-api --region eu-central-1 --role modern-node-be-executor --aws-client-timeout 1200000 --set-env-from-json lambda.env.json

### FOR UPDATE:
6. claudia update --handler lambda.handler --deploy-proxy-api --region eu-central-1 --role modern-node-be-executor --aws-client-timeout 1200000 --set-env-from-json lambda.env.json 

### TODO: describe how to run migrations for lambda


## CREATE NEW USER:
npm run create-user -- --email=your@email.com --password=password
