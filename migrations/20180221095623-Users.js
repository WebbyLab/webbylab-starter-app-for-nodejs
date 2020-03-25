
const config = require('../lib/config.cjs');

module.exports = {
    up : (queryInterface, Sequelize) => {
        return queryInterface.createTable('Users', {
            id             : { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
            email          : { type: Sequelize.STRING, allowNull: false, unique: true },
            status         : { type: Sequelize.ENUM('ACTIVE', 'BLOCKED', 'PENDING'), defaultValue: 'PENDING' },
            firstName      : { type: Sequelize.STRING, defaultValue: '' },
            secondName     : { type: Sequelize.STRING, defaultValue: '' },
            avatar         : { type: Sequelize.STRING, defaultValue: '' },
            lang           : { type: Sequelize.STRING, defaultValue: config.defaultLang },
            agreeWithTerms : { type: Sequelize.BOOLEAN, allowNull: false },
            passwordHash   : { type: Sequelize.STRING },
            salt           : { type: Sequelize.STRING },
            createdAt      : { type: Sequelize.DATE, allowNull: false },
            updatedAt      : { type: Sequelize.DATE, allowNull: false }
        });
    },

    down : (queryInterface) => {
        return queryInterface.dropTable('Users');
    }
};
