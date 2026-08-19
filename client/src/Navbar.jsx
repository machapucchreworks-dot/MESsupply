import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from './context/CartContext';
import { useAuth } from './context/AuthContext';

function Navbar() {
  const { cartItems } = useCart();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    fontSize: '15px',
    fontWeight: 500,
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <>
      {/* Top info bar */}
      <div
        style={{
          backgroundColor: '#08213A',
          color: '#B8C4D0',
          padding: '6px 24px',
          fontSize: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap' }}>
          <a href="tel:+9779866963219" style={{ color: '#B8C4D0', textDecoration: 'none' }}>
            📞 +977-9866963219
          </a>
          <a href="mailto:machapucchreworks@gmail.com" style={{ color: '#B8C4D0', textDecoration: 'none' }}>
            ✉️ machapucchreworks@gmail.com
          </a>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/contact" style={{ color: '#B8C4D0', textDecoration: 'none' }}>
            Facebook
          </Link>
          <Link to="/contact" style={{ color: '#B8C4D0', textDecoration: 'none' }}>
            Instagram
          </Link>
        </div>
      </div>

      <nav
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 24px',
          backgroundColor: '#0B2A4A',
          color: 'white',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          gap: '20px',
          flexWrap: 'wrap',
        }}
      >
        <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <img src="/logo.svg" alt="MESsupply" style={{ height: '40px' }} />
        </Link>

        <form
          onSubmit={handleSearch}
          style={{ flex: '1 1 260px', maxWidth: '420px', display: 'flex' }}
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            style={{
              flex: 1,
              padding: '9px 14px',
              border: 'none',
              borderRadius: '6px 0 0 6px',
              fontSize: '14px',
              outline: 'none',
            }}
          />
          <button
            type="submit"
            style={{
              padding: '9px 16px',
              backgroundColor: '#FF5A00',
              color: 'white',
              border: 'none',
              borderRadius: '0 6px 6px 0',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '14px',
            }}
          >
            Search
          </button>
        </form>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Link to="/about" style={linkStyle}>
            About
          </Link>
          <Link to="/contact" style={linkStyle}>
            Contact
          </Link>
          <Link
            to="/cart"
            style={{ ...linkStyle, display: 'flex', alignItems: 'center', gap: '6px', position: 'relative' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            Cart
            {itemCount > 0 && (
              <span
                style={{
                  backgroundColor: '#FF5A00',
                  color: 'white',
                  borderRadius: '999px',
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '1px 6px',
                  marginLeft: '2px',
                }}
              >
                {itemCount}
              </span>
            )}
          </Link>
          {user ? (
            <>
              <Link to="/orders" style={linkStyle}>
                Orders
              </Link>
              {user.is_admin && (
                <Link to="/admin" style={linkStyle}>
                  Admin
                </Link>
              )}
              <span
                title={`Hi, ${user.name}`}
                style={{
                  fontSize: '14px',
                  color: '#B8C4D0',
                  maxWidth: '140px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  display: 'inline-block',
                }}
              >
                Hi, {user.name}
              </span>
              <button
                onClick={logout}
                style={{
                  cursor: 'pointer',
                  backgroundColor: '#FF5A00',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '14px',
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              style={{
                ...linkStyle,
                backgroundColor: '#FF5A00',
                padding: '8px 18px',
                borderRadius: '6px',
                fontWeight: 600,
              }}
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </>
  );
}

export default Navbar;