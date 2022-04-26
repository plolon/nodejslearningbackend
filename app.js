const express = require("express");
const bodyParser = require("body-parser");
const rootDir = require('./util/path');
const path = require('path');

const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');

const errorConstroller = require('./controllers/error');

const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminData);
app.use(shopRoutes);

app.use(errorConstroller.get404);

app.listen(3000);