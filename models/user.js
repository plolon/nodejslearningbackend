const getDb = require("../util/database").getDb;
const mongodb = require("mongodb");

class User {
  constructor(name, email, cart, id) {
    this.name = name;
    this.email = email;
    this.cart = cart;
    this._id = id;
  }
  save() {
    const db = getDb();
    return db.collection("users").insertOne(this);
  }

  addToCart(product) {
    // const cartProduct = this.cart.items.findIndex(cp => {
    //   return cp.id === product.id;
    // });
    product.quantity = 1;
    const updatedCart = { items: [{ ...product, quantity: 1 }] };
    const db = getDb();
    return db.collection('users')
    .updateOne(
      {_id: new mongodb.ObjectId(this._id)},
      {$set: {cart: updatedCart}
    });
  }

  static findById(userId) {
    const db = getDb();
    return db
      .collection("users")
      .findOne({ _id: new mongodb.ObjectId(userId) })
      .then((user) => {
        console.log(user);
        return user;
      })
      .catch((err) => console.error(err));
  }
}

module.exports = User;
