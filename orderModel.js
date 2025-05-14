const mongoose = require('mongoose');
const { isPostalCode } = require('validator');

const orderSchema = mongoose.Schema({
    shippingInfo: {
        address: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        phoneNo: {
            type: String,
            required: true,
            validate: {
                validator: function(v) {
                    return /^\+?[1-9]\d{1,14}$/.test(v); // Example regex for international phone numbers
                },
                message: props => `${props.value} is not a valid phone number!`
            }
        },
        postalCode: {
            type: String,
            required: true,
            validate: {
                validator: function(v) {
                    return isPostalCode(v, 'any'); // Adjust 'any' to your preferred locale
                },
                message: props => `${props.value} is not a valid postal code!`
            }
        },
    },
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'User',
    },
    orderItems: [{
        name: {
            type: String,
            required: true,
        },
        quantity: { // Fixed typo here
            type: Number,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        product: {
            type: mongoose.SchemaTypes.ObjectId,
            required: true,
            ref: 'Product',
        },
    }],
    itemsPrice: {
        type: Number,
        required: true,
        default: 0.0,
    },
    taxPrice: {
        type: Number,
        required: true,
        default: 0.0,
    },
    shippingPrice: {
        type: Number,
        required: true,
        default: 0.0,
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0,
    },
    /**
    paymentInfo: {
        id: {
            type: String,
            required: true
        },
        status: {
            type: String,
            required: true

        }
    }, */
    paidAt: {
        type: Date,
    },
    deliveredAt: {
        type: Date,
    },
    orderStatus: {
        type: String,
        required: true,
        default: 'Processing',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Create the order model

const orderModel = mongoose.model('Order', orderSchema);
module.exports = orderModel;