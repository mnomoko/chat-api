const Conversation = require('../models').Conversation;
const Message = require('../models').Message;

const ConversationService = require('../services').conversation;
const UserConversationService = require('../services').userconversation;

module.exports = {
    create(req, res) {
        // TODO check for user in contact before create conversation
        const userId = parseInt(req.params.user);
        const receivers = parseInt(req.body.receivers);
        return Conversation
            .create({
                group: req.body.isGroup,
                description: req.body.description
            })
            .then(conversation => {
                const ids = [userId, receivers];
                console.log('userIds', ids);
                Promise.all([ids.forEach(r => UserConversationService.create(r, conversation.id))])
                    .then(() => res.status(201).send(conversation))
                    .catch(error => res.status(400).send(error));
            })
            .catch(error => res.status(400).send(error));
    },
    update(req, res) {
        const id = req.params.id;
        return Conversation
            .findByPk(id, {
                include: [{
                    model: Message,
                    as: 'message',
                }],
            })
            .then(conversation => {
                if (!conversation) {
                    return res.status(404).send({
                        message: 'Conversation Not Found',
                    });
                }
                return conversation
                    .update({
                        group: req.body.isGroup,
                        description: req.body.description
                    })
                    .then(() => res.status(200).send(conversation))  // Send back the updated conversation.
                    .catch((error) => res.status(400).send(error));
            })
            .catch(error => res.status(400).send(error));
    },
    list(req, res) {
        const userId = req.params.user;
        ConversationService.getAll(userId)
            .then(conversations => res.status(200).send(conversations))
            .catch(error => res.status(400).send(error));
    },
    find(req, res) {
        const conversationId = req.params.id;
        const user = req.params.user;
        ConversationService.getById(conversationId, user)
            .then(conversation => {
                if (!conversation) return res.status(404).send({message: 'Conversation Not Found',});
                return res.status(200).send(conversation);
            })
            .catch(error => res.status(400).send(error));
    }
};
