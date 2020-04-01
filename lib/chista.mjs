import path           from 'path';
import ChistaModule   from 'chista';

import logger         from './utils/logger.mjs';
import { getDirName } from './utils/index.mjs';

const dirname = getDirName(import.meta.url);

/* istanbul ignore next */
function getLogger() {
    logger.init({
        directory : path.join(dirname, '../logs'),
        name      : 'modern-node-be' // TODO: CHANGE NAME
    });

    return (type, data) => logger[type](data);
}

export default new ChistaModule.default({
    defaultLogger : getLogger()
});
