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
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById("62c34b1ca62ebec7cc5e5276")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.error(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorController.get404);

mongoose
  .connect(
    'mongodb+srv://plolon:e6aXbL7D95sJHsNp@node-shop.zriwiyl.mongodb.net/?retryWrites=true&w=majority'
  )
  .then((result) => {
    User.findOne().then(user => {
      if(!user){
        const user = new User({
          name: 'Bob',
          email: 'bob@email.com',
          cart: { items: [] }
        });
        user.save();
      }
    })
    app.listen(3000);
  })
  .catch((err) => console.error(err));
