const express = require('express');
const { render } = require('express/lib/response');
const path = require('path');
const rootDir = require('../util/path');
const adminData = require('./admin');

const router = express.Router();

router.get('/', (req, res, next)=>{
    res.render('shop');
});

module.exports = router;