
module.exports = {
    up : (queryInterface, Sequelize) => {
        return queryInterface.createTable('Admins', {
            id           : { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
            email        : { type: Sequelize.STRING, allowNull: false, unique: true },
            passwordHash : { type: Sequelize.STRING },
            salt         : { type: Sequelize.STRING },
            createdAt    : { type: Sequelize.DATE, allowNull: false },
            updatedAt    : { type: Sequelize.DATE, allowNull: false }
        });
    },

    down : (queryInterface) => {
        return queryInterface.dropTable('Admins');
    }
};
