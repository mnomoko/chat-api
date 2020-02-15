const conversationController = require('../controllers').conversation;
import {allowAccess, ensureLoggedIn} from "./utils";

module.exports = (app) => {
    app.post('/api/users/:user/conversations/', ensureLoggedIn, conversationController.create);
    app.put('/api/users/:user/conversations/:id', ensureLoggedIn, allowAccess, conversationController.update);
    app.get('/api/users/:user/conversations', ensureLoggedIn, conversationController.list);
    app.get('/api/users/:user/conversations/:id', ensureLoggedIn, allowAccess, conversationController.find);
};
