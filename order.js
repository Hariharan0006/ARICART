const express = require('express');
const { newOrder, getSingleOrder, myOrders, orders, updateOrder, deleteOrder} = require('../controllers/orderController');
const router = express.Router();
const {isAuthenticatedUser, authorizeRoles} = require('../middlewares/authenticate');

router.route('/order/new').post(isAuthenticatedUser,newOrder);
router.route('/order/:id').get(isAuthenticatedUser,getSingleOrder);
router.route('/myorders').get(isAuthenticatedUser,myOrders);

//Admin routes
router.route('/orders').get(isAuthenticatedUser,authorizeRoles('admin'),orders);
router.route('/order/:id').put(isAuthenticatedUser,authorizeRoles('admin'),updateOrder);
router.route('/order/:id').delete(isAuthenticatedUser,authorizeRoles('admin'),deleteOrder);


module.exports = router;