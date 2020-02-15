'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.createTable(
        'UserConversations',
        {
          userId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
          },
          conversationId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
          },
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
        }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('UserConversations');
  }
};
