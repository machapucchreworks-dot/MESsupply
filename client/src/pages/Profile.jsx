import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

const PROVINCES = [
  'Koshi Province', 'Madhesh Province', 'Bagmati Province', 'Gandaki Province',
  'Lumbini Province', 'Karnali Province', 'Sudurpashchim Province',
];

const DISTRICTS = [
  'Achham', 'Arghakhanchi', 'Baglung', 'Baitadi', 'Bajhang', 'Bajura', 'Banke',
  'Bara', 'Bardiya', 'Bhaktapur', 'Bhojpur', 'Chitwan', 'Dadeldhura', 'Dailekh',
  'Dang', 'Darchula', 'Dhading', 'Dhankuta', 'Dhanusha', 'Dolakha', 'Dolpa',
  'Doti', 'Gorkha', 'Gulmi', 'Humla', 'Ilam', 'Jajarkot', 'Jhapa', 'Jumla',
  'Kailali', 'Kalikot', 'Kanchanpur', 'Kapilvastu', 'Kaski', 'Kathmandu',
  'Kavrepalanchok', 'Khotang', 'Lalitpur', 'Lamjung', 'Mahottari', 'Makwanpur',
  'Manang', 'Morang', 'Mugu', 'Mustang', 'Myagdi', 'Nawalparasi (Bardaghat Susta East)',
  'Nawalparasi (Bardaghat Susta West)', 'Nuwakot', 'Okhaldhunga', 'Palpa',
  'Panchthar', 'Parbat', 'Parsa', 'Pyuthan', 'Ramechhap', 'Rasuwa', 'Rautahat',
  'Rolpa', 'Rukum East', 'Rukum West', 'Rupandehi', 'Salyan', 'Sankhuwasabha',
  'Saptari', 'Sarlahi', 'Sindhuli', 'Sindhupalchok', 'Siraha', 'Solukhumbu',
  'Sunsari', 'Surkhet', 'Syangja', 'Tanahun', 'Taplejung', 'Terhathum',
  'Udayapur',
];

const emptyForm = {
  label: 'Home',
  phone: '',
  province: 'Lumbini Province',
  district: 'Dang',
  municipality: '',
  streetAddress: '',
  landmark: '',
  shippingZone: 'city',
  isDefault: false,
};

function Profile() {
  const { user, token } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchAddresses = () => {
    setLoading(true);
    fetch(`${API_URL}/api/addresses`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setAddresses(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching addresses:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (token) fetchAddresses();
  }, [token]);

  const pageWrap = (children) => (
    <div style={{ backgroundColor: '#F4F6F8', minHeight: '100vh' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '24px' }}>{children}</div>
    </div>
  );

  if (!user) {
    return pageWrap(
      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '32px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <p style={{ color: '#5C7186', margin: 0 }}>
          Please <Link to="/login" style={{ color: '#FF5A00', fontWeight: 600 }}>login</Link> to view your profile.
        </p>
      </div>
    );
  }

  const inputStyle = {
    width: '100%',
    padding: '10px',
    border: '1px solid #E5E9ED',
    borderRadius: '8px',
    fontFamily: 'inherit',
    fontSize: '14px',
    boxSizing: 'border-box',
  };

  const labelStyle = {
    display: 'block',
    fontWeight: 600,
    color: '#0B2A4A',
    marginBottom: '8px',
    fontSize: '14px',
  };

  const rowStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    marginBottom: '16px',
  };

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '16px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  };

  const handleFieldChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
  };

  const handlePhoneChange = (e) => {
    const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
    setForm((f) => ({ ...f, phone: digitsOnly }));
  };

  const openAddForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
    setError('');
  };

  const openEditForm = (addr) => {
    setForm({
      label: addr.label,
      phone: addr.phone,
      province: addr.province,
      district: addr.district,
      municipality: addr.municipality,
      streetAddress: addr.street_address,
      landmark: addr.landmark || '',
      shippingZone: addr.shipping_zone,
      isDefault: addr.is_default,
    });
    setEditingId(addr.id);
    setShowForm(true);
    setError('');
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setError('');
  };

  const validate = () => {
    if (!/^9\d{9}$/.test(form.phone)) {
      return 'Enter a valid 10-digit phone number starting with 9';
    }
    if (form.municipality.trim().length < 3) {
      return 'Enter your municipality/city name';
    }
    const words = form.streetAddress.trim().split(/\s+/).filter(Boolean);
    if (form.streetAddress.trim().length < 6 || words.length < 2) {
      return 'Enter your ward number, tole/street name, or house details';
    }
    return '';
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError('');

    try {
      const url = editingId ? `${API_URL}/api/addresses/${editingId}` : `${API_URL}/api/addresses`;
      const method = editingId ? 'PUT' : 'POST';

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
        setError(data.error || 'Failed to save address');
        setSaving(false);
        return;
      }

      setSaving(false);
      closeForm();
      fetchAddresses();
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this address?')) return;
    try {
      const res = await fetch(`${API_URL}/api/addresses/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchAddresses();
      }
    } catch (err) {
      console.error('Error deleting address:', err);
    }
  };

  return pageWrap(
    <>
      <h1 style={{ color: '#0B2A4A', fontSize: '24px', margin: '0 0 6px' }}>My Profile</h1>
      <p style={{ color: '#5C7186', fontSize: '14px', margin: '0 0 20px' }}>{user.name} — {user.email}</p>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h2 style={{ color: '#0B2A4A', fontSize: '18px', margin: 0 }}>Saved Addresses</h2>
        {!showForm && (
          <button
            onClick={openAddForm}
            style={{
              backgroundColor: '#FF5A00',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            + Add Address
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSave} style={cardStyle}>
          <label style={labelStyle}>Label</label>
          <input
            type="text"
            value={form.label}
            onChange={handleFieldChange('label')}
            placeholder="e.g. Home, Work"
            style={{ ...inputStyle, marginBottom: '16px' }}
          />

          <label style={labelStyle}>Phone Number</label>
          <input
            type="tel"
            inputMode="numeric"
            value={form.phone}
            onChange={handlePhoneChange}
            placeholder="98XXXXXXXX"
            style={{ ...inputStyle, marginBottom: '16px' }}
          />

          <div style={rowStyle}>
            <div>
              <label style={labelStyle}>Province</label>
              <select value={form.province} onChange={handleFieldChange('province')} style={inputStyle}>
                {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>District</label>
              <select value={form.district} onChange={handleFieldChange('district')} style={inputStyle}>
                {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <label style={labelStyle}>Municipality / City</label>
          <input
            type="text"
            value={form.municipality}
            onChange={handleFieldChange('municipality')}
            placeholder="e.g. Tulsipur Sub-Metropolitan City"
            style={{ ...inputStyle, marginBottom: '16px' }}
          />

          <label style={labelStyle}>Ward, Street / Area Address</label>
          <textarea
            value={form.streetAddress}
            onChange={handleFieldChange('streetAddress')}
            rows="3"
            placeholder="e.g. Ward 5, Main Road, near XYZ"
            style={{ ...inputStyle, marginBottom: '16px' }}
          />

          <label style={labelStyle}>Nearest Landmark (optional)</label>
          <input
            type="text"
            value={form.landmark}
            onChange={handleFieldChange('landmark')}
            placeholder="e.g. Near Ghorahi Chowk"
            style={{ ...inputStyle, marginBottom: '16px' }}
          />

          <label style={labelStyle}>Delivery Zone</label>
          <select value={form.shippingZone} onChange={handleFieldChange('shippingZone')} style={{ ...inputStyle, marginBottom: '16px' }}>
            <option value="city">Inside Tulsipur City</option>
            <option value="valley">Dang Valley (inside/outside)</option>
          </select>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={(e) => setForm((f) => ({ ...f, isDefault: e.target.checked }))}
            />
            <span style={{ fontSize: '14px', color: '#0B2A4A' }}>Set as default address</span>
          </label>

          {error && <p style={{ color: '#D93636', fontSize: '14px', marginBottom: '12px' }}>{error}</p>}

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="submit"
              disabled={saving}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: saving ? '#C9CED4' : '#FF5A00',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: saving ? 'default' : 'pointer',
                fontSize: '15px',
                fontWeight: 700,
              }}
            >
              {saving ? 'Saving...' : editingId ? 'Update Address' : 'Save Address'}
            </button>
            <button
              type="button"
              onClick={closeForm}
              style={{
                padding: '12px 20px',
                backgroundColor: 'white',
                color: '#5C7186',
                border: '1px solid #E5E9ED',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: 600,
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p style={{ color: '#5C7186' }}>Loading your addresses...</p>
      ) : addresses.length === 0 && !showForm ? (
        <div style={{ ...cardStyle, textAlign: 'center' }}>
          <p style={{ color: '#5C7186', margin: 0 }}>
            You haven't saved any addresses yet. Add one so checkout is faster next time.
          </p>
        </div>
      ) : (
        addresses.map((addr) => (
          <div key={addr.id} style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 700, color: '#0B2A4A', fontSize: '15px' }}>{addr.label}</span>
                  {addr.is_default && (
                    <span
                      style={{
                        backgroundColor: '#FFF3EB',
                        color: '#FF5A00',
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '999px',
                      }}
                    >
                      DEFAULT
                    </span>
                  )}
                </div>
                <p style={{ color: '#5C7186', fontSize: '14px', margin: '0 0 2px', lineHeight: 1.5 }}>
                  {addr.street_address}, {addr.municipality}, {addr.district}, {addr.province}
                </p>
                {addr.landmark && (
                  <p style={{ color: '#8FA2B5', fontSize: '13px', margin: '0 0 2px' }}>
                    Landmark: {addr.landmark}
                  </p>
                )}
                <p style={{ color: '#8FA2B5', fontSize: '13px', margin: 0 }}>
                  Phone: {addr.phone} &middot; {addr.shipping_zone === 'city' ? 'Inside Tulsipur City' : 'Dang Valley'}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                <button
                  onClick={() => openEditForm(addr)}
                  style={{
                    background: 'none',
                    border: '1px solid #E5E9ED',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    fontSize: '13px',
                    color: '#0B2A4A',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(addr.id)}
                  style={{
                    background: 'none',
                    border: '1px solid #F5C2C2',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    fontSize: '13px',
                    color: '#D93636',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </>
  );
}

export default Profile;