const { redirect } = require('express/lib/response');
const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
  .then(products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products',
    });
  })
  .catch(err => console.error(err));
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
  .then(product => {
    res.render('shop/product-detail', {
      product: product,
      pageTitle: product.title,
      path: '/products'
    });
  })
  .catch(err => console.error(err));
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
  .then(products => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'All Products',
      path: '/',
    });
  })
  .catch(err => console.error(err));
};

exports.getCart = (req, res, next) => {
  req.user.getCart()
  .then(cart => {
    cart.getProducts()
    .then(products => {
      res.render('shop/cart', {
        pageTitle: 'Your Cart',
        path: '/cart',
        products: products
      });
    })
    .catch(err => console.error(err));
  })
  .catch(err => console.error(err));
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout',
  });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;
  req.user.getCart()
  .then(cart => {
    fetchedCart = cart;
    return cart.getProducts({where: {id: prodId}});
  })
  .then(products => {
    let product;
    if (products.length > 0) {
      product = products[0];
    }
    if (product) {
      const oldQuantity = product.cart_item.quantity;
      newQuantity = oldQuantity + 1;
      return product;
    }
    return Product.findByPk(prodId);
  })
  .then(product => {
    return fetchedCart.addProduct(product, {
      through: { quantity: newQuantity}
    });
  })
  .then(() => {
    res.redirect('/cart');
  })
  .catch(err => console.error(err));
};

exports.postDeleteCartProduct = (req, res, next) => {
  const productId = req.body.productId;
  req.user.getCart()
  .then(cart => {
    return cart.getProducts({where: {id: productId}});
  })
  .then(products => {
    const product = products[0];
    return product.cart_item.destroy();
  })
  .then(result => {
    res.redirect('/cart');
  })
  .catch(err => console.error(err));

  Product.findByPk(productId);
};

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user.getCart()
  .then(cart => {
    fetchedCart = cart;
    return cart.getProducts();
  })
  .then(products => {
    return req.user.createOrder()
    .then(order => {
      return order.addProducts(products.map(product => {
        product.order_item = {quantity: product.cart_item.quantity};
        return product;
      }));
    })
    .catch(err => console.error(err));
  })
  .then(result => {
    return fetchedCart.setProducts(null);
  })
  .then(result => {
    res.redirect('/orders'); 
  })
  .catch(err => console.error(err));
};

exports.getOrders = (req, res, next) => {
  req.user.getOrders({include: ['products']})
  .then(orders => {
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders: orders
    });
  })
  .catch(err => console.error(err));
};