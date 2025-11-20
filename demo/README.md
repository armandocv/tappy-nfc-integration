# NFC Scanner Demo - Keyboard Wedge Mode

Demo app showing NFC scanner integration with React using keyboard wedge mode.

## Quick Start

```bash
npm install
npm start
```

Opens at `http://localhost:3000`

## Requirements

- Node.js 16+
- TapTrack keyboard wedge utility running
- Scanner configured to send UID + Enter key

## Component Usage

Copy `src/NFCScanner.tsx` to your project:

```tsx
import NFCScanner from './NFCScanner';

function MyComponent() {
  const handleScan = (uid: string) => {
    console.log('Scanned UID:', uid);
    // Use UID to fetch session, authenticate, etc.
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

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onScan` | `(uid: string) => void` | Required | Called when NFC tag scanned |
| `onError` | `(error: string) => void` | Optional | Error handler |
| `autoSubmit` | `boolean` | `true` | Auto-submit on Enter key |
| `placeholder` | `string` | `'Waiting for NFC scan...'` | Input placeholder |

## Integration with Agentic Arcade

### Step 1: Copy Component
```
agentic-arcade/frontend/src/components/NFCScanner.tsx
```

### Step 2: Replace Sequence Entry
```tsx
// Replace BoothSequenceEntry with:
<NFCScanner
  onScan={(uid) => {
    sessionService.getSession(uid)
      .then(sessionData => handleSequenceEntered([uid], sessionData))
      .catch(err => console.error('Invalid NFC coin:', err));
  }}
/>
```

### Step 3: Update Session Creation (Booth 1)
```tsx
const handleCreateSession = async (uid: string) => {
  const sessionData = await sessionService.createSession({
    combination: uid,  // Use NFC UID as session ID
    booth_id: "1"
  });
};
```

## How It Works

1. Component renders focused text input
2. Scanner types UID (keyboard wedge)
3. Scanner sends Enter key
4. Component captures value and calls `onScan`
5. Input auto-focuses for next scan

## Testing

**With Scanner:** Place coin on scanner, UID appears and auto-submits

**Without Scanner:** Type any text and press Enter to simulate
