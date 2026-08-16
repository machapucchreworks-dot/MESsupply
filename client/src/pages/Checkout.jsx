import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

function Checkout() {
  const { cartItems, clearCart } = useCart();
  const { user, token } = useAuth();
  const [shippingAddress, setShippingAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [landmark, setLandmark] = useState('');
  const [shippingZone, setShippingZone] = useState('city');
  const [zones, setZones] = useState({});
  const [freeThreshold, setFreeThreshold] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/api/shipping-zones`)
      .then((res) => res.json())
      .then((data) => {
        setZones(data.zones);
        setFreeThreshold(data.freeShippingThreshold);
      })
      .catch((err) => console.error('Error fetching shipping zones:', err));
  }, []);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee =
    subtotal >= freeThreshold || !zones[shippingZone] ? 0 : zones[shippingZone].fee;
  const total = subtotal + shippingFee;

  const pageWrap = (children) => (
    <div style={{ backgroundColor: '#F4F6F8', minHeight: '100vh' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '24px' }}>{children}</div>
    </div>
  );

  if (!user) {
    return pageWrap(
      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '32px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <p style={{ color: '#5C7186', margin: 0 }}>
          Please <Link to="/login" style={{ color: '#FF5A00', fontWeight: 600 }}>login</Link> to checkout.
        </p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return pageWrap(
      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '32px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <p style={{ color: '#5C7186', margin: 0 }}>
          Your cart is empty. <Link to="/" style={{ color: '#FF5A00', fontWeight: 600 }}>Go shopping</Link>
        </p>
      </div>
    );
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cartItems,
          shippingAddress,
          phone,
          landmark,
          shippingZone,
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

      const payRes = await fetch(`${API_URL}/api/esewa/initiate/${data.orderId}`, {
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
        success_url: `${window.location.origin}/order-success/${data.orderId}`,
        failure_url: `${window.location.origin}/checkout`,
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

  const radioCardStyle = (active) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '14px',
    border: `2px solid ${active ? '#FF5A00' : '#E5E9ED'}`,
    borderRadius: '8px',
    cursor: 'pointer',
    marginBottom: '10px',
    backgroundColor: active ? '#FFF3EB' : 'white',
  });

  const inputStyle = {
    width: '100%',
    padding: '10px',
    border: '1px solid #E5E9ED',
    borderRadius: '8px',
    fontFamily: 'inherit',
    fontSize: '14px',
  };

  const labelStyle = {
    display: 'block',
    fontWeight: 600,
    color: '#0B2A4A',
    marginBottom: '8px',
    fontSize: '14px',
  };

  return pageWrap(
    <>
      <Link to="/cart" style={{ color: '#0B2A4A', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>
        &larr; Back to cart
      </Link>
      <h1 style={{ color: '#0B2A4A', fontSize: '24px', margin: '16px 0 20px' }}>Checkout</h1>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', marginBottom: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        {cartItems.map((item) => (
          <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', color: '#0B2A4A' }}>
            <span style={{ fontSize: '14px' }}>{item.name} x {item.quantity}</span>
            <span style={{ fontSize: '14px', fontWeight: 600 }}>Rs. {(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div style={{ borderTop: '1px solid #E5E9ED', marginTop: '10px', paddingTop: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', fontSize: '14px', color: '#5C7186' }}>
            <span>Subtotal</span>
            <span>Rs. {subtotal.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', fontSize: '14px', color: '#5C7186' }}>
            <span>Shipping</span>
            <span>{shippingFee === 0 ? 'Free' : `Rs. ${shippingFee.toFixed(2)}`}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', paddingTop: '6px', borderTop: '1px solid #E5E9ED' }}>
            <span style={{ fontWeight: 700, color: '#0B2A4A' }}>Total</span>
            <span style={{ fontWeight: 700, color: '#FF5A00', fontSize: '18px' }}>Rs. {total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handlePlaceOrder} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <label style={labelStyle}>Phone Number</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          placeholder="98XXXXXXXX"
          style={{ ...inputStyle, marginBottom: '18px' }}
        />

        <label style={labelStyle}>Shipping Address</label>
        <textarea
          value={shippingAddress}
          onChange={(e) => setShippingAddress(e.target.value)}
          required
          rows="3"
          style={{ ...inputStyle, marginBottom: '18px' }}
        />

        <label style={labelStyle}>Nearest Landmark (optional)</label>
        <input
          type="text"
          value={landmark}
          onChange={(e) => setLandmark(e.target.value)}
          placeholder="e.g. Near Ghorahi Chowk"
          style={{ ...inputStyle, marginBottom: '18px' }}
        />

        <label style={labelStyle}>Delivery Zone</label>
        <select
          value={shippingZone}
          onChange={(e) => setShippingZone(e.target.value)}
          required
          style={{ ...inputStyle, marginBottom: '18px' }}
        >
          {Object.entries(zones).map(([key, zone]) => (
            <option key={key} value={key}>
              {zone.label} — Rs. {zone.fee}
            </option>
          ))}
        </select>

        <label style={{ ...labelStyle, marginBottom: '10px' }}>Payment Method</label>
        <label style={radioCardStyle(paymentMethod === 'cod')}>
          <input type="radio" name="paymentMethod" value="cod" checked={paymentMethod === 'cod'} onChange={(e) => setPaymentMethod(e.target.value)} />
          <span style={{ fontSize: '14px', color: '#0B2A4A', fontWeight: 600 }}>Cash on Delivery</span>
        </label>
        <label style={radioCardStyle(paymentMethod === 'esewa')}>
          <input type="radio" name="paymentMethod" value="esewa" checked={paymentMethod === 'esewa'} onChange={(e) => setPaymentMethod(e.target.value)} />
          <span style={{ fontSize: '14px', color: '#0B2A4A', fontWeight: 600 }}>Pay with eSewa</span>
        </label>

        {error && <p style={{ color: '#D93636', fontSize: '14px', marginTop: '12px' }}>{error}</p>}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px',
            marginTop: '18px',
            backgroundColor: loading ? '#C9CED4' : '#FF5A00',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'default' : 'pointer',
            fontSize: '16px',
            fontWeight: 700,
          }}
        >
          {loading ? 'Placing order...' : 'Place Order'}
        </button>
      </form>
    </>
  );
}

export default Checkout;