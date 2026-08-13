import { Link } from 'react-router-dom';
import { useCart } from './context/CartContext';
import { useAuth } from './context/AuthContext';

function Navbar() {
  const { cartItems } = useCart();
  const { user, logout } = useAuth();
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 20px',
        backgroundColor: '#ff6600',
        color: 'white',
      }}
    >
      <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '20px' }}>
        Daraz Clone
      </Link>
      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
        <Link to="/cart" style={{ color: 'white', textDecoration: 'none' }}>
          Cart ({itemCount})
        </Link>
       {user ? (
          <>
            <Link to="/orders" style={{ color: 'white', textDecoration: 'none' }}>
              Orders
            </Link>
            {user.is_admin && (
              <Link to="/admin" style={{ color: 'white', textDecoration: 'none' }}>
                Admin
              </Link>
            )}
            <span>Hi, {user.name}</span>
            <button onClick={logout} style={{ cursor: 'pointer' }}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;