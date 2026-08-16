import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

function Orders() {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    fetch(`${API_URL}/api/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching orders:', err);
        setLoading(false);
      });
  }, [user, token]);

  const pageWrap = (children) => (
    <div style={{ backgroundColor: '#F4F6F8', minHeight: '100vh' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '24px' }}>{children}</div>
    </div>
  );

  if (!user) {
    return pageWrap(
      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '32px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <p style={{ color: '#5C7186', margin: 0 }}>
          Please <Link to="/login" style={{ color: '#FF5A00', fontWeight: 600 }}>login</Link> to view your orders.
        </p>
      </div>
    );
  }

  if (loading) return pageWrap(<p style={{ color: '#5C7186' }}>Loading orders...</p>);

  if (orders.length === 0) {
    return pageWrap(
      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '32px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <p style={{ color: '#5C7186', margin: 0 }}>
          You haven't placed any orders yet. <Link to="/" style={{ color: '#FF5A00', fontWeight: 600 }}>Go shopping</Link>
        </p>
      </div>
    );
  }

  const subtotalOf = (order) => Number(order.total) - Number(order.shipping_fee || 0);

  return pageWrap(
    <>
      <h1 style={{ color: '#0B2A4A', fontSize: '24px', margin: '0 0 20px' }}>Your Orders</h1>
      {orders.map((order) => (
        <div
          key={order.id}
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong style={{ color: '#0B2A4A' }}>Order #{order.id}</strong>
            <span
              style={{
                textTransform: 'capitalize',
                fontSize: '12px',
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: '999px',
                backgroundColor: '#FFF3EB',
                color: '#FF5A00',
              }}
            >
              {order.status}
            </span>
          </div>
          <p style={{ color: '#5C7186', fontSize: '13px', margin: '4px 0 12px' }}>
            {new Date(order.created_at).toLocaleDateString()}
          </p>

          {order.items.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '8px 0' }}>
              <img src={item.image_url} alt={item.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px' }} />
              <span style={{ fontSize: '14px', color: '#0B2A4A' }}>{item.name} x {item.quantity}</span>
              <span style={{ marginLeft: 'auto', fontSize: '14px', fontWeight: 600, color: '#0B2A4A' }}>Rs. {item.price}</span>
            </div>
          ))}

          <div style={{ borderTop: '1px solid #E5E9ED', marginTop: '12px', paddingTop: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#5C7186', padding: '2px 0' }}>
              <span>Subtotal</span>
              <span>Rs. {subtotalOf(order).toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#5C7186', padding: '2px 0' }}>
              <span>Shipping ({order.shipping_zone === 'city' ? 'Inside Tulsipur City' : 'Dang Valley'})</span>
              <span>{Number(order.shipping_fee) === 0 ? 'Free' : `Rs. ${Number(order.shipping_fee).toFixed(2)}`}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', paddingTop: '6px', borderTop: '1px solid #E5E9ED' }}>
              <span style={{ fontWeight: 700, color: '#0B2A4A' }}>Total</span>
              <span style={{ fontWeight: 700, color: '#FF5A00', fontSize: '16px' }}>Rs. {Number(order.total).toFixed(2)}</span>
            </div>
          </div>

          <div style={{ backgroundColor: '#F4F6F8', borderRadius: '8px', padding: '12px', marginTop: '14px', fontSize: '13px', color: '#5C7186', lineHeight: 1.6 }}>
            <div><strong style={{ color: '#0B2A4A' }}>Phone:</strong> {order.phone || '—'}</div>
            <div><strong style={{ color: '#0B2A4A' }}>Address:</strong> {order.shipping_address}</div>
            {order.landmark && <div><strong style={{ color: '#0B2A4A' }}>Landmark:</strong> {order.landmark}</div>}
            <div><strong style={{ color: '#0B2A4A' }}>Payment:</strong> {order.payment_method === 'cod' ? 'Cash on Delivery' : 'eSewa'}</div>
          </div>
        </div>
      ))}
    </>
  );
}

export default Orders;