#!/usr/bin/env node
import { docopt } from '../packages.mjs';

import config     from '../etc/config.mjs';

import Admin      from '../lib/models/Admin.mjs';
import initModels from '../lib/models/initModels.mjs';

const dbMode = process.env.MODE === 'application' ? 'db' : 'test-db';

const doc =
`Usage:
   add_admin.js --email=<email> --password=<password> [--drop]
   add_admin.js -h | --help

Options:
   -h --help                 Show this screen.
   -l --email <email>        Login for new admin.
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
        email    : opts['--email'] ? opts['--email'] : 'admin@mail.com',
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
