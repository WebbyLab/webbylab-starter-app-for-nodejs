/* eslint-disable import/no-commonjs */
module.exports = {
    nodeArguments : [
        '--experimental-modules',
        '--experimental-json-modules'
    ],
    serial  : true,
    verbose : false,
    files   : [
        'tests/api/**/*.test.mjs',
        'tests/use-cases/**/*.test.mjs'
    ],
    concurrency          : 1,
    environmentVariables : {
        MODE : 'test'
    }
};
