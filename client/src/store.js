import { configureStore } from '@reduxjs/toolkit';
import { productListReducer } from './reducers/productReducers';
import { cartReducer } from './reducers/cartReducer';

const reducer = {
  productList: productListReducer,
  cart: cartReducer,
};

const store = configureStore({
  reducer,
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
