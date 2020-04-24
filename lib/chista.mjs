import ChistaModule     from 'chista';
import * as chistaUtils from './utils/chistaUtils.mjs';

const chista = new ChistaModule.default({});

export function setLogger(logger) {
    chista.defaultLogger = (type, data) => logger[type](data);
}

chista.makeUseCaseRunner = chistaUtils.makeUseCaseRunner;
chista.runUseCase = chistaUtils.runUseCase;

export default chista;
