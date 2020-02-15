'use strict';
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    content: DataTypes.STRING,
    username: DataTypes.STRING,
    read: DataTypes.BOOLEAN,
    count: DataTypes.INTEGER
  }, {});
  Message.associate = function(models) {
    Message.belongsTo(models.Conversation, {
      foreignKey: 'conversationId',
      as: 'conversation',
      onDelete: 'CASCADE',
    })
  };
  return Message;
};
