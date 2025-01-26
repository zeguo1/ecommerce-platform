// client/src/components/AdminDashboard.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here (e.g., send data to server)
    console.log('Product Name:', name);
    console.log('Description:', description);
    console.log('Price:', price);
    console.log('Image URL:', imageUrl);
    // Reset form fields after submission
    setName('');
    setDescription('');
    setPrice('');
    setImageUrl('');
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <ul>
        <li>
          <Link to="/admin/products">Manage Products</Link>
        </li>
        <li>
          <Link to="/admin/orders">Manage Orders</Link>
        </li>
        <li>
          <Link to="/admin/shipping">Manage Shipping</Link>
        </li>
      </ul>

      <h3>Add New Product</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Product Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="price">Price:</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            step="0.01"
          />
        </div>
        <div>
          <label htmlFor="imageUrl">Image URL:</label>
          <input
            type="url"
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default AdminDashboard;
