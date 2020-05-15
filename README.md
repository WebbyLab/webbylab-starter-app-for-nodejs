# WebbyLab's Node.JS starterkit

1. Based on ideas of [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) and [DDD](https://dddcommunity.org/)
2. Well defined abstractions (controllers, use case layer, domain model etc).
3. Works for small and large projects
4. Follows [12 factor app](https://12factor.net/) approach
5. Modern JS (including ES6 for sequalize)
6. Supports both REST API and JSON RPC (WS)
7. Follows security best practices
8. [Docker](https://docs.docker.com/) support
9. Covered with tests
10. Battle tested
11. Built on top of [express.js](https://expressjs.com/)
12. User management out of the box **(in progress)**
13. SMTP support
14. Works in Linux, Mac, Windows
15. Generate folders/files from Sequelize Model

## REQUIREMENTS
* NodeJS v13+
* Docker v18+
* Docker Compose v1.23+

## RUN DEVELOPMENT VERSION
1. docker-compose up
2. npm install
3. npm run migration:db
4. npm run migration:test
5. npm test
6. npm run nodemon

## RUN IN CONTAINER (DOCKER) (in progress)
1. make sure docker and docker-compose are installed 
2. run `docker-compose -f docker-compose.yml -f docker-compose.dev.yml up`

## SCRIPTS
* `nodemon` - runs app with nodemon
* `noddemon:docker` - runs app in container (docker)
* `start` - runs app with node (NODE_ENV=production)
* `test:lint` - runs eslint for: lib/, tests/, app.mjs
* `test:ava` - runs tests with [ava](https://github.com/avajs/ava)
* `test:coverage` - runs coverage test with [c8](https://github.com/bcoe/c8)
* `test:audit` - runs npm audit
* `test` - runs all tests: lint, audit, ava, coverage
* `create:admin` - creates new admin: npm run create:admin -- --email=your@email.com --password=password
* `migration:db` - runs sequelize migration with `--env db` parameter
* `migration:test` - runs sequelize migration with `--env test-db` parameter
* `generate` - generates folders/files from Sequelize Model

