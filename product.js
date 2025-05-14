const express = require('express');
const { getProducts, newProduct, getSingleProduct, updateProduct, deleteProduct, createReview, getReviews, deleteReview, getAdminProducts} = require('../controllers/productController');
const router = express.Router();
const {isAuthenticatedUser, authorizeRoles} = require('../middlewares/authenticate.js')


router.route('/products').get(getProducts);
router.route('/product/:id').get(getSingleProduct);

router.route('/product/:id')
                            .put(updateProduct)  
                            .delete(deleteProduct)                 
router.route('/review').put(isAuthenticatedUser, createReview)
                            .delete(deleteReview)
router.route('reviews').get(getReviews)


//Admin Routes
router.route('/admin/product/new').post(isAuthenticatedUser,authorizeRoles('admin'), newProduct);
router.route('/admin/product').get(isAuthenticatedUser,authorizeRoles('admin'), getAdminProducts);

module.exports = router;