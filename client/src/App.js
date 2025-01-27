import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import ProductList from './components/ProductList';
import ProductDetails from './components/ProductDetails';
import Cart from './components/Cart';
import Login from './components/Login';
import Register from './components/Register';
import AddProduct from './components/AddProduct';
import UserInfo from './pages/UserCenter/UserInfo';
import Orders from './pages/UserCenter/Orders';
import Address from './pages/UserCenter/Address';
import Security from './pages/UserCenter/Security';

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/cart">Cart</Link>
            </li>
            <li>
              <Link to="/admin">Admin Dashboard</Link>
            </li>
            <li>
              <Link to="/add-product">Add Product</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/user">User Center</Link>
            </li>
          </ul>
        </nav>
        <h1>Welcome to E-commerce Website</h1>
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart/:id?" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/user" element={<Navigate to="/user/info" replace />} />
          <Route path="/user/info" element={<UserInfo />} />
          <Route path="/user/orders" element={<Orders />} />
          <Route path="/user/address" element={<Address />} />
          <Route path="/user/security" element={<Security />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
