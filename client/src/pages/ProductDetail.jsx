import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const API_URL = import.meta.env.VITE_API_URL;

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { showToast } = useToast();

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

  if (loading)
    return (
      <div style={{ backgroundColor: '#F4F6F8', minHeight: '100vh', padding: '40px' }}>
        <p style={{ color: '#5C7186' }}>Loading...</p>
      </div>
    );
  if (!product)
    return (
      <div style={{ backgroundColor: '#F4F6F8', minHeight: '100vh', padding: '40px' }}>
        <p style={{ color: '#5C7186' }}>Product not found.</p>
      </div>
    );

  const handleAddToCart = () => {
    addToCart(product);
    showToast(`${product.name} added to cart`);
  };

  return (
    <div style={{ backgroundColor: '#F4F6F8', minHeight: '100vh' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px' }}>
        <Link to="/" style={{ color: '#0B2A4A', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>
          &larr; Back to products
        </Link>

        <div
          style={{
            marginTop: '20px',
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '28px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            display: 'flex',
            gap: '32px',
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{
              flex: '1 1 300px',
              maxWidth: '380px',
              aspectRatio: '1 / 1',
              borderRadius: '10px',
              overflow: 'hidden',
              backgroundColor: '#F4F6F8',
            }}
          >
            <img
              src={product.image_url}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div style={{ flex: '1 1 280px' }}>
            {product.category && (
              <span
                style={{
                  display: 'inline-block',
                  backgroundColor: '#F4F6F8',
                  color: '#5C7186',
                  fontSize: '12px',
                  fontWeight: 600,
                  padding: '4px 12px',
                  borderRadius: '999px',
                  marginBottom: '10px',
                }}
              >
                {product.category}
              </span>
            )}
            <h1 style={{ margin: '0 0 12px', fontSize: '26px', color: '#0B2A4A', fontWeight: 700 }}>
              {product.name}
            </h1>
            <p style={{ color: '#5C7186', lineHeight: 1.6, marginBottom: '18px' }}>
              {product.description}
            </p>
            <p style={{ fontSize: '30px', fontWeight: 700, color: '#FF5A00', margin: '0 0 8px' }}>
              Rs. {product.price}
            </p>
            <p
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: product.stock > 0 ? '#1B8A5A' : '#D93636',
                marginBottom: '22px',
              }}
            >
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </p>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              style={{
                padding: '13px 32px',
                backgroundColor: product.stock === 0 ? '#C9CED4' : '#FF5A00',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                fontWeight: 700,
              }}
            >
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;