const express = require("express");
const bodyParser = require("body-parser");
const rootDir = require('./util/path');
const path = require('path');

const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');

const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminData);
app.use(shopRoutes);

app.use((req, res, next) => {
    res.status(404).render('404', {pageTitle: 'Page not found!', path: ''});
});

app.listen(3000);