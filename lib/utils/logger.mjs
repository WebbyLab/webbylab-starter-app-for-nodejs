import pino         from 'pino';
import clsNamespace from '../clsNamespace.mjs';

class Logger {
    constructor() {
        this._logger = pino({
            prettyPrint : process.env.NODE_ENV !== 'production',
            redact      : {
                paths : [
                    'msg.*.data.password',
                    'msg.*.data.confirmPassword',
                    'msg.*.data.jwt'
                ],
                censor : '**SENSITIVE DATA**'
            }
        });
    }

    init() {

    }

    error(...args) {
        this._logger.error(...args);
    }

    fatal(...args) {
        this._logger.fatal(...args);
    }

    warn(...args) {
        this._logger.warn(...args);
    }

    info(...args) {
        const traceID = clsNamespace.get('traceID');

        this._logger.info({ traceID }, ...args);
    }

    debug(...args) {
        this._logger.debug(...args);
    }

    trace(...args) {
        this._logger.trace(...args);
    }
}

export default new Logger();
