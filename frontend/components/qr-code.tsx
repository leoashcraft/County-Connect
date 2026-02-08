'use client';

import { useState, useEffect } from 'react';
import { QrCode, Download, Copy, Check } from 'lucide-react';

interface QRCodeProps {
  url: string;
  size?: number;
  title?: string;
  className?: string;
}

export function QRCode({ url, size = 150, title, className = '' }: QRCodeProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  const fullUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${url.startsWith('/') ? url : `/${url}`}`
    : url;

  useEffect(() => {
    // Use QR Server API to generate QR code
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(fullUrl)}&format=png`;
    setQrDataUrl(qrUrl);
    setLoading(false);
  }, [fullUrl, size]);

  const handleDownload = async () => {
    if (!qrDataUrl) return;

    try {
      const response = await fetch(qrDataUrl);
      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `qr-${title?.replace(/[^a-z0-9]/gi, '-') || 'code'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    } catch (e) {
      console.error('Failed to download QR code:', e);
    }
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy:', e);
    }
  };

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="bg-gray-200 rounded-lg" style={{ width: size, height: size }} />
      </div>
    );
  }

  return (
    <div className={`inline-block ${className}`}>
      <div className="bg-white p-3 rounded-xl border border-gray-200 inline-block">
        {qrDataUrl && (
          <img
            src={qrDataUrl}
            alt={`QR code for ${title || 'this page'}`}
            width={size}
            height={size}
            className="rounded"
          />
        )}
        {title && (
          <p className="text-xs text-gray-500 text-center mt-2 max-w-[150px] truncate">
            {title}
          </p>
        )}
      </div>
      <div className="flex items-center justify-center gap-2 mt-2">
        <button
          onClick={handleDownload}
          className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
          title="Download QR code"
        >
          <Download className="w-4 h-4" />
        </button>
        <button
          onClick={handleCopyUrl}
          className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
          title="Copy URL"
        >
          {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

// Compact inline QR button that opens a modal
export function QRCodeButton({ url, title }: { url: string; title?: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <QrCode className="w-4 h-4" />
        QR Code
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setIsOpen(false)}>
          <div className="bg-white rounded-2xl p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold text-gray-900 mb-4 text-center">Scan to View</h3>
            <QRCode url={url} size={200} title={title} />
            <button
              onClick={() => setIsOpen(false)}
              className="w-full mt-4 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
