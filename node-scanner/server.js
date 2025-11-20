const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const { SerialPort } = require('serialport');
const Tappy = require('@taptrack/tappy');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = 3001;
let tappyConnection = null;
let connectedClients = [];

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// WebSocket connection handler
wss.on('connection', (ws) => {
  console.log('Client connected');
  connectedClients.push(ws);

  ws.on('close', () => {
    console.log('Client disconnected');
    connectedClients = connectedClients.filter(client => client !== ws);
  });
});

// Broadcast to all connected clients
function broadcast(data) {
  connectedClients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

// Find TappyUSB serial port
async function findTappyPort() {
  const ports = await SerialPort.list();
  console.log('Available ports:', ports.map(p => p.path));
  
  // Look for common Tappy identifiers
  const tappyPort = ports.find(port => 
    port.manufacturer?.toLowerCase().includes('ftdi') ||
    port.manufacturer?.toLowerCase().includes('taptrack') ||
    port.path.includes('usbserial') ||
    port.path.includes('USB')
  );
  
  return tappyPort?.path || ports[0]?.path;
}

// Simple communicator for Node.js
class SimpleTappyCommunicator {
  constructor(portPath) {
    this.portPath = portPath;
    this.port = null;
    this.dataCallback = () => {};
    this.errorCallback = () => {};
    this.connected = false;
  }

  connect(callback) {
    this.port = new SerialPort({
      path: this.portPath,
      baudRate: 115200
    });

    this.port.on('open', () => {
      console.log(`Connected to Tappy on ${this.portPath}`);
      this.connected = true;
      callback?.(true);
    });

    this.port.on('data', (data) => {
      this.dataCallback(data);
    });

    this.port.on('error', (err) => {
      console.error('Serial port error:', err);
      this.errorCallback(err);
    });
  }

  disconnect(callback) {
    if (this.port && this.port.isOpen) {
      this.port.close(() => {
        this.connected = false;
        callback?.();
      });
    }
  }

  isConnected() {
    return this.connected;
  }

  send(data) {
    if (this.port && this.port.isOpen) {
      this.port.write(Buffer.from(data));
    }
  }

  setDataCallback(callback) {
    this.dataCallback = callback;
  }

  setErrorCallback(callback) {
    this.errorCallback = callback;
  }

  flush(callback) {
    callback?.();
  }
}

// Initialize Tappy connection
async function initializeTappy() {
  try {
    const portPath = await findTappyPort();
    
    if (!portPath) {
      console.error('No serial port found. Please connect TappyUSB.');
      broadcast({ type: 'error', message: 'No TappyUSB device found' });
      return;
    }

    console.log(`Attempting to connect to: ${portPath}`);
    broadcast({ type: 'status', message: `Connecting to ${portPath}...` });

    const communicator = new SimpleTappyCommunicator(portPath);
    
    const tappy = new Tappy({ communicator });

    tappy.setMessageListener((msg) => {
      const family = Array.from(msg.getCommandFamily());
      const code = msg.getCommandCode();
      const payload = Array.from(msg.getPayload());
      
      console.log('Received message:', { family, code, payload });

      // Check if this is a tag detection response
      // BasicNFC family (0x00, 0x01) with tag found code
      if (family[0] === 0x00 && family[1] === 0x01) {
        const uid = payload.slice(1).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
        console.log('NFC Tag UID:', uid);
        
        broadcast({
          type: 'scan',
          uid: uid,
          timestamp: new Date().toISOString()
        });
      }
    });

    tappy.setErrorListener((errorType, data) => {
      console.error('Tappy error:', errorType, data);
      broadcast({ type: 'error', message: `Scanner error: ${errorType}` });
    });

    tappy.connect(() => {
      console.log('Tappy connected successfully');
      broadcast({ type: 'status', message: 'Scanner ready - waiting for NFC tags...' });
      
      // Send command to start scanning (BasicNFC Stream Tags)
      // This is a simplified version - adjust based on your needs
      setTimeout(() => {
        const scanCommand = {
          getCommandFamily: () => new Uint8Array([0x00, 0x01]),
          getCommandCode: () => 0x01,
          getPayload: () => new Uint8Array([0x00, 0x00])
        };
        tappy.sendMessage(scanCommand);
      }, 1000);
    });

    tappyConnection = tappy;

  } catch (error) {
    console.error('Failed to initialize Tappy:', error);
    broadcast({ type: 'error', message: error.message });
  }
}

// Start server
server.listen(PORT, () => {
  console.log(`\n🚀 NFC Scanner Server running at http://localhost:${PORT}`);
  console.log('📡 Initializing TappyUSB connection...\n');
  initializeTappy();
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down...');
  if (tappyConnection) {
    tappyConnection.disconnect(() => {
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});
