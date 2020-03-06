/* eslint import/imports-first:0  import/newline-after-import:0 */

import express     from 'express';
import middlewares from './lib/middlewares.js';
import router      from './lib/router.js';
import config      from './etc/config.js';
import './lib/registerValidationRules.js';

const { appPort } = config;

// Init app
const app = express();

app.use(middlewares.json);
app.use(middlewares.urlencoded);
app.use(middlewares.cors);
app.use(middlewares.multipart);
app.use(middlewares.include);
app.use('/api/v1', router);


/* istanbul ignore else  */
if (!process.env.LAMBDA && process.env.MODE !== 'test') {
    app.listen(appPort, () => {
        console.log(`APP STARTING AT PORT ${appPort}`);
    });
}

export default app;
