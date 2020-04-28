
/* eslint-disable import/no-commonjs */
module.exports = {
    nodeArguments : [
        '--experimental-modules',
        '--experimental-json-modules'
    ],
    serial  : false,
    verbose : false,
    files   : [
        'tests/api/**/*.test.mjs',
        'tests/use-cases/**/*.test.mjs'
    ],
    concurrency          : 3,
    environmentVariables : {
        MODE : 'test'
    }
};
