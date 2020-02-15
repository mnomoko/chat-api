const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const OAuth2Server = require('oauth2-server');
const cors = require('cors');

require('dotenv').config();

// Set up the express app
const app = express();

// Log requests to the console.
app.use(logger('dev'));

// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use(cors({
    origin: ['http://localhost:3001', 'http://192.168.1.82:19001'],
    credentials: true
}));

// Auth
app.oauth = new OAuth2Server({
    model: require('./server/auth.js'),
    accessTokenLifetime: 60 * 60,
    allowBearerTokensInQueryString: true
});

// Setup a default catch-all route that sends back a welcome message in JSON format.
require('./server/routes')(app);
app.get('*', (req, res) => res.status(200).send({
    message: 'Welcome to the beginning of nothingness.',
}));

module.exports = app;
