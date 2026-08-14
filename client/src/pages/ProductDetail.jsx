import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const API_URL = import.meta.env.VITE_API_URL;

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch(`${API_URL}/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching product:', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <div style={{ padding: '20px' }}>
      <Link to="/">&larr; Back to products</Link>
      <div style={{ marginTop: '20px', maxWidth: '400px' }}>
        <img
          src={product.image_url}
          alt={product.name}
          style={{ width: '100%', borderRadius: '8px' }}
        />
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <p><strong>Rs. {product.price}</strong></p>
        <p>Category: {product.category}</p>
        <p>In stock: {product.stock}</p>
        <button
          onClick={() => addToCart(product)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#ff6600',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductDetail;