import React, { useEffect, useRef } from 'react';
import { useSmartScanner } from '../hooks/useSmartScanner';
import { X, Upload } from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface Props {
  onScan: (data: string) => void;
  onClose: () => void;
}

export const SmartScanner: React.FC<Props> = ({ onScan, onClose }) => {
  const { handleImageUpload, scanSuccess, toast, isValidating } = useSmartScanner(onScan);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    scannerRef.current = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    );
    
    scannerRef.current.render(
      (decodedText) => {
        // We only want to trigger once
        if (!scanSuccess) {
          onScan(decodedText);
        }
      },
      (error) => {
        // ignore errors
      }
    );

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(e => console.error(e));
      }
    };
  }, [onScan, scanSuccess]);

  return (
    <div className="relative w-full h-full bg-black flex flex-col">
      <div className="absolute top-4 right-4 z-50">
        <button onClick={onClose} className="p-2 bg-zinc-900/80 rounded-full text-white hover:bg-zinc-800">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 relative overflow-hidden flex items-center justify-center">
        <div id="reader" className="w-full max-w-sm mx-auto [&>div]:border-none [&>div]:!shadow-none"></div>
        
        {toast && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-zinc-900 px-6 py-3 rounded-full border border-zinc-800 shadow-xl z-50">
            <span className="text-emerald-400 font-bold">{toast}</span>
          </div>
        )}
      </div>

      <div className="absolute bottom-6 left-0 right-0 flex justify-center z-50">
        <button 
          onClick={handleImageUpload}
          disabled={isValidating}
          className="flex items-center gap-2 bg-zinc-900/90 backdrop-blur px-6 py-3 rounded-full text-white font-medium border border-zinc-800 hover:bg-zinc-800 transition-colors"
        >
          <Upload className="w-5 h-5" />
          {isValidating ? 'Processing...' : 'Upload Image'}
        </button>
      </div>
    </div>
  );
};
