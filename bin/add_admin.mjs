#!/usr/bin/env node
import { docopt } from '../packages.mjs';

import config     from '../lib/config.cjs';
import Admin      from '../lib/domain-model/Admin.mjs';
import initModels from '../lib/domain-model/initModels.mjs';

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
    initModels(config.db);
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
