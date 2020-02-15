const UserConversation = require('../models').UserConversation;

module.exports = {
    create(userId, conversationId) {
        return UserConversation
            .create({
                userId,
                conversationId
            })
    }
};
