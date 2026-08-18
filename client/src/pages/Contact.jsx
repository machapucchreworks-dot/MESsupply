function Contact() {
  const contactLinks = [
    {
      name: 'WhatsApp',
      description: 'Chat with us directly for quick help',
      href: 'https://wa.me/9779866963219',
      color: '#25D366',
      label: 'WA',
    },
    {
      name: 'Facebook',
      description: 'Message our Facebook page',
      href: 'https://facebook.com',
      color: '#1877F2',
      label: 'FB',
    },
    {
      name: 'Instagram',
      description: 'DM us on Instagram',
      href: 'https://instagram.com',
      color: '#E1306C',
      label: 'IG',
    },
  ];

  return (
    <div style={{ backgroundColor: '#F4F6F8', minHeight: '100vh' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '40px 24px' }}>
        <h1 style={{ color: '#0B2A4A', fontSize: '28px', margin: '0 0 8px', textAlign: 'center' }}>
          Get in Touch
        </h1>
        <p style={{ color: '#5C7186', textAlign: 'center', marginBottom: '32px' }}>
          We are happy to help, reach out through any of these channels.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {contactLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '20px',
                textDecoration: 'none',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: link.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: 'white',
                  flexShrink: 0,
                }}
              >
                {link.label}
              </div>
              <div>
                <p style={{ margin: '0 0 2px', fontWeight: 700, color: '#0B2A4A', fontSize: '16px' }}>
                  {link.name}
                </p>
                <p style={{ margin: 0, color: '#5C7186', fontSize: '13px' }}>
                  {link.description}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Contact;