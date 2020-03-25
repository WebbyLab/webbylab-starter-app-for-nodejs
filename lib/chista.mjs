import path           from 'path';
import ChistaModule   from 'chista';
// import logger         from 'bunyan-singletone-facade';

import logger         from './utils/logger.mjs';
import { getDirName } from './utils/index.mjs';

const __dirname = getDirName(import.meta.url);

/* istanbul ignore next */
function getLogger() {
    if (process.env.DEV) return; // UGLY.

    logger.init({
        directory : path.join(__dirname, '../logs'),
        name      : 'modern-node-be' // TODO: CHANGE NAME
    });

    return (type, data) => logger[type](data);
}

export default new ChistaModule.default({
    defaultLogger : getLogger()
});
