/* eslint import/imports-first:0  import/newline-after-import:0 */

import express       from 'express';
import { promisify } from '../../../packages.mjs';

import config        from '../../config.mjs';

import middlewares   from './middlewares.mjs';
import adminRouter   from './routers/adminRouter.mjs';
import router        from './routers/router.mjs';

const { appPort } = config;

// Init app
const app = express();

app.use(middlewares.json);
app.use(middlewares.urlencoded);
app.use(middlewares.cors);
// app.use(middlewares.multipart);
app.use(middlewares.include);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1', router);

let server = null;

/* istanbul ignore else  */
if (process.env.MODE !== 'test') {
    server = app.listen(appPort, () => {
        console.log(`[RestApiApp] STARTING AT PORT ${appPort}`);
    });

    server.closeAsync = promisify(server.close);
}

export async function stop() {
    if (!server) return;
    console.log('[RestApiApp] Closing server');
    await server.closeAsync();
}

export default app;
