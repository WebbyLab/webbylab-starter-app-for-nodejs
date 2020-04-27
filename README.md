# WebbyLab's Node.JS startkit

1. Based on ideas of Clean Architecture
2. Well defined abstractions (controllers, use case layer, domain model etc).
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
2. npm run migration:db
3. npm run nodemon


## RUN IN CONTAINER (DOCKER)
1. make sure docker and docker-compose are installed 
2. run `docker-compose -f docker-compose.yml -f docker-compose.dev.yml up`


## RUN PRODUCTION VERSION
1. apt-get install mysql-server // (8.0.19 version)
2. run mysql-server: ```service mysql start```
3. create mysql schema // new db
4. create .env file // Define variables to override .env.defaults
5. npm install
6. npm run migration:db
7. npm start

## CREATE NEW USER:
npm run create-user -- --email=your@email.com --password=password
