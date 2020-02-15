module.exports = (sequelize, DataTypes) => {
    const UserContact = sequelize.define('UserContact', {
    }, {});

    UserContact.associate = function(models) {
        UserContact.belongsTo(models.User, { as: 'user', onDelete: 'CASCADE'});
        UserContact.belongsTo(models.User, { as: 'contact', onDelete: 'CASCADE' });
    };
    UserContact.removeAttribute('id');
    return UserContact;
};
