const express = require("express");
const bodyParser = require("body-parser");
const rootDir = require('./util/path');
const path = require('path');

const app = express();

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const res = require("express/lib/response");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('./public/'));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use((req, res, next) => {
    res.sendFile(path.join(rootDir, 'views', '404.html'));
});

app.listen(3000);