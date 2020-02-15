'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    private: DataTypes.BOOLEAN,
    favorite: DataTypes.BOOLEAN
  }, {});
  User.associate = function(models) {
    // associations can be defined here
    User.belongsToMany(models.Conversation, {
      through: 'UserConversation',
      as: 'userConversation',
      foreignKey: 'userId'
    });
    User.belongsToMany(models.User, { through: 'UserContacts', as: 'users', foreignKey: 'userId' });
    User.belongsToMany(models.User, { through: 'UserContacts', as: 'contacts', foreignKey: 'contactId' });
  };
  return User;
};
