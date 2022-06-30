const Product = require('../models/product');
const User = require('../models/user');

exports.getAddProduct = (req, res, next)=>{
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
    });
};

exports.postAddProduct = (req, res, next) => {
    req.user.createProduct({
      title: req.body.title,
      imageUrl: req.body.imageUrl,
      price: req.body.price,
      description: req.body.description,
      userId: req.user.id
    })
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
  Product.findByPk(prodId)
  .then(product =>{
    if(!product){
      res.redirect('/');
    }
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
  console.log('body', req.body);
    Product.findByPk(req.body.productId)
    .then(product=>{
      product.title=req.body.title;
      product.imageUrl=req.body.imageUrl;
      product.price=req.body.price;
      product.description=req.body.description;
      return product.save();
    })
    .then(res.redirect('/admin/products'))
    .catch(err => console.error(err));
    
};

exports.postDeleteProduct = (req, res, next) => {
  Product.destroy({where: {id: req.body.productId}})
  .then(res.redirect('/admin/products'))
  .catch(err => console.error(err));
    
}

exports.getProducts = (req, res, next) => {
    Product.findAll()
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })
    .catch(err => console.error(err));
};
