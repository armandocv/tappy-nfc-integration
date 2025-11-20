import React, { useState } from 'react';
import NFCScanner from './NFCScanner';
import './App.css';

function App() {
  const [scannedUIDs, setScannedUIDs] = useState<string[]>([]);
  const [lastScan, setLastScan] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleScan = (uid: string) => {
    console.log('NFC UID scanned:', uid);
    setLastScan(uid);
    setScannedUIDs(prev => [uid, ...prev]);
    setError('');
  };

  const handleError = (error: string) => {
    console.error('Scan error:', error);
    setError(error);
  };

  const clearHistory = () => {
    setScannedUIDs([]);
    setLastScan('');
    setError('');
  };

  return (
    <div className="app">
      <header className="header">
        <h1>🪙 NFC Scanner Demo</h1>
        <p>Tappy NFC Integration for Agentic Arcade</p>
      </header>

      <main className="main">
        <div className="scanner-section">
          <h2>Scan Your NFC Coin</h2>
          <p className="instruction">Place your NFC coin on the scanner</p>
          
          <div className="scanner-container">
            <NFCScanner
              onScan={handleScan}
              onError={handleError}
              autoSubmit={true}
              placeholder="Waiting for scan..."
            />
          </div>

          {lastScan && (
            <div className="last-scan">
              <strong>Last Scanned UID:</strong>
              <code>{lastScan}</code>
            </div>
          )}

          {error && (
            <div className="error">
              <strong>Error:</strong> {error}
            </div>
          )}
        </div>

        <div className="history-section">
          <div className="history-header">
            <h2>Scan History</h2>
            {scannedUIDs.length > 0 && (
              <button onClick={clearHistory} className="clear-btn">
                Clear
              </button>
            )}
          </div>

          {scannedUIDs.length === 0 ? (
            <p className="empty-state">No scans yet</p>
          ) : (
            <ul className="history-list">
              {scannedUIDs.map((uid, index) => (
                <li key={index} className="history-item">
                  <span className="history-index">#{scannedUIDs.length - index}</span>
                  <code className="history-uid">{uid}</code>
                  <span className="history-time">
                    {new Date().toLocaleTimeString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="integration-section">
          <h2>Integration Example</h2>
          <pre className="code-block">
{`import NFCScanner from './NFCScanner';

function MyComponent() {
  const handleScan = (uid: string) => {
    // Use the UID to fetch session data
    console.log('Scanned UID:', uid);
  };

  return (
    <NFCScanner
      onScan={handleScan}
      onError={(err) => console.error(err)}
      autoSubmit={true}
    />
  );
}`}
          </pre>
        </div>
      </main>
    </div>
  );
}

export default App;
