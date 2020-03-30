/* eslint-disable import/no-commonjs */
module.exports = {
    nodeArguments : [
        '--experimental-modules',
        '--experimental-json-modules'
    ],
    serial  : true,
    verbose : true,
    files   : [
        'tests/use-cases/**'
    ]
};
