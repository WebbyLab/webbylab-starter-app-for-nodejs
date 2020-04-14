import path           from 'path';
import ChistaModule   from 'chista';

import logger            from './utils/logger.mjs';
import makeServiceRunner from './utils/makeServiceRunner.mjs';
import { getDirName }    from './utils/index.mjs';

const dirname = getDirName(import.meta.url);

/* istanbul ignore next */
function getLogger() {
    logger.init({
        directory : path.join(dirname, '../logs'),
        name      : process.env.PROJECT_NAME
    });

    return (type, data) => logger[type](data);
}

const chista = new ChistaModule.default({
    defaultLogger : getLogger()
});

chista.makeServiceRunner = makeServiceRunner;

export default chista;
