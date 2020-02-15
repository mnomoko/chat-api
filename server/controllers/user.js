const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models').User;
const UserContact = require('../models').UserContact;

const UserService = require('../services').user;

require('dotenv').config();

const salt = 10;

module.exports = {
    //TODO validate username/password
    create(req, res, next) {
        //TODO check if username already use
      return UserService.getByUsername(req.body.username)
        .then(user => {
          console.log('getByUsername : ', user);
            if(!user) {
                const hash = bcrypt.hashSync(req.body.password, salt);
                const { username } = req.body;
                console.log(username);
                return UserService.create(username, hash)
                    .then(todo => res.status(201).send(todo))
                    .catch(error => res.status(400).send(error));
            }
            else {
                next(new Error('Email in use'));
            }
        })
        .catch(error => res.status(400).send(error));
    },
    login(req, res, next) {
      // TODO check for error 500
        UserService.getByUsername(req.body.username)
            .then(user => {
                if(user) {
                    bcrypt
                        .compare(req.body.password, user.password)
                        .then((result) => {
                            if (result) {
                                jwt.sign({
                                    id: user.id
                                }, process.env.TOKEN_SECRET, {expiresIn: '1h'}, (err, token) => {
                                    setUserIdCookie(req, res, user.id);
                                    res.json({
                                        id: user.id,
                                        token,
                                        message: 'ok'
                                    })
                                });
                            } else {
                                next(new Error('Invalid login'));
                            }
                        })
                }
                else {
                    next(new Error('Invalid login'));
                }
            })
            .catch(error => res.status(400).send(error));
    },
    findOne(req, res, next) {
        const id = req.params.id;
        return User
            .findByPk(id)
            .then(user => {
                if (user) {
                    res.status(200).send(user);
                } else {
                    next(new Error('Not Found'));
                }
            })
            .catch(error => res.status(400).send(error));
    },
    addContact(req, res, next) {
      const id = req.params.user;
      const userId = req.params.id;

      if(id === userId) next(new Error('Cannot add yourself'));

      User.findByPk(id)
          .then(user => {
              if(null === user) next(new Error('User doesn\'t exist'));

              return User
                  .findByPk(userId, {
                    attributes: ['id', 'username']
                  })
                  .then(principal => {
                      principal.addContact(user)
                          .then(() => res.status(200).send(principal))
                          .catch(error => res.status(400).send(error))
                  })
                  .catch(error => res.status(400).send(error));
          })
          .catch(error => res.status(400).send(error));
    },
    listContacts(req, res, next) {
        const id = parseInt(req.params.user);
        return UserService.getAllContacts(id)
            .then(contacts => res.status(200).send(contacts))
            .catch(error => res.status(400).send(error));
    },
    findContact(req, res, next) {
      const userId = parseInt(req.params.user);
      const id = parseInt(req.params.id);

      if(id === userId) next(new Error('Cannot find yourself'));

      return UserService.getOneContact(id, userId)
        .then(contact => res.status(200).send(contact))
        .catch(error => res.status(400).send(error));
    },
    deleteContact(req, res, next) {
      const userId = parseInt(req.params.user);
      const id = parseInt(req.params.id);

      if(id === userId) next(new Error('Cannot delete yourself'));

      return UserService.getOneContact(id, userId)
        .then(() =>
          UserContact
            .findOne({
              where: {
                userId,
                contactId: id
              }
            })
            .then(contact => {
              return contact.destroy()
                .then(() => res.status(200).send({message: 'Deleted with success'}))
                .catch(error => res.status(400).send(error));
            }))
        .catch(error => res.status(400).send(error));
    }
};

function setUserIdCookie(req, res, id){
    const isSecure = req.app.get('env') != 'development';
    res.cookie('user_id', id, {
        httpOnly: true,
        secure: isSecure,
        signed: true
    })
}

function sendOrError(req, res, obj) {

}
