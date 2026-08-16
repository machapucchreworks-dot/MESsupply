import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function Cart() {
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (cartItems.length === 0) {
    return (
      <div style={{ backgroundColor: '#F4F6F8', minHeight: '100vh' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', padding: '24px' }}>
          <Link to="/" style={{ color: '#0B2A4A', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>
            &larr; Back to products
          </Link>
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '48px',
              textAlign: 'center',
              marginTop: '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            }}
          >
            <p style={{ color: '#5C7186', fontSize: '16px', margin: 0 }}>Your cart is empty.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#F4F6F8', minHeight: '100vh' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '24px' }}>
        <Link to="/" style={{ color: '#0B2A4A', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>
          &larr; Back to products
        </Link>
        <h1 style={{ color: '#0B2A4A', fontSize: '24px', margin: '16px 0 20px' }}>Your Cart</h1>

        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '8px 20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          }}
        >
          {cartItems.map((item, idx) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '16px 0',
                borderBottom: idx < cartItems.length - 1 ? '1px solid #E5E9ED' : 'none',
              }}
            >
              <img
                src={item.image_url}
                alt={item.name}
                style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '8px' }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: '0 0 4px', fontWeight: 600, color: '#0B2A4A', fontSize: '15px' }}>
                  {item.name}
                </p>
                <p style={{ margin: 0, color: '#5C7186', fontSize: '13px' }}>Rs. {item.price} each</p>
              </div>
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                style={{
                  width: '56px',
                  padding: '6px',
                  border: '1px solid #E5E9ED',
                  borderRadius: '6px',
                  textAlign: 'center',
                }}
              />
              <p style={{ width: '90px', textAlign: 'right', fontWeight: 700, color: '#0B2A4A', margin: 0 }}>
                Rs. {(item.price * item.quantity).toFixed(2)}
              </p>
              <button
                onClick={() => removeFromCart(item.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#D93636',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 600,
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '20px',
            marginTop: '16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <p style={{ margin: 0, color: '#5C7186', fontSize: '14px' }}>Total</p>
            <p style={{ margin: 0, color: '#FF5A00', fontSize: '24px', fontWeight: 700 }}>
              Rs. {total.toFixed(2)}
            </p>
          </div>
          <Link to="/checkout">
            <button
              style={{
                padding: '13px 32px',
                backgroundColor: '#FF5A00',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: 700,
              }}
            >
              Proceed to Checkout
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Cart;