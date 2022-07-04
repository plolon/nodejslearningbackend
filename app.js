const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
const User = require('./models/user');
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// app.use((req, res, next) => {
//   User.findById("62a7400f79354b73202adfbf")
//     .then((user) => {
//       req.user = new User(user.name, user.email, user.cart, user._id);
//       next();
//     })
//     .catch((err) => console.error(err));
// });

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect(
    'mongodb+srv://plolon:e6aXbL7D95sJHsNp@node-shop.zriwiyl.mongodb.net/?retryWrites=true&w=majority'
  )
  .then((result) => {
    const user = new User({
      name: 'Bob',
      email: 'bob@email.com',
      cart: {items: []}
    });
    user.save();
    app.listen(3000);
  })
  .catch((err) => console.error(err));
