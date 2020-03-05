
const config = require('../etc/config');

module.exports = {
    up : (queryInterface, Sequelize) => {
        return queryInterface.createTable('Users', {
            id             : { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
            email          : { type: Sequelize.STRING, allowNull: false, unique: true },
            status         : { type: Sequelize.ENUM('ACTIVE', 'BLOCKED', 'PENDING'), defaultValue: 'PENDING' },
            role           : { type: Sequelize.ENUM('ADMIN', 'USER') },
            firstName      : { type: Sequelize.STRING, defaultValue: '' },
            secondName     : { type: Sequelize.STRING, defaultValue: '' },
            avatar         : { type: Sequelize.STRING, defaultValue: '' },
            lang           : { type: Sequelize.STRING, defaultValue: config.defaultLang },
            agreeWithTerms : { type: Sequelize.BOOLEAN, allowNull: false },
            passwordHash   : { type: Sequelize.STRING },
            // updatedBy      : { type: Sequelize.UUID, allowNull: false },
            createdAt      : { type: Sequelize.DATE, allowNull: false },
            updatedAt      : { type: Sequelize.DATE, allowNull: false }
        });
    },

    down : (queryInterface) => {
        return queryInterface.dropTable('Users');
    }
};
