export default (
    schema,
    skip = [ 'id', 'password', 'passwordHash', 'salt' ],
    requireMode = 'none', // 'all', 'notNull'
    output = 'string'
) => {
    const livrRules = {};

    for (const [ key, field ] of Object.entries(schema)) {
        if (skip.includes(key)) continue;

        let rules = [];

        // Required validation
        if (requireMode === 'all') rules.push('required');
        else if (requireMode === 'notNull' && field.allowNull === false) rules.push('required');

        // Type validation
        const typeKey = typeof field.type === 'function'
            ? field.type.key
            : field.type.constructor.key;

        const ruleBuilder = {
            // Strings
            STRING   : ({ length = 255 } = {}) => ([ 'string', { 'max_length': length } ]),
            ENUM     : ({ values = [] } = {}) => ([ { 'one_of': values } ]),
            TEXT     : ({ length } = {}) => ([ 'string', ...(length ? [ { 'max_length': length } ] : []) ]), // TODO: add support for tiny, medium, long TEXT
            CITEXT   : () => ([ 'string' ]), // PostgreSQL and SQLite only.
            // Boolean
            BOOLEAN  : () => ([ 'boolean' ]),
            // Numbers
            INTEGER  : () => ([ 'integer' ]),
            BIGINT   : () => ([ 'integer' ]),
            FLOAT    : () => ([ 'decimal' ]),
            REAL     : () => ([ 'decimal' ]), // PostgreSQL only.
            DOUBLE   : () => ([ 'decimal' ]),
            DECIMAL  : () => ([ 'decimal' ]),
            // Dates
            DATE     : () => ([ 'iso_date' ]),
            DATEONLY : () => ([ 'iso_date' ]),
            TIME     : () => ([ 'iso_date' ]),
            // UUIDs
            UUID     : () => ([ 'uuid' ])
        }[typeKey] || function ANY() {
            console.warn(`There is no ruleBuilder for sequelize type "${typeKey}"`);
            console.log(field.type);

            return [ 'any' ];
        };

        rules = rules.concat(ruleBuilder(field.type.options));

        // Meta validation
        const metaRule = {
            email : 'email'
        }[key];

        if (metaRule) rules.push(metaRule);

        livrRules[key] = rules;
    }

    if (output !== 'string') return livrRules;

    let livrRulesString = '';

    for (const [ key, value ] of Object.entries(livrRules)) {
        livrRulesString += `${key} : ${JSON.stringify(value)},\n`;
    }

    livrRulesString = livrRulesString.trim();

    return livrRulesString;
};
