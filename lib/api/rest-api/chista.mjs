import ChistaModule     from 'chista';
import logger           from '../logger.mjs';
import * as chistaUtils from './utils/chistaUtils.mjs';

function getLogger() {
    return (type, data) => logger[type](data);
}

const chista = new ChistaModule.default({
    defaultLogger : getLogger()
});

chista.makeUseCaseRunner = chistaUtils.makeUseCaseRunner;
chista.runUseCase = chistaUtils.runUseCase;

export default chista;
