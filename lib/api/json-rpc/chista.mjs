import ChistaModule     from 'chista';
import logger           from '../logger.mjs';
import * as chistaUtils from './utils/chistaUtils.mjs';

// TODO: remove on json rpc sessions complete
export function setContextBuilder(fn) {
    contextBuilder = fn;
}

function getLogger() {
    return (type, data) => logger[type](data);
}

// eslint-disable-next-line func-style
let contextBuilder = () => ({});

const chista = new ChistaModule.default({
    defaultLogger         : getLogger(),
    defaultParamsBuilder  : (params = {}) => params,
    defaultContextBuilder : () => contextBuilder() || {}
});

chista.makeUseCaseRunner = chistaUtils.makeUseCaseRunner;
chista.runUseCase = chistaUtils.runUseCase;

export default chista;
