const getDb = require('../util/database').getDb;
const mongodb = require('mongodb');

class User {
  constructor(name, email){
    this.name = name;
    this.email = email;
  }
  save() {
    const db = getDb();
    return db.collection('users')
      .insertOne(this);
  }

  static findById(userId) {
    const db = getDb();
    return db.collection('users')
    .findOne({_id: new mongodb.ObjectId(userId)})
    .then(user => {
      console.log(user);
      return user;
    })
    .catch(err => console.error(err));
  }
}

module.exports = User;