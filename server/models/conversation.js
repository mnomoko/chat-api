'use strict';
module.exports = (sequelize, DataTypes) => {
  const Conversation = sequelize.define('Conversation', {
    group: DataTypes.BOOLEAN,
    description: DataTypes.STRING
  }, {});
  Conversation.associate = function(models) {
    // associations can be defined here
    Conversation.belongsToMany(models.User, {
      through: 'UserConversation',
      as: 'user',
      foreignKey: 'conversationId'
    });

    Conversation.hasMany(models.Message, {
      foreignKey: 'conversationId',
      as: 'message',
    });
  };
  return Conversation;
};
