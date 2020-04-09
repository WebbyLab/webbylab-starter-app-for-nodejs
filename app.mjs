import { stop as stopRestAPI } from './lib/api/rest-api/app.mjs';

import initModels              from './lib/domain-model/initModels.mjs';
import { setLogger as setDomainModelLogger } from './lib/domain-model/logger.mjs';
import UseCaseBase             from './lib/use-cases/Base.mjs';
import logger                  from './lib/utils/logger.mjs';
import config                  from './lib/config.cjs';

logger.info(`[App] Init Mode: ${process.env.MODE}`);

const dbMode = process.env.MODE === 'application' ? 'db' : 'test-db';

const { sequelize } = initModels(config[dbMode]);

// TODO: change
UseCaseBase.setSequelizeInstanse(sequelize);

setDomainModelLogger(logger);
process.on('SIGTERM', async () => {
    logger.info('[App] SIGTERM signal catched');

    await shutdown();
});

process.on('SIGINT', async () => {
    logger.info('[App] SIGINT signal catched');

    await shutdown();
});

async function shutdown() {
    await stopRestAPI();
    logger.info('[App] Closing sequelize connections');
    await sequelize.close();

    logger.info('[App] Exit');
    process.exit(0);
}
