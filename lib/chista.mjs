import ChistaModule     from 'chista';
import * as chistaUtils from './utils/chistaUtils.mjs';

const chista = new ChistaModule.default({});

export function setLogger(logger) {
    chista.defaultLogger = (type, data) => logger[type](data);
}

chista.makeServiceRunner = chistaUtils.makeServiceRunner;
chista.runService = chistaUtils.runService;

export default chista;
