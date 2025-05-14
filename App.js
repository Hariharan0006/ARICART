import './App.css';
import Footer from './components/layouts/Footer';
import Header from './components/layouts/Header';
import Home from './components/Home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductDetail from './components/Product/ProductDetail';
import ProductSearch from './components/Product/ProductSearch';
import Login from './components/user/Login';
import Register from './components/user/Register';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { loadUser } from './actions/userActions';
import Profile from './components/user/Profile';
import ProtectedRoute from './components/route/ProductedRoute';
import UpdateProfile from './components/user/UpdateProfile';
import UpdatePassword from './components/user/UpdatePassword';
import ForgotPassword from './components/user/ForgotPassword';
import ResetPassword from './components/user/ResetPassword';
import Cart from './components/cart/Cart';
import Shipping from './components/cart/Shipping';
import ConfirmOrder from './components/cart/ConfirmOrder';
import Payment from './components/cart/Payment';
import axios from 'axios';
import {Elements} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import OrderSuccess from './components/cart/OrderSuccess';
// import Dashboard from './components/admin/Dashboard';
// import ProductList from './components/admin/ProductList';

function App() {
    const dispatch = useDispatch();
    const [stripeApiKey, setStripeApiKey] = useState("")

    useEffect(() => {
        dispatch(loadUser());
        async function getStripeApiKey(){
            const { data } = await axios.get('/api/v1/stripeapi')
            setStripeApiKey(data.getStripeApiKey)

        }
        getStripeApiKey()
    }, [dispatch]);

    return (
        <Router>
            <div className="App">
                <HelmetProvider>
                    <Header />
                    <div className="container container-fluid">
                        <ToastContainer theme="dark" />
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/search/:keyword" element={<ProductSearch />} />
                            <Route path="/product/:id" element={<ProductDetail />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/myprofile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                            <Route path="/myprofile/update" element={<ProtectedRoute><UpdateProfile/></ProtectedRoute>} />
                            <Route path="/myprofile/update/password" element={<ProtectedRoute> <UpdatePassword/> </ProtectedRoute>} />
                            <Route path="/password/forgot" element={<ForgotPassword/>} />
                            <Route path="/password/reset/:token" element={<ResetPassword/>} />
                            <Route path="/cart" element={<Cart/>} />
                            <Route path="/shipping" element={<ProtectedRoute> <Shipping/> </ProtectedRoute>} />
                            <Route path="/order/confirm" element={<ProtectedRoute> <ConfirmOrder/> </ProtectedRoute>} />
                            <Route path="/order/success" element={ <OrderSuccess/> } />
                            {stripeApiKey && <Route path='/payment' element={<ProtectedRoute><Elements stripe={loadStripe(stripeApiKey)}><Payment /></Elements> </ProtectedRoute>} />}


                        </Routes>
                        {/**Amin routes */}

                        <Routes>
                            {/* <Route path='/admin/dashboard' element={ <ProtectedRoute isAdmin={true}> <Dashboard/></ProtectedRoute>} /> */}
                            {/* <Route path='/admin/products' element={ <ProtectedRoute isAdmin={true}> <ProductList/></ProtectedRoute>} /> */}

                        </Routes>
                    </div>
                    <Footer />
                </HelmetProvider>
            </div>
        </Router>
    );
}

export default App;
