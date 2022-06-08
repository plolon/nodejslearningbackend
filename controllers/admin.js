const Product = require('../models/product');
const mongodb = require('mongodb');

exports.getAddProduct = (req, res, next)=>{
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
    });
};

exports.postAddProduct = (req, res, next) => {
    const product = new Product(
      req.body.title,
      req.body.price,
      req.body.description,
      req.body.imageUrl
    );
    product.save()
    .then(result => {
      console.log(result)
      res.redirect('admin/products');
    })
    .catch(err => console.error(err));
};

exports.getEditProduct = (req, res, next)=>{
  const editMode = req.query.edit;
  if(!editMode){
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
  .then(product =>{
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product
    });
  })
  .catch(err => console.error(err));
};

exports.postEditProduct = (req, res, next) => {
      const product = new Product(
      req.body.title,
      req.body.price,
      req.body.description,
      req.body.imageUrl,
      new mongodb.ObjectId(req.body.productId)
      );
      product.save()
    .then(res.redirect('/admin/products'))
    .catch(err => console.error(err));
};

// exports.postDeleteProduct = (req, res, next) => {
//   Product.destroy({where: {id: req.body.productId}})
//   .then(res.redirect('/admin/products'))
//   .catch(err => console.error(err));
    
// }

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })
    .catch(err => console.error(err));
};
