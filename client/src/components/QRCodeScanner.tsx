import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check } from 'lucide-react';

interface QRCodeScannerProps {
  roomId: string;
  isConnected: boolean;
}

export default function QRCodeScanner({ roomId, isConnected }: QRCodeScannerProps) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const gameUrl = `${window.location.origin}/multiplayer-race?room=${roomId}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(gameUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Button
        onClick={() => setShowQR(!showQR)}
        variant="outline"
        className="bg-white/10 text-white border-white/30 hover:bg-white/20"
      >
        {showQR ? '📱 Hide QR Code' : '📱 Show QR Code'}
      </Button>

      {showQR && isConnected && (
        <div className="bg-white/5 backdrop-blur rounded-xl p-6 border-2 border-white/20">
          <div className="bg-white p-4 rounded-lg mb-4">
            <QRCodeSVG
              value={gameUrl}
              size={256}
              level="H"
              includeMargin={true}
            />
          </div>
          <p className="text-sm text-white/70 mb-3 text-center">Scan to join the game!</p>
          <Button
            onClick={copyToClipboard}
            size="sm"
            className="w-full bg-white/20 hover:bg-white/30 text-white"
          >
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Copy Link
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
