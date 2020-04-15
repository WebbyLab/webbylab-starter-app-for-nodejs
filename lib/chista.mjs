import ChistaModule      from 'chista';
import makeServiceRunner from './utils/makeServiceRunner.mjs';

const chista = new ChistaModule.default({});

export function setLogger(logger) {
    chista.defaultLogger = (type, data) => logger[type](data);
}

chista.makeServiceRunner = makeServiceRunner;

export default chista;
