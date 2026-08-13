import { useParams, Link } from 'react-router-dom';

function OrderSuccess() {
  const { orderId } = useParams();

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Order Placed Successfully!</h1>
      <p>Your order #{orderId} has been received.</p>
      <Link to="/">Continue Shopping</Link>
    </div>
  );
}

export default OrderSuccess;