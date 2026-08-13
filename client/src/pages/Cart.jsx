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
      <div style={{ padding: '20px' }}>
        <Link to="/">&larr; Back to products</Link>
        <p>Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <Link to="/">&larr; Back to products</Link>
      <h1>Your Cart</h1>
      {cartItems.map((item) => (
        <div
          key={item.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            borderBottom: '1px solid #ccc',
            padding: '10px 0',
          }}
        >
          <img src={item.image_url} alt={item.name} style={{ width: '60px' }} />
          <div style={{ flex: 1 }}>
            <p><strong>{item.name}</strong></p>
            <p>Rs. {item.price} each</p>
          </div>
          <input
            type="number"
            min="1"
            value={item.quantity}
            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
            style={{ width: '50px' }}
          />
          <p>Rs. {(item.price * item.quantity).toFixed(2)}</p>
          <button onClick={() => removeFromCart(item.id)}>Remove</button>
        </div>
      ))}
      <h2 style={{ marginTop: '20px' }}>Total: Rs. {total.toFixed(2)}</h2>
      <Link to="/checkout">
        <button style={{ padding: '10px 20px', marginTop: '10px' }}>
          Proceed to Checkout
        </button>
      </Link>
    </div>
  );
}

export default Cart;