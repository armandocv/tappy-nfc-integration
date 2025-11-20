# NFC Scanner Demo - Keyboard Wedge Mode

Test app for keyboard wedge mode integration. Requires TapTrack keyboard wedge utility.

## Quick Start

```bash
npm install
npm start
```

Opens at `http://localhost:3000`

## Requirements

- TapTrack keyboard wedge utility running
- Scanner configured to send UID + Enter key

## Component Usage

```tsx
import NFCScanner from './NFCScanner';

function MyComponent() {
  const handleScan = (uid: string) => {
    console.log('Scanned UID:', uid);
  };

  return (
    <NFCScanner
      onScan={handleScan}
      onError={(err) => console.error(err)}
      autoSubmit={true}
    />
  );
}
```

## Integration with Agentic Arcade

Copy `src/NFCScanner.tsx` to your project and use as shown above.

The component captures keyboard input from the scanner and calls `onScan` with the UID.

## Note

If keyboard wedge utility isn't working, use `../node-scanner` instead (TCMP direct mode).
