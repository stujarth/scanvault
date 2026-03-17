'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
          <div style={{ textAlign: 'center', maxWidth: 400 }}>
            <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Something went wrong</h2>
            <p style={{ color: '#6b7280', marginBottom: 24 }}>
              {error.message || 'An unexpected error occurred.'}
            </p>
            <button
              onClick={reset}
              style={{ padding: '8px 24px', borderRadius: 6, background: '#0d9488', color: 'white', border: 'none', cursor: 'pointer', fontSize: 14 }}
            >
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
