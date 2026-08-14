import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch categories once, on page load
  useEffect(() => {
    fetch(`${API_URL}/api/categories`)
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error('Error fetching categories:', err));
  }, []);

  // Fetch products whenever selectedCategory changes
  useEffect(() => {
    setLoading(true);
    const url = selectedCategory
      ? `${API_URL}/api/products?category_id=${selectedCategory}`
      : `${API_URL}/api/products`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching products:', err);
        setLoading(false);
      });
  }, [selectedCategory]);

  return (
    <div style={{ padding: '20px' }}>
     <h1>MESsupply</h1>

      {/* Category filter buttons */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setSelectedCategory(null)}
          style={{
            padding: '8px 16px',
            border: '1px solid #ff6600',
            backgroundColor: selectedCategory === null ? '#ff6600' : 'white',
            color: selectedCategory === null ? 'white' : '#ff6600',
            borderRadius: '20px',
            cursor: 'pointer',
          }}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            style={{
              padding: '8px 16px',
              border: '1px solid #ff6600',
              backgroundColor: selectedCategory === cat.id ? '#ff6600' : 'white',
              color: selectedCategory === cat.id ? 'white' : '#ff6600',
              borderRadius: '20px',
              cursor: 'pointer',
            }}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Loading products...</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {products.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div
                style={{
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  padding: '15px',
                  width: '200px',
                }}
              >
                <img
                  src={product.image_url}
                  alt={product.name}
                  style={{ width: '100%', borderRadius: '4px' }}
                />
                <h3>{product.name}</h3>
                <p><strong>Rs. {product.price}</strong></p>
                <p>Stock: {product.stock}</p>
              </div>
            </Link>
          ))}
          {products.length === 0 && <p>No products in this category yet.</p>}
        </div>
      )}
    </div>
  );
}

export default Home;