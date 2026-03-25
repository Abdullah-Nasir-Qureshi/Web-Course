function About() {
  return (
    <div style={{ maxWidth: 640, margin: '48px auto', padding: '0 24px', textAlign: 'left' }}>
      <h1 style={{ marginBottom: 16 }}>About</h1>
      <p style={{ lineHeight: '1.7', marginBottom: 16 }}>
        This app is a minimal React single-page application built with <strong>React Router v6</strong> and <strong>Vite</strong>.
        It demonstrates client-side routing — navigating between pages without a full browser reload.
      </p>
      <p style={{ lineHeight: '1.7', marginBottom: 16 }}>
        The three pages — Home, About, and Contact — share a persistent navigation bar.
        The Contact page features a fully controlled form with input validation.
      </p>
      <ul style={{ paddingLeft: 20, lineHeight: '2' }}>
        <li>⚡ Vite for fast development builds</li>
        <li>🔀 React Router v6 for client-side navigation</li>
        <li>🧪 Vitest + Testing Library for unit and property-based tests</li>
        <li>✅ fast-check for property-based testing</li>
      </ul>
    </div>
  )
}

export default About
