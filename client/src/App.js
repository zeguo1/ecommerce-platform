import React from 'react';
import './App.css';
import ProductList from './components/ProductList';
import ProductDetails from './components/ProductDetails';
import Register from './components/Register';
import Login from './components/Login';
import AddProduct from './components/AddProduct';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

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
            <Link to="/admin">Admin Dashboard</Link>
          </li>
          <li>
            <Link to="/add-product">Add Product</Link>
          </li>
            <li>
              <Link to="/register">Register</Link> {/* Add Register link */}
            </li>
            <li>
              <Link to="/login">Login</Link> {/* Add Login link */}
            </li>
          </ul>
        </nav>
        <h1>Welcome to E-commerce Website</h1>
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetails />} /> {/* Add ProductDetails route */}
          <Route path="/register" element={<Register />} /> {/* Add Register route */}
          <Route path="/login" element={<Login />} />
          <Route path="/add-product" element={<AddProduct />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
