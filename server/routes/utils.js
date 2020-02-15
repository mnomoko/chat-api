export function obtainToken(req, res) {

    const request = new Request(req);
    const response = new Response(res);

    return app.oauth.token(request, response)
        .then(function(token) {

            res.json(token);
        }).catch(function(err) {

            res.status(err.code || 500).json(err);
        });
}

export function authenticateRequest(req, res, next) {

    const request = new Request(req);
    const response = new Response(res);

    return app.oauth.authenticate(request, response)
        .then(function(token) {

            next();
        }).catch(function(err) {

            res.status(err.code || 500).json(err);
        });
}

export function ensureLoggedIn(req, res, next) {
    console.log('signedCookies', req.signedCookies);
    if(req.signedCookies.user_id) {
        next();
    } else {
        res.status(401);
        next(new Error('Un-Authorized'));
    }
}

export function allowAccess(req, res, next) {
    if(req.signedCookies.user_id === req.params.user) {
        next();
    } else {
        res.status(401);
        next(new Error('Un-Authorized'));
    }
}
