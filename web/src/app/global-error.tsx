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
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '100vh',
          padding: '20px',
          fontFamily: 'system-ui'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '32px',
            maxWidth: '500px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              marginBottom: '16px',
              color: '#1f2937'
            }}>
              Error crítico
            </h2>
            <p style={{ 
              color: '#6b7280', 
              marginBottom: '24px' 
            }}>
              {error.message || 'Ocurrió un error inesperado'}
            </p>
            <button
              onClick={() => reset()}
              style={{
                width: '100%',
                backgroundColor: '#ec4899',
                color: 'white',
                fontWeight: 'bold',
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Intentar de nuevo
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}

