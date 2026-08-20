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
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/?search=${encodeURIComponent(searchQuery)}`);
  };

  const initial = user?.name ? user.name.trim().charAt(0).toUpperCase() : '';

  return (
    <>
      {/* Hover / underline effects for nav links, avatar, and logout button.
          Kept as a scoped <style> block since the rest of the app uses inline styles. */}
      <style>{`
        .navlink {
          position: relative;
          transition: color 0.15s ease, opacity 0.15s ease;
          opacity: 0.92;
        }
        .navlink::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -4px;
          width: 0;
          height: 2px;
          background-color: #FF5A00;
          transition: width 0.18s ease;
        }
        .navlink:hover {
          opacity: 1;
          color: #FFD9BF;
        }
        .navlink:hover::after {
          width: 100%;
        }
        .logout-btn {
          transition: background-color 0.15s ease, transform 0.1s ease;
        }
        .logout-btn:hover {
          background-color: #E64F00;
        }
        .logout-btn:active {
          transform: scale(0.97);
        }
        .login-btn {
          transition: background-color 0.15s ease, transform 0.1s ease, box-shadow 0.15s ease;
        }
        .login-btn:hover {
          background-color: #E64F00;
          box-shadow: 0 2px 10px rgba(255, 90, 0, 0.35);
        }
        .profile-pill:hover {
          opacity: 0.85;
        }
      `}</style>

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
          background: 'linear-gradient(180deg, #0E3157 0%, #0B2A4A 100%)',
          color: 'white',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
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

        <div style={{ display: 'flex', gap: '22px', alignItems: 'center' }}>
          <Link to="/about" className="navlink" style={linkStyle}>
            About
          </Link>
          <Link to="/contact" className="navlink" style={linkStyle}>
            Contact
          </Link>
          <Link to="/cart" className="navlink" style={{ ...linkStyle, position: 'relative' }}>
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
              <Link to="/orders" className="navlink" style={linkStyle}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                  <line x1="9" y1="12" x2="15" y2="12"></line>
                  <line x1="9" y1="16" x2="15" y2="16"></line>
                </svg>
                Orders
              </Link>
              {user.is_admin && (
                <Link to="/admin" className="navlink" style={linkStyle}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2 4 5v6c0 5.25 3.5 9.5 8 11 4.5-1.5 8-5.75 8-11V5l-8-3z"></path>
                  </svg>
                  Admin
                </Link>
              )}

              {/* Avatar + name is now the Profile link — click either to go to /profile */}
              <Link
                to="/profile"
                className="profile-pill"
                title={`${user.name} — View Profile`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  textDecoration: 'none',
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    backgroundColor: '#FF5A00',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '13px',
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {initial}
                </div>
                <span
                  style={{
                    fontSize: '14px',
                    color: '#E5EBF1',
                    maxWidth: '120px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    display: 'inline-block',
                  }}
                >
                  {user.name}
                </span>
              </Link>

              <button
                onClick={logout}
                className="logout-btn"
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
              className="login-btn"
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