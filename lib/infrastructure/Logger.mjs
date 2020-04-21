import pino         from 'pino';
import clsNamespace from '../clsNamespace.mjs';
import testLogger   from '../utils/testLogger.mjs';

const options = {
    prettyPrint : process.env.NODE_ENV !== 'production' && process.env.MODE === 'application',
    redact      : {
        paths : [
            'msg.*.data.password',
            'msg.*.data.confirmPassword',
            'msg.*.password',
            'msg.*.confirmPassword',
            'msg.params.token',
            'msg.result.data.jwt',
            'msg.result.jwt'
        ],
        censor : '**SENSITIVE DATA**'
    }
    // level : 30
};

class Logger {
    constructor() {
        this._logger = process.env.MODE === 'test'
            ? testLogger
            : pino(options);

        this._generateWrappedMethods();
    }

    _generateWrappedMethods() {
        const methods = [ 'trace', 'debug', 'info', 'warn', 'error', 'fatal' ];

        for (const method of methods) {
            this[method] = (...args) => {
                const traceID = clsNamespace.get('traceID');

                this._logger[method]({ traceID }, ...args);
            };
        }
    }
}

export default Logger;
