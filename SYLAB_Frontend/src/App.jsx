const App = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#07111f', color: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <main style={{ maxWidth: '980px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <section style={{ border: '1px solid rgba(148, 163, 184, 0.2)', borderRadius: '24px', padding: '2rem', background: 'rgba(15, 23, 42, 0.8)', boxShadow: '0 20px 60px rgba(2, 6, 23, 0.35)' }}>
          <p style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '0.3em', color: '#38bdf8', fontSize: '0.8rem' }}>
            SYLAB
          </p>
          <h1 style={{ fontSize: '2.2rem', margin: '0.75rem 0 1rem' }}>
            Academic & DSA Command Center
          </h1>
          <p style={{ fontSize: '1rem', lineHeight: 1.7, color: '#cbd5e1', marginBottom: '1.5rem' }}>
            The app shell is now in place with a clean structure for auth, dashboard, and future study-tracker features.
          </p>

          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            <div style={{ padding: '1rem', borderRadius: '16px', background: 'rgba(30, 41, 59, 0.9)' }}>
              <h2 style={{ marginTop: 0 }}>Auth</h2>
              <p style={{ marginBottom: 0, color: '#94a3b8' }}>Login, register, and reset password flows.</p>
            </div>
            <div style={{ padding: '1rem', borderRadius: '16px', background: 'rgba(30, 41, 59, 0.9)' }}>
              <h2 style={{ marginTop: 0 }}>Dashboard</h2>
              <p style={{ marginBottom: 0, color: '#94a3b8' }}>Overview, projects, calendar, and settings views.</p>
            </div>
            <div style={{ padding: '1rem', borderRadius: '16px', background: 'rgba(30, 41, 59, 0.9)' }}>
              <h2 style={{ marginTop: 0 }}>Future Modules</h2>
              <p style={{ marginBottom: 0, color: '#94a3b8' }}>Visualizer, LeetCode sync, and profile-based state.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;
