/* eslint import/imports-first:0  import/newline-after-import:0 */

import express       from 'express';
import { promisify } from '../../../packages.mjs';

import logger        from '../logger.mjs';
import middlewares   from './middlewares.mjs';
import adminRouter   from './admin/router.mjs';
import mainRouter    from './main/router.mjs';

// Init app
const app = express();

app.use(middlewares.json);
app.use(middlewares.clsMiddleware);
app.use(middlewares.urlencoded);
app.use(middlewares.cors);
app.use(middlewares.include);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1', mainRouter);

let server = null;

export function start({ appPort }) {
    server = app.listen(appPort, () => {
        logger.info(`[RestApiApp] STARTING AT PORT ${appPort}`);
    });

    server.closeAsync = promisify(server.close);
}

export async function stop() {
    if (!server) return;
    logger.info('[RestApiApp] Closing server');
    await server.closeAsync();
}

export default app;
