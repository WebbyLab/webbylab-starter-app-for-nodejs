import { DataTypes } from '../../../packages.mjs';

export default (
    schema,
    skip = []
) => {
    let migrationString = '';

    for (const [ key, field ] of Object.entries(schema)) {
        if (skip.includes(key)) continue;
        migrationString += `${key} : { `;

        for (const [ optionKey, optionValue ] of Object.entries(field)) {
            migrationString += `${optionKey}: `;


            if (optionValue.prototype instanceof DataTypes.ABSTRACT || optionValue instanceof DataTypes.ABSTRACT) {
                const typeKey = typeof optionValue === 'function'
                    ? optionValue.key
                    : optionValue.constructor.key;

                const typeBuilder = {
                    // Strings
                    STRING   : ({ length } = {}) => `Sequelize.STRING${length === undefined ? '' : `(${length})`}`,
                    ENUM     : ({ values = [] } = {}) => `Sequelize.ENUM${values.reduce((accum, curr, i) => `${accum}${i === 0 ? '(' : ', '}'${curr}'`, '')})`,
                    TEXT     : ({ length } = {}) => `Sequelize.TEXT${length === undefined ? '' : `(${length})`}`, // TODO: add support for tiny, medium, long TEXT
                    CITEXT   : () => 'Sequelize.CITEXT', // PostgreSQL and SQLite only.
                    // Boolean
                    BOOLEAN  : () => 'Sequelize.BOOLEAN',
                    // Numbers
                    INTEGER  : () => 'Sequelize.INTEGER',
                    BIGINT   : () => 'Sequelize.BIGINT',
                    FLOAT    : () => 'Sequelize.FLOAT',
                    REAL     : () => 'Sequelize.REAL', // PostgreSQL only.
                    DOUBLE   : () => 'Sequelize.DOUBLE',
                    DECIMAL  : () => 'Sequelize.DECIMAL',
                    // Dates
                    DATE     : () => 'Sequelize.DATE',
                    DATEONLY : () => 'Sequelize.DATEONLY',
                    TIME     : () => 'Sequelize.TIME',
                    // UUIDs
                    UUID     : () => 'Sequelize.UUID',
                    UUIDV4   : () => 'Sequelize.UUIDV4'
                }[typeKey] || function ANY() {
                    console.warn(`There is no fakeBuilder for sequelize type "${typeKey}"`);
                    console.log(field.type);

                    return 'Not supported';
                };

                migrationString += typeBuilder(optionValue.options);
            } else {
                migrationString += JSON.stringify(optionValue);
            }

            migrationString += ', ';
        }


        migrationString += '},\n';
    }

    migrationString = migrationString.trim();

    return migrationString;
};
