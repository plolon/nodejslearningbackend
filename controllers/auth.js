const User = require('../models/user');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const crypto = require('crypto');
const { validationResult } = require('express-validator');

const transport = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.EMAIL_API,
    },
  })
);

exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) message = message[0];
  else message = null;
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message,
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash('error', 'Invalid email or password.');
        return res.redirect('/login');
      }
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              console.log(err);
              res.redirect('/');
            });
          }
          req.flash('error', 'Invalid email or password.');
          res.redirect('/login');
        })
        .catch((err) => {
          console.log(err);
          req.flash('error', 'Invalid email or password.');
          res.redirect('/login');
        });
    })
    .catch((err) => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: errors.array()[0].msg
    });
  }
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
          return transport.sendMail({
            to: req.body.email,
            from: 'plolon@wp.pl',
            subject: 'Signup succeeded!',
            html: '<h1>You successfully signed up!</h1>',
          });
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

exports.getReset = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) message = message[0];
  else message = null;
  res.render('auth/reset', {
    path: '/signup',
    pageTitle: 'Reset Password',
    errorMessage: message,
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.error(err);
      return res.redirect('/reset');
    }
    const token = buffer.toString('hex');
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash('error', "Couldn't find matching user.");
          return res.redirect('/reset');
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 1800000;
        return user.save();
      })
      .then((result) => {
        res.redirect('/');
        transport.sendMail({
          to: req.body.email,
          from: 'plolon@wp.pl',
          subject: 'Password reset',
          html: `
        <p>You requested a password reset</p>
        <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password
        `,
        });
      })
      .catch((err) => console.error(err));
  });
};

exports.getNewPassword = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) message = message[0];
  else message = null;
  User.findOne({ resetToken: req.params.token })
    .then((user) => {
      res.render('auth/new-password', {
        path: '/signup',
        pageTitle: 'Set New Password',
        errorMessage: message,
        token: req.params.token,
        userId: user._id.toString(),
      });
    })
    .catch((err) => console.error(err));
};

exports.postNewPassword = (req, res, next) => {
  let hashedPassword;
  bcrypt
    .hash(req.body.password, 12)
    .then((password) => {
      hashedPassword = password;
      return User.findOne({ _id: req.body.userId });
    })
    .then((user) => {
      if (user.resetTokenExpiration <= Date.now()) {
        req.flash('error', 'Password reset request expired.');
        return res.redirect('/login');
      } else {
        user.password = hashedPassword;
        return user.save().then((result) => {
          console.log(result);
          req.flash('info', 'Password successfully updated.');
          res.redirect('/login');
        });
      }
    })
    .catch((err) => console.error(err));
};
