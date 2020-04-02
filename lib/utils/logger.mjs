import path         from 'path';
import pino         from 'pino';
import clsNamespace from '../clsNamespace.mjs';

const options = {
    prettyPrint : process.env.NODE_ENV !== 'production',
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
        this._stdoutLogger = pino(options);
    }

    init({ name, directory }) {
        this._logger = pino(options, this._selectDestination({ name, directory }));

        this._generateWrappedMethods();
    }

    _selectDestination({ name, directory }) {
        if (process.env.NODE_ENV !== 'production') return pino.destination(1);

        return pino.destination(path.join(directory, `${name}.log`));
    }

    _generateWrappedMethods() {
        const methods = [ 'trace', 'debug', 'info', 'warn' ];

        for (const method of methods) {
            this[method] = (...args) => {
                const traceID = clsNamespace.get('traceID');

                this._logger[method]({ traceID }, ...args);
            };
        }
    }

    error(...args) {
        const traceID = clsNamespace.get('traceID');

        this._logger.error({ traceID }, ...args);
        this._stdoutLogger.error({ traceID }, ...args);
    }

    fatal(...args) {
        const traceID = clsNamespace.get('traceID');

        this._logger.fatal({ traceID }, ...args);
        this._stdoutLogger.fatal({ traceID }, ...args);
    }
}

export default new Logger();
