const express = require('express');
const authController = require('../controllers/auth');
const User = require('../models/user');
const { body } = require('express-validator');
const router = express.Router();

router.get('/login', authController.getLogin);
router.get('/signup', authController.getSignup);
router.post('/login', authController.postLogin);
router.post(
  '/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject(
              'E-mail exists already, please pick a different one.'
            );
          }
        });
      }),
    body(
      'password',
      'Please enter a password with only numbers and text and at least 6 characters.'
    )
      .isLength({ min: 6 })
      .isAlphanumeric(),
    body('confirmPassword', 'Passwords must be same.').custom(
      (value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords have to match.');
        }
        return true;
      }
    ),
  ],
  authController.postSignup
);
router.post('/logout', authController.postLogout);
router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);
router.get('/reset/:token', authController.getNewPassword);
router.post('/new-password/', authController.postNewPassword);

module.exports = router;
