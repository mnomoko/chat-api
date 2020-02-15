'use strict';
module.exports = (sequelize, DataTypes) => {
    const UserConversation = sequelize.define('UserConversation', {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references:{
                model: 'User',
                key: 'id'
            }
        },
        conversationId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references:{
                model: 'Conversation',
                key: 'id'
            }
        }
    }, {});
    UserConversation.removeAttribute('id');
    return UserConversation;
};
