const Conversation = require('../models').Conversation;
const Message = require('../models').Message;

const ConversationService = require('../services').conversation;

module.exports = {
    create(req, res) {
        const conversationId = req.params.conversation;
        const user = req.params.user;
        ConversationService.getById(conversationId, user)
            .then(() => {
                Message
                    .create({
                        content: req.body.content,
                        username: '',
                        conversationId: req.params.conversation
                    })
                    .then(todo => res.status(201).send(todo))
                    .catch(error => res.status(400).send(error));
            })
            .catch(error => res.status(400).send(error));
    },
    update(req, res) {
        const id = req.params.id;
        const conversationId = req.params.conversation;
        const user = req.params.user;
        ConversationService.getById(conversationId, user)
            .then(() => {
                return Message
                    .findByPk(id)
                    .then(message => {
                        if (!message) {
                            return res.status(404).send({
                                message: 'Message Not Found',
                            });
                        }
                        return message
                            .update({
                                title: req.body.title || message.title,
                            })
                            .then(() => res.status(200).send(message))  // Send back the updated message.
                            .catch((error) => res.status(400).send(error));
                    })
                    .catch(error => res.status(400).send(error))
            })
            .catch(error => res.status(400).send(error))
    },
    list(req, res) {
        const conversationId = req.params.conversation;
        const user = req.params.user;
        ConversationService.getById(conversationId, user)
            .then(conversation => res.status(200).send(conversation.message))
            .catch(error => res.status(400).send(error));
    },
    find(req, res) {
        const conversationId = req.params.conversation;
        const user = req.params.user;
        const id = req.params.id;
        ConversationService.getById(conversationId, user)
            .then(conversation => {
                const message = conversation.message.find(m => m.id === parseInt(id));
                res.status(200).send(message)
            })
            .catch(error => res.status(400).send(error));
    },
    delete(req, res) {
        const conversationId = req.params.conversation;
        const user = req.params.user;
        const id = req.params.id;
        ConversationService.getById(conversationId, user)
            .then(conversation => {
                const message = conversation.message.find(m => m.id === parseInt(id));
                message.destroy()
                    .then(() => res.status(200).send({message: 'Delete with success'}))
                    .catch(error => res.status(400).send(error));
            })
            .catch(error => res.status(400).send(error));
    }
};
