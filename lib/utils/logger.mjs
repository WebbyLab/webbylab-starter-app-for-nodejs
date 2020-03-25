function Logger() {}

const VERBOSE = 'error';

const PRIORITY = {
    fatal : 0,
    error : 1,
    warn  : 2,
    info  : 3,
    debug : 4,
    trace : 5
};

Logger.prototype = {

    init() {},

    error() {
        if (PRIORITY[VERBOSE] >= PRIORITY.error) console.error(...arguments);
    },

    fatal() {
        if (PRIORITY[VERBOSE] >= PRIORITY.fatal) console.error(...arguments);
    },

    warn() {
        if (PRIORITY[VERBOSE] >= PRIORITY.warn) console.warn(...arguments);
    },

    info() {
        if (PRIORITY[VERBOSE] >= PRIORITY.info) console.log(...arguments);
    },

    debug() {
        if (PRIORITY[VERBOSE] >= PRIORITY.debug) console.log(...arguments);
    },

    trace() {
        if (PRIORITY[VERBOSE] >= PRIORITY.trace) console.log(...arguments);
    }
};

const logger = new Logger();

export default logger;
