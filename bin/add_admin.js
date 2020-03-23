#!/usr/bin/env node
import { docopt } from '../packages.js';

import config     from '../etc/config.js';

import Admin      from '../lib/models/Admin.js';
import initModels from '../lib/models/initModels.js';

const dbMode = process.env.MODE === 'application' ? 'db' : 'test-db';

const doc =
`Usage:
   add_admin.js --login=<login> --password=<password> [--drop]
   add_admin.js -h | --help

Options:
   -h --help                 Show this screen.
   -l --login <login>        Login for new admin.
   -p --password <password>  Password for new admin.
   -d --drop                 Drop database first.
`;

main(docopt(doc));

async function dropAllAdmins() {
    await Admin.destroy({ where: {} });
}

async function main(opts) {
    initModels(config[dbMode]);
    const userData = {
        login    : opts['--login'] ? opts['--login'] : 'admin@mail.com',
        password : opts['--password']
    };

    if (opts['--drop']) await dropAllAdmins();

    try {
        await Admin.create(userData);
    } catch (error) {
        console.error(error);

        process.exit(1);
    }
}
