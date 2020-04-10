import path         from 'path';
import pino         from 'pino';
import clsNamespace from '../clsNamespace.mjs';
import testLogger   from './testLogger.mjs';

const options = {
    prettyPrint : process.env.NODE_ENV !== 'production' && process.env.MODE === 'application',
    redact      : {
        paths : [
            'msg.*.data.password',
            'msg.*.data.confirmPassword',
            'msg.*.password',
            'msg.*.confirmPassword',
            'msg.params.token',
            'msg.result.data.jwt'
        ],
        censor : '**SENSITIVE DATA**'
    }
    // level : 30
};

class Logger {
    constructor() {
        this._logger = {};
    }

    init({ name, directory } = {}) {
        if (process.env.MODE === 'test') {
            this._logger = testLogger;
        } else {
            this._logger = pino(options, this._selectDestination({ name, directory }));
        }

        this._generateWrappedMethods();
    }

    _selectDestination({ name, directory }) {
        if (process.env.NODE_ENV !== 'production') return pino.destination(1);

        return pino.destination(path.join(directory, `${name}.log`));
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

export default new Logger();
