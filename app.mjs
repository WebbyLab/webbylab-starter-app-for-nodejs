import { stop as stopRestAPI } from './lib/api/rest-api/app.mjs';

import initModels              from './lib/domain-model/initModels.mjs';
import UseCaseBase             from './lib/use-cases/Base.mjs';
import config                  from './lib/config.mjs';

console.log(`[App] Init Mode: ${process.env.MODE}`);
console.log(`[App] Proccess ID ${process.pid}`);

const dbMode = process.env.MODE === 'application' ? 'db' : 'test-db';

const { sequelize } = initModels(config[dbMode]);

// TODO: change
UseCaseBase.setSequelizeInstanse(sequelize);

process.on('SIGTERM', async () => {
    console.log('[App] SIGTERM signal catched');

    await stopRestAPI();
    console.log('[App] Closing sequelize connections');
    await sequelize.close();

    console.log('[App] Exit');
    process.exit(0);
});
