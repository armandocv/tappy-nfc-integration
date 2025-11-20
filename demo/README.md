# NFC Scanner Demo - Tappy Integration

Demo application showing how to integrate Tappy NFC scanner with React for the Agentic Arcade project.

## 🎯 Overview

This demo uses **keyboard wedge mode** where the Tappy NFC scanner acts like a keyboard, typing the NFC UID directly into the web application. No special drivers or SDK integration required.

## 📋 Prerequisites

- Node.js 16+ and npm
- Tappy NFC scanner configured in keyboard wedge mode
- NFC coins/tags to scan

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start
```

The app will open at `http://localhost:3000`

## 📦 Component Usage

### Basic Integration

```tsx
import NFCScanner from './NFCScanner';

function MyComponent() {
  const handleScan = (uid: string) => {
    console.log('Scanned UID:', uid);
    // Use the UID to fetch session data, validate user, etc.
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

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onScan` | `(uid: string) => void` | Required | Callback when NFC tag is scanned |
| `onError` | `(error: string) => void` | Optional | Error handler |
| `autoSubmit` | `boolean` | `true` | Auto-submit on Enter key |
| `placeholder` | `string` | `'Waiting for NFC scan...'` | Input placeholder text |

## 🔧 Scanner Configuration

### Keyboard Wedge Mode Setup

1. Connect Tappy scanner via USB
2. Scanner should be configured to send UID followed by Enter key
3. No additional software/drivers needed

### Testing Without Scanner

You can test by manually typing a UID and pressing Enter in the input field.

## 🎨 Styling

The component uses a simple CSS class `nfc-scanner-input` that you can customize:

```css
.nfc-scanner-input {
  width: 100%;
  padding: 1rem;
  font-size: 1.2rem;
  border: 3px solid #667eea;
  border-radius: 8px;
}
```

## 🔗 Integration with Agentic Arcade

### Step 1: Copy the Component

Copy `NFCScanner.tsx` to your project:
```
agentic-arcade/frontend/src/components/NFCScanner.tsx
```

### Step 2: Replace BoothSequenceEntry

In `BoothController.tsx`, replace the sequence entry component:

```tsx
// Before
<BoothSequenceEntry
  boothId={boothId}
  title={title}
  persona={persona}
  onSequenceEntered={handleSequenceEntered}
  onBack={onBack}
/>

// After
<div className="nfc-entry-container">
  <h2>{title}</h2>
  <p>Scan your NFC coin to continue</p>
  <NFCScanner
    onScan={(uid) => {
      // Validate UID with session API
      sessionService.getSession(uid)
        .then(sessionData => handleSequenceEntered([uid], sessionData))
        .catch(err => console.error('Invalid NFC coin:', err));
    }}
    onError={(err) => console.error(err)}
  />
</div>
```

### Step 3: Update Session Creation (Booth 1)

When creating a new session at Booth 1, use the NFC UID as the session identifier:

```tsx
const handleCreateSession = async (uid: string) => {
  const sessionData = await sessionService.createSession({
    combination: uid,  // Use NFC UID as combination
    booth_id: "1"
  });
  
  // Display success message
  console.log('Session created with UID:', uid);
};
```

## 🧪 Testing

1. **With Scanner**: Place NFC coin on scanner, UID should appear and auto-submit
2. **Without Scanner**: Type any text and press Enter to simulate a scan
3. **Check Console**: All scans are logged to browser console

## 📝 How It Works

1. Component renders a focused text input
2. Scanner types NFC UID into the input (keyboard wedge)
3. Scanner sends Enter key
4. Component captures the value and calls `onScan` callback
5. Input auto-focuses for next scan

## 🐛 Troubleshooting

### Scanner not working
- Check USB connection
- Verify scanner is in keyboard wedge mode
- Test scanner in a text editor first

### Input loses focus
- Component auto-refocuses on blur
- Check for other elements stealing focus

### UID not captured
- Ensure scanner sends Enter key after UID
- Check scanner configuration
