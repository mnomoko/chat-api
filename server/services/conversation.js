const Conversation = require('../models').Conversation;
const Message = require('../models').Message;
const User = require('../models').User;

module.exports = {
    getById(id, userId) {
        return Conversation
            .findByPk(id, {
                include: [
                    {
                        model: Message,
                        as: 'message',
                    },
                    {
                        model: User,
                        as: 'user',
                        attributes: []
                    }
                ],
                where: {
                    '$user.id$': userId
                }
            });
    },
    getAll(userId) {
        return Conversation
            .findAll({
                include: [
                    {
                        model: Message,
                        as: 'message'
                    },
                    {
                        model: User,
                        as: 'user',
                        attributes: []
                    }
                ],
                where: {
                    '$user.id$': userId
                }
            })
    }
};
