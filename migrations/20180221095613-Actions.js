

module.exports = {
    up : (queryInterface, Sequelize) => {
        return queryInterface.createTable('Actions', {
            id        : { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
            type      : { type: Sequelize.ENUM('ACTIVATE_USER', 'RESET_PASSWORD'), allowNull: false },
            data      : { type: Sequelize.JSON, allowNull: false },
            createdAt : { type: Sequelize.DATE, allowNull: false },
            updatedAt : { type: Sequelize.DATE, allowNull: false }
        });
    },

    down : (queryInterface) => {
        return queryInterface.dropTable('Actions');
    }
};
