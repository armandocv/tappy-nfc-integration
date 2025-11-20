# NFC Scanner - TCMP Direct Mode

Node.js app that communicates directly with TappyUSB. No middleware required.

## Quick Start

```bash
npm install
npm start
```

Open `http://localhost:3001` and scan your NFC coins.

## How It Works

```
TappyUSB → Node.js (TCMP SDK) → WebSocket → Browser UI
```

- Auto-detects TappyUSB serial port
- Reads NFC tag UIDs via TCMP protocol
- Broadcasts scans to browser via WebSocket

## Integration with Agentic Arcade

Run this server alongside your React app:

```bash
# Terminal 1: NFC Scanner
cd node-scanner
npm start

# Terminal 2: React App
cd your-react-app
npm start
```

Connect via WebSocket in your React component:

```tsx
useEffect(() => {
  const ws = new WebSocket('ws://localhost:3001');
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'scan') {
      console.log('Scanned UID:', data.uid);
      // Use UID to fetch session, authenticate, etc.
    }
  };
  
  return () => ws.close();
}, []);
```

## Troubleshooting

**Scanner not detected:**
- Check USB connection
- Close other apps using the scanner

**No scans appearing:**
- Hold coin on scanner for 2-3 seconds
- Check server console for errors

**Port conflict:**
Change port in `server.js`: `const PORT = 3002;`

## Configuration

**Manual port selection** (if auto-detect fails):
```javascript
// In server.js, replace findTappyPort() with:
const portPath = 'COM3'; // Windows
// or '/dev/ttyUSB0' for Mac/Linux
```
