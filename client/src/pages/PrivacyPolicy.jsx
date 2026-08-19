import { Link } from 'react-router-dom';

function PrivacyPolicy() {
  const pageWrap = (children) => (
    <div style={{ backgroundColor: '#F4F6F8', minHeight: '100vh' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px' }}>{children}</div>
    </div>
  );

  const sectionTitle = { color: '#0B2A4A', fontSize: '18px', fontWeight: 700, margin: '24px 0 10px' };
  const paragraph = { color: '#5C7186', fontSize: '14px', lineHeight: 1.7, margin: '0 0 10px' };
  const listItem = { color: '#5C7186', fontSize: '14px', lineHeight: 1.7, marginBottom: '6px' };

  return pageWrap(
    <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
      <h1 style={{ color: '#0B2A4A', fontSize: '26px', marginBottom: '6px' }}>Privacy Policy</h1>
      <p style={{ color: '#5C7186', fontSize: '13px', marginBottom: '20px' }}>Last updated: August 2026</p>

      <p style={paragraph}>
        At MESsupply, we respect your privacy and are committed to protecting the personal
        information you share with us. This policy explains what information we collect, how we
        use it, and how we keep it safe.
      </p>

      <h2 style={sectionTitle}>1. Information We Collect</h2>
      <p style={paragraph}>When you create an account or place an order, we collect:</p>
      <ul style={{ paddingLeft: '20px', margin: '0 0 10px' }}>
        <li style={listItem}>Your name and email address (for account creation and order updates)</li>
        <li style={listItem}>Your phone number (for delivery coordination)</li>
        <li style={listItem}>Your shipping address, including province, district, municipality, and landmark</li>
        <li style={listItem}>Your order history and any reviews you submit</li>
      </ul>

      <h2 style={sectionTitle}>2. How We Use Your Information</h2>
      <p style={paragraph}>We use the information you provide to:</p>
      <ul style={{ paddingLeft: '20px', margin: '0 0 10px' }}>
        <li style={listItem}>Process and deliver your orders</li>
        <li style={listItem}>Send order confirmations and delivery status updates by email</li>
        <li style={listItem}>Respond to customer support questions</li>
        <li style={listItem}>Improve our products and website experience</li>
      </ul>

      <h2 style={sectionTitle}>3. How We Protect Your Information</h2>
      <p style={paragraph}>
        Your account password is securely encrypted and never stored in plain text. We do not
        store your full payment card details, as payments are processed through Cash on Delivery
        or our third-party payment partner, eSewa.
      </p>

      <h2 style={sectionTitle}>4. Sharing of Information</h2>
      <p style={paragraph}>
        We do not sell your personal information to third parties. Your delivery details are
        shared only as needed with our delivery/courier partners to fulfill your order.
      </p>

      <h2 style={sectionTitle}>5. Your Choices</h2>
      <p style={paragraph}>
        You may update your account information at any time, or contact us to request that your
        account and associated personal data be deleted, subject to any records we are required to
        keep for order and tax purposes.
      </p>

      <h2 style={sectionTitle}>6. Changes to This Policy</h2>
      <p style={paragraph}>
        We may update this Privacy Policy occasionally. Any changes will be posted on this page
        with an updated revision date.
      </p>

      <h2 style={sectionTitle}>7. Contact Us</h2>
      <p style={paragraph}>
        If you have questions about this Privacy Policy or how your data is handled, please reach
        out via our <Link to="/contact" style={{ color: '#FF5A00', fontWeight: 600 }}>Contact page</Link>.
      </p>
    </div>
  );
}

export default PrivacyPolicy;