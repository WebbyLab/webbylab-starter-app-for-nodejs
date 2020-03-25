/* eslint import/imports-first:0  import/newline-after-import:0 */

import express       from 'express';
import middlewares   from './lib/middlewares.js';
import adminRouter   from './lib/routers/adminRouter.js';
import router        from './lib/routers/router.js';
import initModels    from './lib/models/initModels.js';
import ServiceBase   from './lib/services/ServiceBase.js';
import config        from './etc/config.js';
import { promisify } from './packages.js';
import './lib/registerValidationRules.js';

const { appPort } = config;

// Init app
console.log(`[App] Init Mode: ${process.env.MODE}`);

const app = express();

app.use(middlewares.json);
app.use(middlewares.urlencoded);
app.use(middlewares.cors);
// app.use(middlewares.multipart);
app.use(middlewares.include);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1', router);

const dbMode = process.env.MODE === 'application' ? 'db' : 'test-db';

const { sequelize } = initModels(config[dbMode]);

// TODO: change
ServiceBase.setSequelizeInstanse(sequelize);

/* istanbul ignore else  */
if (process.env.MODE !== 'test') {
    const server = app.listen(appPort, () => {
        console.log(`[App] STARTING AT PORT ${appPort}`);
    });

    server.closeAsync = promisify(server.close);

    process.on('SIGTERM', async () => {
        console.log('[App] SIGTERM signal catched');

        console.log('[App] Closing server');
        await server.closeAsync();
        console.log('[App] Closing sequelize connections');
        await sequelize.close();

        console.log('[App] Exit');
        process.exit(0);
    });
}

export default app;
