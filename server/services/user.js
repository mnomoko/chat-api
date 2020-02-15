const User = require('../models').User;
const UserContact = require('../models').UserContact;

module.exports = {
  create(username, password) {
    return User
      .create({
        username,
        password
      })
  },
  getById(id) {
    return User
      .findByPk(id);
  },
  getByUsername(username) {
    return User
      .findOne({
        where: {
          username
        }
      })
  },
  getAll(userId) {
  },
  getAllContacts(id) {
    return User
      .findAll({
        include: [
          {
            model: User,
            as: 'contacts',
            attributes: []
          }
        ],
        where: {
          '$contacts.id$': id
        }
      })
  },
  getOneContact(id, contactId) {
    return User
      .findOne({
        where: {
          id,
          '$contacts.id$': contactId,
        },
        include: [
          {
            model: User,
            as: 'contacts',
            attributes: []
          },
        ],
      })
  },
  deleteOneContact(id, contactId) {
    return UserContact
      .findOne({
        where: {
          userId: id,
          contactId: contactId
        }
      })
  }
};
