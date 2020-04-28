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
12. User management out of the box **(in progress)**
13. SMTP support


## RUN DEVELOPMENT VERSION
1. docker-compose up
2. npm install (node v14 is required)
3. npm run migration:db
4. npm run migration:test
5. npm test
6. npm run nodemon


## RUN IN CONTAINER (DOCKER) (in progress)
1. make sure docker and docker-compose are installed 
2. run `docker-compose -f docker-compose.yml -f docker-compose.dev.yml up`

## CREATE NEW USER:
npm run create-user -- --email=your@email.com --password=password
