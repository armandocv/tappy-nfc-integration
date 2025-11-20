import React, { useState, useEffect, useRef } from 'react';

interface NFCScannerProps {
  onScan: (uid: string) => void;
  onError?: (error: string) => void;
  autoSubmit?: boolean;
  placeholder?: string;
}

export const NFCScanner: React.FC<NFCScannerProps> = ({
  onScan,
  onError,
  autoSubmit = true,
  placeholder = 'Waiting for NFC scan...'
}) => {
  const [scannedValue, setScannedValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleScan = (value: string) => {
    if (!value.trim() || isProcessing) return;
    
    setIsProcessing(true);
    try {
      onScan(value.trim());
      setScannedValue('');
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'Scan failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setScannedValue(value);
    
    if (autoSubmit && value.includes('\n')) {
      handleScan(value.replace('\n', ''));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleScan(scannedValue);
    }
  };

  return (
    <input
      ref={inputRef}
      type="text"
      value={scannedValue}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onBlur={() => !isProcessing && inputRef.current?.focus()}
      placeholder={placeholder}
      disabled={isProcessing}
      className="nfc-scanner-input"
    />
  );
};

export default NFCScanner;
