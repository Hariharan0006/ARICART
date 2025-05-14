import MetaData from '../layouts/MetaData';
import { Fragment, useEffect } from 'react';
import { validateShipping } from './Shipping';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import CheckoutSteps from './CheckoutSteps';
import { createOrder } from '../../actions/orderActions';  // Import your action for creating an order
import { toast } from 'react-toastify';  // To display success/failure messages

export default function ConfirmOrder() {
    const { shippingInfo, items: cartItems } = useSelector((state) => state.cartState);
    const { user } = useSelector((state) => state.authState);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Calculate order prices
    const itemsPrice = Number(
        cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
    ).toFixed(2);
    const shippingPrice = itemsPrice > 200 ? 0 : 25.0;
    const taxPrice = Number(0.05 * itemsPrice).toFixed(2);
    const totalPrice = Number(Number(itemsPrice) + shippingPrice + Number(taxPrice)).toFixed(2);

    // Confirm the order (without payment)
    const confirmOrderHandler = async () => {
        const orderData = {
            orderItems: cartItems,
            shippingInfo,
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice,
        };

        try {
            // Dispatch the action to create the order
            await dispatch(createOrder(orderData));

            // Navigate to the success page after creating the order
            navigate('/order/success');
        } catch (error) {
            toast.error('Error placing your order. Please try again.', {
                position: 'bottom-center',
            });
        }
    };

    // Redirect to shipping page if shipping info is not available
    useEffect(() => {
        if (!validateShipping(shippingInfo)) {
            navigate('/shipping');
        }
    }, [shippingInfo, navigate]);

    if (!user || !shippingInfo) {
        return <p>Loading...</p>; // Fallback for missing data
    }

    return (
        <Fragment>
            <MetaData title="Confirm Order" />
            <CheckoutSteps shipping confirmOrder />
            <div className="row d-flex justify-content-between">
                <div className="col-12 col-lg-8 mt-5 order-confirm">
                    <h4 className="mb-3">Shipping Info</h4>
                    <p>
                        <b>Name:</b> {user.name}
                    </p>
                    <p>
                        <b>Phone:</b> {shippingInfo.phoneNo}
                    </p>
                    <p className="mb-4">
                        <b>Address:</b> {`${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}, ${shippingInfo.state}, ${shippingInfo.country}`}
                    </p>

                    <hr />
                    <h4 className="mt-4">Your Cart Items:</h4>

                    {cartItems.map((item) => (
                        <Fragment key={item.product}>
                            <div className="cart-item my-1">
                                <div className="row">
                                    <div className="col-4 col-lg-2">
                                        <img
                                            src={item.image || '/images/default-product.png'}
                                            alt={item.name || 'Product Image'}
                                            height="45"
                                            width="65"
                                        />
                                    </div>
                                    <div className="col-5 col-lg-6">
                                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                                    </div>
                                    <div className="col-4 col-lg-4 mt-4 mt-lg-0">
                                        <p>
                                            {item.quantity} x ${item.price} ={' '}
                                            <b>${(item.quantity * item.price).toFixed(2)}</b>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <hr />
                        </Fragment>
                    ))}
                </div>

                <div className="col-12 col-lg-3 my-4">
                    <div id="order_summary">
                        <h4>Order Summary</h4>
                        <hr />
                        <p>
                            Subtotal: <span className="order-summary-values">${itemsPrice}</span>
                        </p>
                        <p>
                            Shipping: <span className="order-summary-values">${shippingPrice}</span>
                        </p>
                        <p>
                            Tax: <span className="order-summary-values">${taxPrice}</span>
                        </p>
                        <hr />
                        <p>
                            Total: <span className="order-summary-values">${totalPrice}</span>
                        </p>
                        <hr />
                        <button
                            id="checkout_btn"
                            onClick={confirmOrderHandler}  // Call the confirmOrderHandler function
                            className="btn btn-primary btn-block"
                        >
                            Confirm Order
                        </button>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}


/**
import MetaData from '../layouts/MetaData';
import { Fragment, useEffect } from 'react';
import { validateShipping } from './Shipping';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';processPayment
import CheckoutSteps from './CheckoutSteps';
import OrderSuccess from './Payment';

export default function ConfirmOrder() {
    const { shippingInfo, items: cartItems } = useSelector((state) => state.cartState);
    const { user } = useSelector((state) => state.authState);
    const navigate = useNavigate();

    const itemsPrice = Number(
        cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
    ).toFixed(2);
    const shippingPrice = itemsPrice > 200 ? 0 : 25.0;
    const taxPrice = Number(0.05 * itemsPrice).toFixed(2);
    const totalPrice = Number(Number(itemsPrice) + shippingPrice + Number(taxPrice)).toFixed(2);
  /***
    const processPayment = () => {
        const data = {
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice,
        };
        sessionStorage.setItem('orderInfo', JSON.stringify(data));
        navigate('/payment');
    };

    useEffect(() => {
        if (!validateShipping(shippingInfo)) {
            navigate('/shipping');
        }
    }, [shippingInfo, navigate]);

    if (!user || !shippingInfo) {
        return <p>Loading...</p>; // Fallback for missing data
    }

    return (
        <Fragment>
            <MetaData title="Confirm Order" />
            <CheckoutSteps shipping confirmOrder />
            <div className="row d-flex justify-content-between">
                <div className="col-12 col-lg-8 mt-5 order-confirm">
                    <h4 className="mb-3">Shipping Info</h4>
                    <p>
                        <b>Name:</b> {user.name}
                    </p>
                    <p>
                        <b>Phone:</b> {shippingInfo.phoneNo}
                    </p>
                    <p className="mb-4">
                        <b>Address:</b> {`${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}, ${shippingInfo.state}, ${shippingInfo.country}`}
                    </p>

                    <hr />
                    <h4 className="mt-4">Your Cart Items:</h4>

                    {cartItems.map((item) => (
                        <Fragment key={item.product}>
                            <div className="cart-item my-1">
                                <div className="row">
                                    <div className="col-4 col-lg-2">
                                        <img
                                            src={item.image || '/images/default-product.png'}
                                            alt={item.name || 'Product Image'}
                                            height="45"
                                            width="65"
                                        />
                                    </div>
                                    <div className="col-5 col-lg-6">
                                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                                    </div>
                                    <div className="col-4 col-lg-4 mt-4 mt-lg-0">
                                        <p>
                                            {item.quantity} x ${item.price} ={' '}
                                            <b>${(item.quantity * item.price).toFixed(2)}</b>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <hr />
                        </Fragment>
                    ))}
                </div>

                <div className="col-12 col-lg-3 my-4">
                    <div id="order_summary">
                        <h4>Order Summary</h4>
                        <hr />
                        <p>
                            Subtotal: <span className="order-summary-values">${itemsPrice}</span>
                        </p>
                        <p>
                            Shipping: <span className="order-summary-values">${shippingPrice}</span>
                        </p>
                        <p>
                            Tax: <span className="order-summary-values">${taxPrice}</span>
                        </p>
                        <hr />
                        <p>
                            Total: <span className="order-summary-values">${totalPrice}</span>
                        </p>
                        <hr />
                        <button
                            id="checkout_btn"
                            onClick={OrderSuccess}
                            className="btn btn-primary btn-block"
                        >
                            Proceed to Payment
                        </button>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}
*/
