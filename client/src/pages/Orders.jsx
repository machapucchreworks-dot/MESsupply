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

  if (!user) {
    return (
      <div style={{ padding: '20px' }}>
        <p>Please <Link to="/login">login</Link> to view your orders.</p>
      </div>
    );
  }

  if (loading) return <p style={{ padding: '20px' }}>Loading orders...</p>;

  if (orders.length === 0) {
    return (
      <div style={{ padding: '20px' }}>
        <p>You haven't placed any orders yet. <Link to="/">Go shopping</Link></p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Your Orders</h1>
      {orders.map((order) => (
        <div
          key={order.id}
          style={{
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '15px',
            marginBottom: '15px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <strong>Order #{order.id}</strong>
            <span style={{ textTransform: 'capitalize' }}>{order.status}</span>
          </div>
          <p style={{ color: '#666', fontSize: '14px' }}>
            {new Date(order.created_at).toLocaleDateString()}
          </p>
          {order.items.map((item, idx) => (
            <div
              key={idx}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '8px 0' }}
            >
              <img src={item.image_url} alt={item.name} style={{ width: '40px' }} />
              <span>{item.name} x {item.quantity}</span>
              <span style={{ marginLeft: 'auto' }}>Rs. {item.price}</span>
            </div>
          ))}
          <h3 style={{ marginTop: '10px', textAlign: 'right' }}>
            Total: Rs. {order.total}
          </h3>
        </div>
      ))}
    </div>
  );
}

export default Orders;