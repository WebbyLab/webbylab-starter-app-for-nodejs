import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import ChistaModule      from 'chista';
import prodLogger        from 'bunyan-singletone-facade';

import devLogger         from './utils/logger.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

/* istanbul ignore next */
function getLogger() {
    let logger = devLogger;

    if (process.env.MODE !== 'development') logger = prodLogger;

    if (process.env.DEV || process.env.LAMBDA) return; // UGLY.

    logger.init({
        directory : path.join(__dirname, '../logs'),
        name      : 'modern-node-be' // TODO: CHANGE NAME
    });

    return (type, data) => logger[type](data);
}

export default new ChistaModule.default({
    defaultLogger : getLogger()
});
