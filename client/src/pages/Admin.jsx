import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const STATUS_COLORS = {
  pending: '#FF5A00',
  processing: '#3B82F6',
  shipped: '#8B5CF6',
  delivered: '#1B8A5A',
  cancelled: '#D93636',
};

function Admin() {
  const { user, token } = useAuth();
  const [tab, setTab] = useState('products');

  // Products state
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({
    name: '', description: '', price: '', stock: '', image_url: '', category_id: '',
  });
  const [error, setError] = useState('');

  // Orders state
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const loadProducts = () => {
    fetch(`${API_URL}/api/products`)
      .then((res) => res.json())
      .then(setProducts);
  };

  const loadOrders = () => {
    setOrdersLoading(true);
    fetch(`${API_URL}/api/admin/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setOrdersLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching orders:', err);
        setOrdersLoading(false);
      });
  };

  useEffect(() => {
    loadProducts();
    fetch(`${API_URL}/api/categories`)
      .then((res) => res.json())
      .then(setCategories);
  }, []);

  useEffect(() => {
    if (tab === 'orders') loadOrders();
  }, [tab]);

  if (!user) return <p style={{ padding: '20px' }}>Please login.</p>;

  const resetForm = () => {
    setForm({ name: '', description: '', price: '', stock: '', image_url: '', category_id: '' });
    setEditingProduct(null);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const url = editingProduct
      ? `${API_URL}/api/admin/products/${editingProduct.id}`
      : `${API_URL}/api/admin/products`;
    const method = editingProduct ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong');
        return;
      }

      resetForm();
      loadProducts();
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description || '',
      price: product.price,
      stock: product.stock,
      image_url: product.image_url || '',
      category_id: product.category_id || '',
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;

    try {
      const res = await fetch(`${API_URL}/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data.error);
        return;
      }

      loadProducts();
    } catch (err) {
      console.error(err);
      alert('Something went wrong deleting the product.');
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'Failed to update status');
        return;
      }

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      console.error(err);
      alert('Something went wrong updating the order.');
    }
  };

  const tabButtonStyle = (active) => ({
    padding: '10px 20px',
    border: 'none',
    borderBottom: active ? '3px solid #FF5A00' : '3px solid transparent',
    backgroundColor: 'transparent',
    color: active ? '#0B2A4A' : '#5C7186',
    fontWeight: 600,
    fontSize: '15px',
    cursor: 'pointer',
  });

  return (
    <div style={{ backgroundColor: '#F4F6F8', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px' }}>
        <h1 style={{ color: '#0B2A4A', fontSize: '24px', margin: '0 0 20px' }}>Admin Dashboard</h1>

        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #E5E9ED', marginBottom: '24px' }}>
          <button style={tabButtonStyle(tab === 'products')} onClick={() => setTab('products')}>
            Products
          </button>
          <button style={tabButtonStyle(tab === 'orders')} onClick={() => setTab('orders')}>
            Orders
          </button>
        </div>

        {tab === 'products' && (
          <>
            <form
              onSubmit={handleSubmit}
              style={{
                marginBottom: '30px',
                maxWidth: '500px',
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              }}
            >
              <h2 style={{ color: '#0B2A4A', fontSize: '18px', marginTop: 0 }}>
                {editingProduct ? `Editing: ${editingProduct.name}` : 'Add New Product'}
              </h2>
              <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required style={{ width: '100%', padding: '10px', marginBottom: '8px', border: '1px solid #E5E9ED', borderRadius: '6px' }} />
              <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} style={{ width: '100%', padding: '10px', marginBottom: '8px', border: '1px solid #E5E9ED', borderRadius: '6px' }} />
              <input name="price" type="number" step="0.01" placeholder="Price" value={form.price} onChange={handleChange} required style={{ width: '100%', padding: '10px', marginBottom: '8px', border: '1px solid #E5E9ED', borderRadius: '6px' }} />
              <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} style={{ width: '100%', padding: '10px', marginBottom: '8px', border: '1px solid #E5E9ED', borderRadius: '6px' }} />
              <input name="image_url" placeholder="Image URL" value={form.image_url} onChange={handleChange} style={{ width: '100%', padding: '10px', marginBottom: '8px', border: '1px solid #E5E9ED', borderRadius: '6px' }} />
              <select name="category_id" value={form.category_id} onChange={handleChange} style={{ width: '100%', padding: '10px', marginBottom: '8px', border: '1px solid #E5E9ED', borderRadius: '6px' }}>
                <option value="">-- Select Category --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              {error && <p style={{ color: '#D93636' }}>{error}</p>}
              <button type="submit" style={{ padding: '10px 20px', marginRight: '10px', backgroundColor: '#FF5A00', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
                {editingProduct ? 'Update Product' : 'Add Product'}
              </button>
              {editingProduct && (
                <button type="button" onClick={resetForm} style={{ padding: '10px 20px', border: '1px solid #E5E9ED', borderRadius: '6px', backgroundColor: 'white', cursor: 'pointer' }}>
                  Cancel
                </button>
              )}
            </form>

            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
              <h2 style={{ color: '#0B2A4A', fontSize: '18px', marginTop: 0 }}>All Products</h2>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #E5E9ED', textAlign: 'left', color: '#5C7186', fontSize: '13px' }}>
                    <th style={{ padding: '8px 0' }}>Name</th><th>Price</th><th>Stock</th><th>Category</th><th></th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} style={{ borderBottom: '1px solid #E5E9ED' }}>
                      <td style={{ padding: '10px 0', color: '#0B2A4A' }}>{p.name}</td>
                      <td style={{ color: '#0B2A4A' }}>Rs. {p.price}</td>
                      <td style={{ color: '#0B2A4A' }}>{p.stock}</td>
                      <td style={{ color: '#5C7186' }}>{p.category_id || '—'}</td>
                      <td>
                        <button onClick={() => handleEdit(p)} style={{ marginRight: '8px', color: '#0B2A4A', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Edit</button>
                        <button onClick={() => handleDelete(p.id)} style={{ color: '#D93636', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tab === 'orders' && (
          <div>
            {ordersLoading ? (
              <p style={{ color: '#5C7186' }}>Loading orders...</p>
            ) : orders.length === 0 ? (
              <p style={{ color: '#5C7186' }}>No orders yet.</p>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '18px',
                    marginBottom: '14px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <strong style={{ color: '#0B2A4A' }}>Order #{order.id}</strong>
                      <span style={{ color: '#5C7186', fontSize: '13px', marginLeft: '10px' }}>
                        {new Date(order.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: `2px solid ${STATUS_COLORS[order.status] || '#E5E9ED'}`,
                        color: STATUS_COLORS[order.status] || '#0B2A4A',
                        fontWeight: 700,
                        fontSize: '13px',
                        textTransform: 'capitalize',
                        cursor: 'pointer',
                      }}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s} style={{ color: '#0B2A4A' }}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ fontSize: '13px', color: '#5C7186', marginTop: '10px', lineHeight: 1.6 }}>
                    <div><strong style={{ color: '#0B2A4A' }}>{order.customer_name}</strong> — {order.customer_email}</div>
                    <div>Phone: {order.phone || '—'} | Zone: {order.shipping_zone === 'city' ? 'Inside Tulsipur City' : 'Dang Valley'}</div>
                    <div>Address: {order.shipping_address}{order.landmark ? ` (near ${order.landmark})` : ''}</div>
                    <div>Payment: {order.payment_method === 'cod' ? 'Cash on Delivery' : 'eSewa'} ({order.payment_status})</div>
                  </div>

                  <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #E5E9ED' }}>
                    {order.items.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#0B2A4A', padding: '2px 0' }}>
                        <span>{item.name} x {item.quantity}</span>
                        <span>Rs. {item.price}</span>
                      </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontWeight: 700, color: '#FF5A00' }}>
                      <span>Total</span>
                      <span>Rs. {Number(order.total).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin;