/* eslint import/imports-first:0  import/newline-after-import:0 */

import express       from 'express';
import middlewares   from './lib/middlewares.mjs';
import adminRouter   from './lib/routers/adminRouter.mjs';
import router        from './lib/routers/router.mjs';
import initModels    from './lib/models/initModels.mjs';
import ServiceBase   from './lib/services/ServiceBase.mjs';
import config        from './lib/config.mjs';
import { promisify } from './packages.mjs';
import './lib/registerValidationRules.mjs';

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
