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

  const selectedCategoryName = categories.find((c) => c.id === selectedCategory)?.name;

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
        .sidebar-item:hover {
          background-color: #F4F6F8;
        }
        .desktop-sidebar { display: block; }
        .mobile-chips { display: none; }
        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 20px;
        }
        @media (max-width: 768px) {
          .desktop-sidebar { display: none; }
          .mobile-chips { display: flex; }
          .home-layout { flex-direction: column; }
          .product-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }
        }
        .home-layout {
          display: flex;
          gap: 24px;
          align-items: flex-start;
        }
      `}</style>

      {!searchQuery && (
        <div
          style={{
            background: 'linear-gradient(135deg, #0B2A4A, #123B63)',
            backgroundImage: `linear-gradient(135deg, #0B2A4A, #123B63), radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)`,
            backgroundSize: 'auto, 22px 22px',
            color: 'white',
            padding: '48px 20px 40px',
            textAlign: 'center',
          }}
        >
          <h1 style={{ margin: 0, fontSize: '30px', fontWeight: 700 }}>Everything you need, in one place</h1>
          <p style={{ margin: '10px 0 0', color: '#B8C4D0', fontSize: '15px' }}>
            Books · Stationery · Gifts · Music · Sports
          </p>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              marginTop: '22px',
            }}
          >
            {[
              { icon: '🚚', text: 'Free shipping above Rs. 2000' },
              { icon: '💵', text: 'Cash on Delivery' },
              { icon: '📦', text: 'Fast delivery across Tulsipur' },
            ].map((badge) => (
              <div
                key={badge.text}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.18)',
                  borderRadius: '999px',
                  padding: '6px 14px',
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              >
                <span>{badge.icon}</span>
                <span>{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mobile category chip strip */}
      <div
        className="mobile-chips"
        style={{
          overflowX: 'auto',
          gap: '8px',
          padding: '12px 16px',
          backgroundColor: 'white',
          borderBottom: '1px solid #E5E9ED',
        }}
      >
        <button
          onClick={() => setSelectedCategory(null)}
          style={{
            padding: '7px 14px',
            border: 'none',
            backgroundColor: selectedCategory === null ? '#FF5A00' : '#F4F6F8',
            color: selectedCategory === null ? 'white' : '#0B2A4A',
            borderRadius: '999px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '13px',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            style={{
              padding: '7px 14px',
              border: 'none',
              backgroundColor: selectedCategory === cat.id ? '#FF5A00' : '#F4F6F8',
              color: selectedCategory === cat.id ? 'white' : '#0B2A4A',
              borderRadius: '999px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '13px',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              marginLeft: '8px',
            }}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px 16px' }}>
        <div className="home-layout">
          {/* Desktop sidebar */}
          <aside
            className="desktop-sidebar"
            style={{
              width: '220px',
              flexShrink: 0,
              backgroundColor: 'white',
              borderRadius: '10px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              overflow: 'hidden',
              position: 'sticky',
              top: '24px',
            }}
          >
            <div style={{ backgroundColor: '#0B2A4A', color: 'white', padding: '14px 18px', fontWeight: 700, fontSize: '14px' }}>
              CATEGORIES
            </div>
            <div
              className="sidebar-item"
              onClick={() => setSelectedCategory(null)}
              style={{
                padding: '12px 18px',
                cursor: 'pointer',
                fontWeight: selectedCategory === null ? 700 : 500,
                color: selectedCategory === null ? '#FF5A00' : '#0B2A4A',
                borderBottom: '1px solid #F0F2F4',
                fontSize: '14px',
              }}
            >
              All Products
            </div>
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="sidebar-item"
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  padding: '12px 18px',
                  cursor: 'pointer',
                  fontWeight: selectedCategory === cat.id ? 700 : 500,
                  color: selectedCategory === cat.id ? '#FF5A00' : '#0B2A4A',
                  borderBottom: '1px solid #F0F2F4',
                  fontSize: '14px',
                }}
              >
                {cat.name}
              </div>
            ))}
          </aside>

          {/* Main content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '13px', color: '#5C7186', marginBottom: '12px' }}>
              <span>Products</span>
              {selectedCategoryName && (
                <>
                  <span style={{ margin: '0 6px' }}>›</span>
                  <span style={{ color: '#0B2A4A', fontWeight: 600 }}>{selectedCategoryName}</span>
                </>
              )}
            </div>

            {searchQuery && (
              <h2 style={{ color: '#0B2A4A', fontSize: '18px', margin: '0 0 12px' }}>
                Search results for "{searchQuery}"
              </h2>
            )}

            {loading ? (
              <p style={{ color: '#5C7186' }}>Loading products...</p>
            ) : (
              <div className="product-grid">
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
                        padding: '10px',
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
                          marginBottom: '8px',
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
                          margin: '0 0 4px',
                          fontSize: '13px',
                          fontWeight: 600,
                          color: '#0B2A4A',
                          lineHeight: 1.3,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {product.name}
                      </h3>
                      <p style={{ margin: '0 0 2px', color: '#FF5A00', fontWeight: 700, fontSize: '14px' }}>
                        Rs. {product.price}
                      </p>
                      <p style={{ margin: 0, color: '#5C7186', fontSize: '11px' }}>
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
      </div>
    </div>
  );
}

export default Home;