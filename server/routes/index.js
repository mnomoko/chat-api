const conversationController = require('../controllers').conversation;
const messageController = require('../controllers').message;
const userController = require('../controllers').user;

const OAuth2Server = require('oauth2-server');
const Request = OAuth2Server.Request;
const Response = OAuth2Server.Response;

module.exports = (app) => {
    app.use(function (req, res, next) {
        res.header('Content-Type', 'application/json');
        next();
    });
    app.get('/', authenticateRequest, function(req, res) {

        res.send('Congratulations, you are in a secret area!');
    });

    app.get('/api', (req, res) => res.status(200).send({
        message: 'Welcome to the Message API!',
    }));

    //Conversations
    app.post('/api/users/:user/conversations/', ensureLoggedIn, allowAccess, conversationController.create);
    app.put('/api/users/:user/conversations/:id', ensureLoggedIn, allowAccess, conversationController.update);
    app.get('/api/users/:user/conversations', ensureLoggedIn, allowAccess, conversationController.list);
    app.get('/api/users/:user/conversations/:id', ensureLoggedIn, allowAccess, conversationController.find);

    // TODO: make contact controller work !!!
    //Contacts
    app.post('/api/users/:user/contacts/:id', ensureLoggedIn, allowAccess, userController.addContact);
    app.get('/api/users/:user/contacts', ensureLoggedIn, allowAccess, userController.listContacts);
    app.get('/api/users/:user/contacts/:id', ensureLoggedIn, allowAccess, userController.findContact);
    app.delete('/api/users/:user/contacts/:id', ensureLoggedIn, allowAccess, userController.deleteContact);

    //Messages
    app.post('/api/users/:user/conversations/:conversation/messages/', ensureLoggedIn, allowAccess, messageController.create);
    app.get('/api/users/:user/conversations/:conversation/messages', ensureLoggedIn, allowAccess, messageController.list);
    app.get('/api/users/:user/conversations/:conversation/messages/:id', ensureLoggedIn, allowAccess, messageController.find);
    app.delete('/api/users/:user/conversations/:conversation/messages/:id', ensureLoggedIn, allowAccess, messageController.delete);

    //Users
    app.post('/api/signup', userController.create);
    app.post('/api/signin', userController.login);
    app.get('/api/logout', (req, res) => {
        res.clearCookie('user_id');
        res.json({
            message: "logged out"
        })
    });

    app.all('/oauth/token', obtainToken);

    function obtainToken(req, res) {

        const request = new Request(req);
        const response = new Response(res);

        return app.oauth.token(request, response)
            .then(function(token) {

                res.json(token);
            }).catch(function(err) {

                res.status(err.code || 500).json(err);
            });
    }

    function authenticateRequest(req, res, next) {

        const request = new Request(req);
        const response = new Response(res);

        return app.oauth.authenticate(request, response)
            .then(function(token) {

                next();
            }).catch(function(err) {

                res.status(err.code || 500).json(err);
            });
    }

    function ensureLoggedIn(req, res, next) {
        console.log('signedCookies', req.signedCookies);
        if(req.signedCookies.user_id) {
            next();
        } else {
            res.status(401);
            next(new Error('Un-Authorized'));
        }
    }

    function allowAccess(req, res, next) {
        if(req.signedCookies.user_id === req.params.user) {
            next();
        } else {
            res.status(401);
            next(new Error('Un-Authorized'));
        }
    }
};
