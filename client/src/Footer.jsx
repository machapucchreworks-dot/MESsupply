import { Link } from 'react-router-dom';

function Footer() {
  const columnTitle = {
    color: 'white',
    fontSize: '15px',
    fontWeight: 700,
    marginBottom: '14px',
  };

  const linkStyle = {
    display: 'block',
    color: '#C9CED4',
    fontSize: '14px',
    textDecoration: 'none',
    marginBottom: '10px',
  };

  return (
    <footer style={{ backgroundColor: '#0B2A4A', marginTop: '40px' }}>
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '40px 24px 24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '28px',
        }}
      >
        <div>
          <div style={{ color: 'white', fontSize: '18px', fontWeight: 700, marginBottom: '10px' }}>
            <span style={{ color: '#FF5A00' }}>MES</span>supply
          </div>
          <p style={{ color: '#C9CED4', fontSize: '13px', lineHeight: 1.6, margin: 0 }}>
            Everything you need — books, stationery, gifts, music accessories, and sports
            equipment, delivered across Tulsipur and Dang Valley.
          </p>
        </div>

        <div>
          <div style={columnTitle}>Quick Links</div>
          <Link to="/about" style={linkStyle}>About</Link>
          <Link to="/contact" style={linkStyle}>Contact</Link>
          <Link to="/orders" style={linkStyle}>My Orders</Link>
        </div>

        <div>
          <div style={columnTitle}>Policies</div>
          <Link to="/terms" style={linkStyle}>Terms of Service</Link>
          <Link to="/privacy-policy" style={linkStyle}>Privacy Policy</Link>
          <Link to="/return-policy" style={linkStyle}>Return Policy</Link>
        </div>

        <div>
          <div style={columnTitle}>Get in Touch</div>
          <a href="tel:+9779866963219" style={linkStyle}>+977-9866963219</a>
          <a href="mailto:machapucchreworks@gmail.com" style={linkStyle}>
            machapucchreworks@gmail.com
          </a>
          <div style={{ display: 'flex', gap: '14px', marginTop: '4px' }}>
            <a href="#" style={{ color: '#C9CED4', fontSize: '13px', textDecoration: 'none' }}>
              Facebook
            </a>
            <a href="#" style={{ color: '#C9CED4', fontSize: '13px', textDecoration: 'none' }}>
              Instagram
            </a>
          </div>
        </div>
      </div>

      <div
        style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          padding: '16px 24px',
          textAlign: 'center',
        }}
      >
        <p style={{ color: '#8FA2B5', fontSize: '13px', margin: 0 }}>
          © 2026 MESsupply. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;