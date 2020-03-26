// eslint-disable-next-line import/no-commonjs
module.exports = (api) => {
    api.cache(true);

    return {
        presets : [
            [ '@babel/preset-env', { targets: { esmodules: true, node: 'current' } } ]
        ],
        plugins : [
            [ '@babel/plugin-proposal-class-properties',
                { 'loose': false }
            ],
            '@babel/plugin-syntax-import-meta'
        ]
    };
};
