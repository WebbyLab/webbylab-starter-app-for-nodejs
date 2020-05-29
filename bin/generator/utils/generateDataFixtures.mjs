import faker      from 'faker';

export default (
    schema,
    len = 3,
    skip = [ 'id', 'passwordHash', 'salt', 'createdAt', 'updatedAt', 'deletedAt' ]
) => {
    const data = [];

    let i = 0;

    while (i++ < len) {
        const object = {};

        for (const [ key, field ] of Object.entries(schema)) {
            if (skip.includes(key)) continue;

            const typeKey = typeof field.type === 'function'
                ? field.type.key
                : field.type.constructor.key;

            const fakeBuilder = {
                // Strings
                STRING   : ({ length = 255 } = {}) => faker.lorem.word().slice(0, length),
                ENUM     : ({ values = [] } = {}) => values[Math.floor(Math.random() * (values.length + 1))],
                TEXT     : () => faker.lorem.text(), // TODO: add support for tiny, medium, long TEXT
                CITEXT   : () => faker.lorem.text(), // PostgreSQL and SQLite only.
                // Boolean
                BOOLEAN  : () => faker.random.boolean(),
                // Numbers
                INTEGER  : () => faker.random.number(),
                BIGINT   : () => faker.random.number(),
                FLOAT    : () => faker.random.float(),
                REAL     : () => faker.random.float(), // PostgreSQL only.
                DOUBLE   : () => faker.random.float(),
                DECIMAL  : () => faker.random.float(),
                // Dates
                DATE     : () => faker.date.recent(),
                DATEONLY : () => faker.date.recent(),
                TIME     : () => faker.date.recent(),
                // UUIDs
                UUID     : () => faker.random.uuid()
            }[typeKey] || function ANY() {
                console.warn(`There is no fakeBuilder for sequelize type "${typeKey}"`);
                console.log(field.type);

                return 'Not supported';
            };

            // Meta validation
            const metaRule = {
                email    : () => faker.internet.email(),
                password : () => 'password'
            }[key];

            object[key] = metaRule ? metaRule() : fakeBuilder(field.type.options);
        }

        data.push(object);
    }

    return data;
};
