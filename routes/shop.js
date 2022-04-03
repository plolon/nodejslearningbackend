const express = require('express');

const router = express.Router();

router.get('/', (req, res, next)=>{
    console.log('default middleware!');
    res.send('<h1>Welcome at home page<h1>');
});

module.exports = router;