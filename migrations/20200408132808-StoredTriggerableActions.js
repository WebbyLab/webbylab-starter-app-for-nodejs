
module.exports = {
    up : (queryInterface, Sequelize) => {
        return queryInterface.createTable('StoredTriggerableActions', {
            id        : { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
            type      : { type: Sequelize.ENUM('ACTIVATE_USER', 'RESET_USER_PASSWORD', 'RESET_ADMIN_PASSWORD'), allowNull: false },
            payload   : { type: Sequelize.JSON, allowNull: false },
            createdAt : { type: Sequelize.DATE, allowNull: false },
            updatedAt : { type: Sequelize.DATE, allowNull: false }
        });
    },

    down : (queryInterface) => {
        return queryInterface.dropTable('StoredTriggerableActions');
    }
};
