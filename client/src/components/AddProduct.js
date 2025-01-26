import React, { useState } from 'react';

function AddProduct() {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    image: null
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('price', product.price);
    if (product.image) {
      formData.append('image', product.image);
    }

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        alert('Product added successfully!');
        setProduct({
          name: '',
          description: '',
          price: '',
          image: null
        });
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || 'Failed to add product'}`);
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('An error occurred while adding the product');
    }
  };

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setProduct({
        ...product,
        image: e.target.files[0]
      });
    }
  };

  return (
    <div className="add-product">
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Product Name</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Price</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Product Image</label>
          <input
            type="file"
            name="image"
            onChange={handleImageChange}
            accept="image/*"
          />
        </div>

        <button type="submit">Add Product</button>
      </form>
    </div>
  );
}

export default AddProduct;
