function About() {
  return (
    <div style={{ backgroundColor: '#F4F6F8', minHeight: '100vh' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }}>
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '36px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          }}
        >
          <h1 style={{ color: '#0B2A4A', fontSize: '28px', margin: '0 0 16px' }}>About MESsupply</h1>
          <p style={{ color: '#5C7186', lineHeight: 1.8, marginBottom: '16px' }}>
            MESsupply is an online store based in Tulsipur, Dang, bringing together everyday
            essentials in one convenient place — books, stationery, gifts, music accessories,
            and sports equipment.
          </p>
          <p style={{ color: '#5C7186', lineHeight: 1.8, marginBottom: '16px' }}>
            We started with a simple goal: make it easy for people in Tulsipur and the wider
            Dang valley to find quality products without the hassle of visiting multiple shops.
            Whether you're a student looking for stationery, searching for the perfect gift, or
            gearing up for a game, we aim to have what you need — delivered right to your door.
          </p>
          <p style={{ color: '#5C7186', lineHeight: 1.8, marginBottom: '16px' }}>
            We're proud to serve our local community with fast delivery across Tulsipur City and
            the Dang valley, reliable service, and a growing selection of products.
          </p>
          <p style={{ color: '#5C7186', lineHeight: 1.8 }}>
            Have questions or suggestions? We'd love to hear from you — reach out through our{' '}
            <a href="/contact" style={{ color: '#FF5A00', fontWeight: 600, textDecoration: 'none' }}>
              Contact page
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;