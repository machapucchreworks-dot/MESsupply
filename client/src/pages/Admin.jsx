import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

function Admin() {
  const { user, token } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({
    name: '', description: '', price: '', stock: '', image_url: '', category_id: '',
  });
  const [error, setError] = useState('');

  const loadProducts = () => {
    fetch(`${API_URL}/api/products`)
      .then((res) => res.json())
      .then(setProducts);
  };

  useEffect(() => {
    loadProducts();
    fetch(`${API_URL}/api/categories`)
      .then((res) => res.json())
      .then(setCategories);
  }, []);

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

  return (
    <div style={{ padding: '20px' }}>
      <h1>Admin — Manage Products</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '30px', maxWidth: '500px' }}>
        <h2>{editingProduct ? `Editing: ${editingProduct.name}` : 'Add New Product'}</h2>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required style={{ width: '100%', padding: '8px', marginBottom: '8px' }} />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} style={{ width: '100%', padding: '8px', marginBottom: '8px' }} />
        <input name="price" type="number" step="0.01" placeholder="Price" value={form.price} onChange={handleChange} required style={{ width: '100%', padding: '8px', marginBottom: '8px' }} />
        <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} style={{ width: '100%', padding: '8px', marginBottom: '8px' }} />
        <input name="image_url" placeholder="Image URL" value={form.image_url} onChange={handleChange} style={{ width: '100%', padding: '8px', marginBottom: '8px' }} />
        <select name="category_id" value={form.category_id} onChange={handleChange} style={{ width: '100%', padding: '8px', marginBottom: '8px' }}>
          <option value="">-- Select Category --</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" style={{ padding: '10px 20px', marginRight: '10px' }}>
          {editingProduct ? 'Update Product' : 'Add Product'}
        </button>
        {editingProduct && (
          <button type="button" onClick={resetForm} style={{ padding: '10px 20px' }}>
            Cancel
          </button>
        )}
      </form>

      <h2>All Products</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ccc', textAlign: 'left' }}>
            <th>Name</th><th>Price</th><th>Stock</th><th>Category</th><th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
              <td>{p.name}</td>
              <td>Rs. {p.price}</td>
              <td>{p.stock}</td>
              <td>{p.category_id || '—'}</td>
              <td>
                <button onClick={() => handleEdit(p)} style={{ marginRight: '5px' }}>Edit</button>
                <button onClick={() => handleDelete(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Admin;