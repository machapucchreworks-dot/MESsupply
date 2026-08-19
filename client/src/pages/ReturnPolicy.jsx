import { Link } from 'react-router-dom';

function ReturnPolicy() {
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
      <h1 style={{ color: '#0B2A4A', fontSize: '26px', marginBottom: '6px' }}>Return &amp; Cancellation Policy</h1>
      <p style={{ color: '#5C7186', fontSize: '13px', marginBottom: '20px' }}>Last updated: August 2026</p>

      <p style={paragraph}>
        We want you to be happy with your purchase. If something isn't right, here's how returns,
        exchanges, and cancellations work at MESsupply.
      </p>

      <h2 style={sectionTitle}>1. Order Cancellations</h2>
      <p style={paragraph}>
        You may request to cancel your order while it is still in the "Order Placed" or
        "Processing" stage by contacting us via our{' '}
        <Link to="/contact" style={{ color: '#FF5A00', fontWeight: 600 }}>Contact page</Link> or
        WhatsApp. Once an order has been marked "Shipped," it can no longer be cancelled.
      </p>

      <h2 style={sectionTitle}>2. Returns &amp; Exchanges</h2>
      <p style={paragraph}>You may request a return or exchange within 3 days of delivery if:</p>
      <ul style={{ paddingLeft: '20px', margin: '0 0 10px' }}>
        <li style={listItem}>The item received is damaged or defective</li>
        <li style={listItem}>The item received does not match what you ordered</li>
        <li style={listItem}>The item is missing parts described in the listing</li>
      </ul>
      <p style={paragraph}>
        To be eligible, the item must be unused, in its original packaging, and accompanied by
        proof of purchase (your order number).
      </p>

      <h2 style={sectionTitle}>3. Non-Returnable Items</h2>
      <p style={paragraph}>
        For hygiene and practical reasons, certain items (such as opened stationery consumables)
        may not be eligible for return unless defective. If in doubt, contact us before placing
        your order.
      </p>

      <h2 style={sectionTitle}>4. How to Request a Return</h2>
      <p style={paragraph}>
        Contact us via our{' '}
        <Link to="/contact" style={{ color: '#FF5A00', fontWeight: 600 }}>Contact page</Link> or
        WhatsApp with your order number and a description (and photo, if possible) of the issue.
        We'll confirm the next steps, including pickup or return shipping arrangements.
      </p>

      <h2 style={sectionTitle}>5. Refunds</h2>
      <p style={paragraph}>
        Once we receive and inspect the returned item, we will notify you of the approval status.
        Approved refunds for Cash on Delivery orders will be processed via bank transfer or
        eSewa; approved refunds for eSewa payments will be returned to your original payment
        method. Refunds are typically processed within 5–7 business days of approval.
      </p>

      <h2 style={sectionTitle}>6. Questions</h2>
      <p style={paragraph}>
        If you have any questions about a return or cancellation, please reach out via our{' '}
        <Link to="/contact" style={{ color: '#FF5A00', fontWeight: 600 }}>Contact page</Link>.
      </p>
    </div>
  );
}

export default ReturnPolicy;