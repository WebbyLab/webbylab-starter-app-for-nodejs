import path             from 'path';
import { getDirName }   from './lib/utils/index.mjs';
import * as Chista      from './lib/chista.mjs';
import * as API         from './lib/api/index.mjs';
import * as RestAPI     from './lib/api/rest-api/app.mjs';
import * as DomainModel from './lib/domain-model/index.mjs';
import Logger           from './lib/infrastructure/Logger.mjs';
import EmailSender      from './lib/infrastructure/notificator/Mail.mjs';
import UseCaseBase      from './lib/use-cases/Base.mjs';
import config           from './lib/config.cjs';

// Init infrastructure
const dirname = getDirName(import.meta.url);
const logger  = new Logger();

logger.init({
    directory : path.join(dirname, './logs'),
    name      : process.env.PROJECT_NAME
});

const notificator = new EmailSender({
    mailOptions : config.mail,
    mainUrl     : config.mainUrl
});

logger.info(`[App] Init Mode: ${process.env.MODE}`);

// Init Chista
Chista.setLogger(logger);

// Init Controllers Layer (API)
API.setLogger(logger);
RestAPI.start({
    appPort : config.appPort
});

// Init Domain Model Layer
const dbMode = process.env.MODE === 'application' ? 'db' : 'test-db';
const { sequelize } = DomainModel.initModels(config[dbMode]);

DomainModel.setLogger(logger);

// Init Use Cases Layer
UseCaseBase.setSequelizeInstanse(sequelize);
UseCaseBase.setNotificatorInstanse(notificator);


// Subscribe to system signals
process.on('SIGTERM', async () => {
    logger.info('[App] SIGTERM signal catched');

    await shutdown();
});

process.on('SIGINT', async () => {
    logger.info('[App] SIGINT signal catched');

    await shutdown();
});

// Graceful shutdown
async function shutdown() {
    await RestAPI.stop();
    logger.info('[App] Closing sequelize connections');
    await sequelize.close();

    logger.info('[App] Exit');
    process.exit(0);
}
