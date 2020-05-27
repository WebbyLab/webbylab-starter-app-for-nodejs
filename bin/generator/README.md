# Automatically generate CRUD from Sequelize Model

CRUD generator - is a powerful instrument for quick CRUD code generation from Sequelize Model. It reads `schema` from Model class and creates and/or updates a set of project files, migrations and tests.

- [Automatically generate CRUD from Sequelize Model](#automatically-generate-crud-from-sequelize-model)
  - [Project files](#project-files)
  - [Tests](#tests)
  - [Usage](#usage)
  - [Options](#options)
    - [Actor option](#actor-option)

## Project files

CRUD generator script creates: use-cases (CRUD), ddump for neew Model, and api endpoints with session checks. Also, you can define a namespace to place all this files in project structure (Default namespace: "main").

```
|-- lib/
    |-- api/
        |-- json-rpc/
            |-- main/
                |-- {Model class name plural}.mjs
                |-- index.mjs (modified: added new file)
        |-- rest-api/
            |-- main/
                |-- controllers
                    |-- {Model class name plural}.mjs
                    |-- index.mjs (modified: added new file)
                |-- router.mjs (modified: added CRUD routes for a model)
    |-- use-cases/
        |-- main
            |-- {Model class name plural}/
                |-- Create.mjs
                |-- Delete.mjs
                |-- List.mjs
                |-- Show.mjs
                |-- Update.mjs
        |-- utils/
            |-- dumps.mjs (modified: added dump function for a model)
|-- migrations/
    |-- {Date}-{Model name plural}.js
```

## Tests

CRUD generator script also creates a set of tests: test-cases fixtures, fixtures data (with [faker](https://github.com/marak/Faker.js/)), test-suites for use-cases and api (REST, JSON-RPC).

```
|-- tests/
    |-- api/
        |-- json-rpc
            |-- main/
                |-- {Model class name plural}-create.mjs
                |-- {Model class name plural}-delete.mjs
                |-- {Model class name plural}-list.mjs
                |-- {Model class name plural}-show.mjs
                |-- {Model class name plural}-update.mjs
        |-- rest-api
            |-- main/
                |-- {Model class name plural}-create.mjs
                |-- {Model class name plural}-delete.mjs
                |-- {Model class name plural}-list.mjs
                |-- {Model class name plural}-show.mjs
                |-- {Model class name plural}-update.mjs
    |-- fixtures/
        |-- data/
            |-- {Model class name plural}.json
        |-- use-cases/
            |-- main/
                |-- {Model class name plural}-create/
                    |-- ... test cases ...
                |-- {Model class name plural}-delete/
                    |-- ... test cases ...
                |-- {Model class name plural}-list/
                    |-- ... test cases ...
                |-- {Model class name plural}-show/
                    |-- ... test cases ...
                |-- {Model class name plural}-update/
                    |-- ... test cases ...
    |-- lib/
        |-- TestFactory.mjs (modified: setup database with a new model fixtures data)
    |-- use-cases/
        |-- main/
            |-- {Model class name plural}-create.mjs
            |-- {Model class name plural}-delete.mjs
            |-- {Model class name plural}-list.mjs
            |-- {Model class name plural}-show.mjs
            |-- {Model class name plural}-update.mjs
```

## Usage

To start CRUD generator script run:

* `./bin/generator.mjs <path to a Model file>`
* or `npm run generate -- <path to a Model file>`

## Options

You can get this output in terminal by passing `-h`, `--help` flag to run command.

```
Usage:
    generate_usecases.js <path_to_model> [--namespace=<namespace>] [--actions=<actions>] [--actor=<actor>]
                                            [--override] [--migration] [--only=<only_layers_list>] [--ignore=<ignore_layers_list>]
    generate_usecases.js -h | --help

Options:
    <path_to_model>         Path to Sequelize Model file with default export.

    <namespace>             Pass namespace you want to wrap files. Default: 'main'.

    <actions>               List of CRUD actions to be created. Default: crudl (
                                c = create, r = show, u = update, d = delete, l = list).

    <actor>                 Model name of Actor to run useCases during tests. Default: 'User'.

    <only_layers_list>      Define layers of Clean Architecture you want to generate for the model
                            divided by ','. Default: all will be generated:
                                - use-cases
                                - rest-api
                                - json-rpc
                                - test-fixtures
                                - test-use-cases
                                - test-rest-api
                                - test-json-rpc
                                [- tests (includes: test-fixtures,
                                   test-use-cases, test-rest-api, test-json-rpc)]

    <ignore_layers_list>    Define layers of Clean Architecture you want to ignore for the model
                            divided by ','. Default: ''.

    -m --migration          Create migration from model.

    -o --override           Pass if you want to override existing files.

    -h --help               Show this screen.
```

### Actor option

This option names which Model will use generated CRUD use-cases. It is needed for API tests generation, because of sessions check for every REST Api request. In our project we have two manipulators (User and Admin).

By default this option has `User` value.