const Cart = require('./cart');
const db = require('../util/database');

module.exports = class Product {
  constructor(id, title, imageUrl, price, description) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  }

  save() {
    return db.query('INSERT INTO products (title, price, imageUrl, description) VALUES ($1, $2, $3, $4)',
    [this.title, this.price, this.imageUrl, this.description]);
  }

  static deleteById(id){

  }

  static fetchAll() {
    return db.query('SELECT * FROM products');
  }

  static findById(id) {
    return db.query('SELECT * FROM products WHERE id = $1', [id]);
  }
};