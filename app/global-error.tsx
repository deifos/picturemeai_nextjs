'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div
          style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '400px',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              padding: '32px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: '48px',
                marginBottom: '16px',
                animation: 'bounce 2s infinite',
              }}
            >
              💥
            </div>

            <h2
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '8px',
                margin: '0 0 8px 0',
              }}
            >
              Critical Error
            </h2>

            <p
              style={{
                color: '#6b7280',
                fontSize: '14px',
                lineHeight: '1.5',
                marginBottom: '24px',
                margin: '0 0 24px 0',
              }}
            >
              A critical error occurred that prevented the application from
              loading properly.
            </p>

            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              <button
                style={{
                  width: '100%',
                  padding: '12px 24px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onClick={() => reset()}
                onMouseOut={e => {
                  (e.target as HTMLButtonElement).style.backgroundColor =
                    '#3b82f6';
                }}
                onMouseOver={e => {
                  (e.target as HTMLButtonElement).style.backgroundColor =
                    '#2563eb';
                }}
              >
                Try Again
              </button>

              <button
                style={{
                  width: '100%',
                  padding: '8px 24px',
                  backgroundColor: 'transparent',
                  color: '#6b7280',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'color 0.2s',
                }}
                onClick={() => (window.location.href = '/')}
                onMouseOut={e => {
                  (e.target as HTMLButtonElement).style.color = '#6b7280';
                }}
                onMouseOver={e => {
                  (e.target as HTMLButtonElement).style.color = '#374151';
                }}
              >
                Go to Homepage
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && (
              <details
                style={{
                  marginTop: '24px',
                  textAlign: 'left',
                }}
              >
                <summary
                  style={{
                    fontSize: '12px',
                    color: '#6b7280',
                    cursor: 'pointer',
                  }}
                >
                  Error Details (Development)
                </summary>
                <pre
                  style={{
                    marginTop: '8px',
                    padding: '12px',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '8px',
                    fontSize: '11px',
                    color: '#dc2626',
                    overflow: 'auto',
                    maxHeight: '128px',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {error.message}
                </pre>
              </details>
            )}
          </div>
        </div>

        <style jsx>{`
          @keyframes bounce {
            0%,
            20%,
            53%,
            80%,
            100% {
              transform: translateY(0);
            }
            40%,
            43% {
              transform: translateY(-10px);
            }
            70% {
              transform: translateY(-5px);
            }
            90% {
              transform: translateY(-2px);
            }
          }
        `}</style>
      </body>
    </html>
  );
}
