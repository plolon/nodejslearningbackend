const res = require('express/lib/response');

const getDb = require('../util/database').getDb;

class Product {
  constructor(title, price, description, imageUrl) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
  }

  save() {
    const db = getDb();
    return db
    .collection('products')
    .insertOne(this)
    .then(result => {
      console.log('Created Product!');
      res.redirect('admin/products');
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
}

module.exports = Product;