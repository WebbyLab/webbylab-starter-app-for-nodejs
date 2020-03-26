export default {
    verbose   : true,
    testMatch : [
        '**/__tests__/**/*.[jt]s?(x)',
        '**/?(*.)+(spec|test).[tj]s?(x)',
        '**/?(*.)+(spec|test).?(m)js?(x)'
    ],
    moduleFileExtensions : [
        'mjs',
        'js'
    ],
    transform : {
        '\\.m?jsx?$' : 'jest-esm-transformer'
    },
    collectCoverageFrom : [
        '**/lib/**/*.mjs',
        '**/tests/mocks/**/*.mjs',
        '!**/node_modules/**'
    ],
    reporters : [
        'default',
        'jest-junit'
    ],
    coverageReporters : [
        'html'
    ]
};
