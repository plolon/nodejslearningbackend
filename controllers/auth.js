const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false,
  });
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false,
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) return res.redirect('/login');
      bcrypt.compare(password, user.password)
      .then(result => {
        if(result){
          req.session.isLoggedIn = true;
          req.session.user = userl
          return req.session.save((err => {
            console.log(err);
            res.redirect('/');  
          }))
        }
      })
      .catch(err => console.error(err));
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save((err) => {
        console.log(err);
        res.redirect('/');
      });
    })
    .catch((err) => console.log(err));
};

exports.postSignup = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((userDoc) => {
      if (userDoc) return res.redirect('/signup');
      return bcrypt
        .hash(req.body.password, 12)
        .then((hashedPassword) => {
          const user = new User({
            email: req.body.email,
            password: hashedPassword,
            cart: { items: [] },
          });
          return user.save();
        })
        .then((result) => {
          res.redirect('/login');
        })
        .catch((err) => console.error(err));
    })
    .catch((err) => console.error(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect('/');
  });
};
