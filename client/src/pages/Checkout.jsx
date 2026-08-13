import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function Checkout() {
  const { cartItems, clearCart } = useCart();
  const { user, token } = useAuth();
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Not logged in? Send them to login first.
  if (!user) {
    return (
      <div style={{ padding: '20px' }}>
        <p>Please <Link to="/login">login</Link> to checkout.</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div style={{ padding: '20px' }}>
        <p>Your cart is empty. <Link to="/">Go shopping</Link></p>
      </div>
    );
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cartItems,
          shippingAddress,
          paymentMethod,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to place order');
        setLoading(false);
        return;
      }

      if (paymentMethod === 'cod') {
        clearCart();
        navigate(`/order-success/${data.orderId}`);
        return;
      }

      // eSewa: get signed payment data, then redirect to eSewa's payment page
      const payRes = await fetch(`http://localhost:5000/api/esewa/initiate/${data.orderId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const payData = await payRes.json();

      if (!payRes.ok) {
        setError(payData.error || 'Failed to start eSewa payment');
        setLoading(false);
        return;
      }

      clearCart();

      // Build and auto-submit a form to redirect to eSewa
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = payData.esewaUrl;

      const fields = {
        amount: payData.amount,
        tax_amount: 0,
        total_amount: payData.amount,
        transaction_uuid: payData.transactionUuid,
        product_code: payData.productCode,
        product_service_charge: 0,
        product_delivery_charge: 0,
        success_url: `http://localhost:5173/order-success/${data.orderId}`,
        failure_url: `http://localhost:5173/checkout`,
        signed_field_names: 'total_amount,transaction_uuid,product_code',
        signature: payData.signature,
      };

      Object.entries(fields).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h1>Checkout</h1>
      <div style={{ marginBottom: '20px' }}>
        {cartItems.map((item) => (
          <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>{item.name} x {item.quantity}</span>
            <span>Rs. {(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <h3 style={{ marginTop: '10px' }}>Total: Rs. {total.toFixed(2)}</h3>
      </div>
      <form onSubmit={handlePlaceOrder}>
        <label>Shipping Address</label>
        <textarea
          value={shippingAddress}
          onChange={(e) => setShippingAddress(e.target.value)}
          required
          rows="3"
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />

        <label style={{ display: 'block', marginTop: '10px' }}>Payment Method</label>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            <input
              type="radio"
              name="paymentMethod"
              value="cod"
              checked={paymentMethod === 'cod'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            {' '}Cash on Delivery
          </label>
          <label style={{ display: 'block' }}>
            <input
              type="radio"
              name="paymentMethod"
              value="esewa"
              checked={paymentMethod === 'esewa'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            {' '}Pay with eSewa
          </label>
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={loading} style={{ padding: '10px 20px' }}>
          {loading ? 'Placing order...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
}

export default Checkout;