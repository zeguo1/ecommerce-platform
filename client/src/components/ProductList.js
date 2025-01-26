import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link

function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
    };
    fetchProducts();
  }, []);

  return (
    <div>
      <h1>Products</h1>
      {products.map((product) => (
        <div key={product._id}>
          <Link to={`/product/${product._id}`}> {/* Link to product details page */}
            <h3>{product.name}</h3>
            <p>${product.price}</p>
          </Link>
        </div>
      ))}
    </div>
  );
}

export default ProductList;
