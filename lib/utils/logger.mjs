import path         from 'path';
import pino         from 'pino';
import clsNamespace from '../clsNamespace.mjs';

const options = {
    prettyPrint : process.env.NODE_ENV !== 'production',
    redact      : {
        paths : [
            'msg.body.data.password',
            'msg.body.data.confirmPassword',
            'msg.params.data.password',
            'msg.params.data.confirmPassword',
            'msg.params.token',
            'msg.result.data.jwt'
        ],
        censor : '**SENSITIVE DATA**'
    }
    // level : 30
};

class Logger {
    constructor() {}

    init({ name, directory }) {
        this._logger = pino(options, this._selectDestination({ name, directory }));

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
