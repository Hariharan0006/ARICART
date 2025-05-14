
import axios from 'axios';
import { productsRequest, productsFail, productsSuccess } from '../slices/productsSlice';
import { productRequest, productFail, productSuccess } from '../slices/productSlice';

export const getProducts = (keyword, price, category, rating, currentPage) => async (dispatch) => {
    try {
        dispatch(productsRequest());
        
        const page = currentPage || 1; 
        const priceRange = price && price.length === 2 ? price : [1, 1000];
        
        let link = `/api/v1/products?page=${page}`;
        
        if (keyword) {
            link += `&keyword=${keyword}`;
        }

        if (priceRange[0] !== undefined && priceRange[1] !== undefined) {
            link += `&price[gte]=${priceRange[0]}&price[lte]=${priceRange[1]}`;
        }
        if (category) {
            link += `&category=${category}`;
        }
        if (rating) {
            link += `&ratings=${rating}`;
        }
        
        const { data } = await axios.get(link);
        dispatch(productsSuccess(data));
    } catch (error) {
        dispatch(productsFail(error.response ? error.response.data.message : 'An error occurred'));
    }
};


export const getProduct = (id) => async (dispatch) => {
    try {
        dispatch(productRequest());
        const { data } = await axios.get(`/api/v1/product/${id}`);
        dispatch(productSuccess(data));
    } catch (error) {
        dispatch(productFail(error.response?.data?.message || 'Something went wrong'));
    }
};
