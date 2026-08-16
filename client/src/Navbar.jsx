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

      <div style={{ display: 'flex', gap: '22px', alignItems: 'center' }}>
        <Link to="/cart" style={linkStyle}>
          Cart ({itemCount})
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
            <span style={{ fontSize: '14px', color: '#B8C4D0' }}>Hi, {user.name}</span>
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
  );
}

export default Navbar;