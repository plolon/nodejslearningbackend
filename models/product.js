const getDb = require('../util/database').getDb;
const mongodb = require('mongodb');

class Product {
  constructor(title, price, description, imageUrl, id) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id;
  }

  save() {
    const db = getDb();
    let dbOp;
    if(this._id) { // Update
       dbOp = db.collection('products')
       .updateOne({_id: new mongodb.ObjectId(this._id)}, {$set: this});
    } else { // Create
      dbOp = db.collection('products')
      .insertOne(this);
    }
    return dbOp
    .then(result => {
      console.log('Created Product!');
    })
    .catch(err => console.error(err));
  }

  static fetchAll() {
    const db = getDb();
    return db.collection('products')
    .find()
    .toArray()
    .then(products => {
      console.log(products);
      return products;
    })
    .catch(err => console.err(err));
  }

  static findById(id) {
    const db = getDb();
    return db.collection('products')
    .find({_id: new mongodb.ObjectId(id)})
    .next()
    .then(product => {
      console.log(product);
      return product;
    })
    .catch(err => console.error(err));
  }
}

module.exports = Product;