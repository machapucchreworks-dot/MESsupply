import { Link } from 'react-router-dom';

function Terms() {
  const pageWrap = (children) => (
    <div style={{ backgroundColor: '#F4F6F8', minHeight: '100vh' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px' }}>{children}</div>
    </div>
  );

  const sectionTitle = { color: '#0B2A4A', fontSize: '18px', fontWeight: 700, margin: '24px 0 10px' };
  const paragraph = { color: '#5C7186', fontSize: '14px', lineHeight: 1.7, margin: '0 0 10px' };

  return pageWrap(
    <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
      <h1 style={{ color: '#0B2A4A', fontSize: '26px', marginBottom: '6px' }}>Terms of Service</h1>
      <p style={{ color: '#5C7186', fontSize: '13px', marginBottom: '20px' }}>Last updated: August 2026</p>

      <p style={paragraph}>
        Welcome to MESsupply. By accessing or using our website, you agree to be bound by these
        Terms of Service. Please read them carefully before placing an order.
      </p>

      <h2 style={sectionTitle}>1. About Us</h2>
      <p style={paragraph}>
        MESsupply is an online store based in Tulsipur, Dang, Nepal, offering books, stationery,
        gifts, music accessories, and sports equipment for sale within Nepal.
      </p>

      <h2 style={sectionTitle}>2. Orders</h2>
      <p style={paragraph}>
        When you place an order through our website, you are making an offer to purchase the
        selected product(s) at the listed price. We reserve the right to cancel or refuse any
        order, including in cases of pricing errors, stock unavailability, or suspected fraudulent
        activity. You will be notified if your order cannot be fulfilled.
      </p>

      <h2 style={sectionTitle}>3. Pricing &amp; Payment</h2>
      <p style={paragraph}>
        All prices are listed in Nepalese Rupees (NPR) and are subject to change without prior
        notice. We currently accept Cash on Delivery (COD) and eSewa as payment methods. You are
        responsible for providing accurate contact and delivery information at checkout.
      </p>

      <h2 style={sectionTitle}>4. Shipping &amp; Delivery</h2>
      <p style={paragraph}>
        Delivery fees and estimated timeframes vary by zone and are shown at checkout. While we
        aim to deliver within the stated timeframe, delays may occasionally occur due to factors
        outside our control (weather, courier availability, incorrect address details, etc.).
      </p>

      <h2 style={sectionTitle}>5. Returns &amp; Cancellations</h2>
      <p style={paragraph}>
        Please see our <Link to="/return-policy" style={{ color: '#FF5A00', fontWeight: 600 }}>Return Policy</Link> for
        details on returns, exchanges, and order cancellations.
      </p>

      <h2 style={sectionTitle}>6. User Accounts</h2>
      <p style={paragraph}>
        You are responsible for maintaining the confidentiality of your account login details and
        for all activity that occurs under your account. Notify us immediately if you suspect
        unauthorized use of your account.
      </p>

      <h2 style={sectionTitle}>7. Changes to These Terms</h2>
      <p style={paragraph}>
        We may update these Terms of Service from time to time. Continued use of our website after
        changes are posted constitutes your acceptance of the revised terms.
      </p>

      <h2 style={sectionTitle}>8. Contact Us</h2>
      <p style={paragraph}>
        If you have any questions about these Terms, please reach out via our{' '}
        <Link to="/contact" style={{ color: '#FF5A00', fontWeight: 600 }}>Contact page</Link>.
      </p>
    </div>
  );
}

export default Terms;