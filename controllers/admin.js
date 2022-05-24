const Product = require('../models/product');

exports.getAddProduct = (req, res, next)=>{
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
    });
};

exports.postAddProduct = (req, res, next) => {
    const product = new Product(
      req.body.title,
      req.body.imageUrl,
      req.body.price,
      req.body.description,
      );
    product.save();
    res.redirect('/');
};

exports.getEditProduct = (req, res, next)=>{
  const editMode = req.query.edit;
  if(!editMode){
    return res.redirect('/');
  }
  res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode
  });
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {
      res.render('admin/product-list', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    });
};
