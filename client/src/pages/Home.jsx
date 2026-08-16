import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

function Home() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/categories`)
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error('Error fetching categories:', err));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedCategory) params.set('category_id', selectedCategory);
    if (searchQuery) params.set('search', searchQuery);

    fetch(`${API_URL}/api/products?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching products:', err);
        setLoading(false);
      });
  }, [selectedCategory, searchQuery]);

  return (
    <div style={{ backgroundColor: '#F4F6F8', minHeight: '100vh' }}>
      <style>{`
        .product-card {
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .product-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(11,42,74,0.12);
        }
      `}</style>

      {!searchQuery && (
        <div
          style={{
            background: 'linear-gradient(135deg, #0B2A4A, #123B63)',
            color: 'white',
            padding: '40px 24px',
            textAlign: 'center',
          }}
        >
          <h1 style={{ margin: 0, fontSize: '32px', fontWeight: 700 }}>Everything you need, in one place</h1>
          <p style={{ margin: '8px 0 0', color: '#B8C4D0', fontSize: '15px' }}>
            Books · Stationery · Gifts · Music · Sports
          </p>
        </div>
      )}

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px' }}>
        {searchQuery && (
          <h2 style={{ color: '#0B2A4A', fontSize: '20px', margin: '0 0 16px' }}>
            Search results for "{searchQuery}"
          </h2>
        )}

        <div style={{ display: 'flex', gap: '10px', marginBottom: '28px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setSelectedCategory(null)}
            style={{
              padding: '9px 18px',
              border: 'none',
              backgroundColor: selectedCategory === null ? '#FF5A00' : 'white',
              color: selectedCategory === null ? 'white' : '#0B2A4A',
              borderRadius: '999px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '14px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                padding: '9px 18px',
                border: 'none',
                backgroundColor: selectedCategory === cat.id ? '#FF5A00' : 'white',
                color: selectedCategory === cat.id ? 'white' : '#0B2A4A',
                borderRadius: '999px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '14px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {loading ? (
          <p style={{ color: '#5C7186' }}>Loading products...</p>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
              gap: '20px',
            }}
          >
            {products.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div
                  className="product-card"
                  style={{
                    backgroundColor: 'white',
                    border: '1px solid #E5E9ED',
                    borderRadius: '10px',
                    padding: '14px',
                    height: '100%',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      aspectRatio: '1 / 1',
                      overflow: 'hidden',
                      borderRadius: '8px',
                      backgroundColor: '#F4F6F8',
                      marginBottom: '10px',
                    }}
                  >
                    <img
                      src={product.image_url}
                      alt={product.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <h3
                    style={{
                      margin: '0 0 6px',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#0B2A4A',
                      lineHeight: 1.3,
                    }}
                  >
                    {product.name}
                  </h3>
                  <p style={{ margin: '0 0 4px', color: '#FF5A00', fontWeight: 700, fontSize: '16px' }}>
                    Rs. {product.price}
                  </p>
                  <p style={{ margin: 0, color: '#5C7186', fontSize: '13px' }}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </p>
                </div>
              </Link>
            ))}
            {products.length === 0 && (
              <p style={{ color: '#5C7186' }}>No products found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;