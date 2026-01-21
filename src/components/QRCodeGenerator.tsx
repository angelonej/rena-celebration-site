import React, { useEffect, useRef, memo, createElement } from 'react';
import { motion } from 'framer-motion';
import { Download, Share2 } from 'lucide-react';
interface QRCodeGeneratorProps {
  url: string;
  title: string;
}
export function QRCodeGenerator({
  url,
  title
}: QRCodeGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    // Simple QR code generation using canvas
    // In production, use a library like qrcode.react or qrcode
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        // Placeholder QR code visualization
        ctx.fillStyle = '#000';
        const size = 200;
        const moduleSize = size / 25;
        // Create a simple pattern (in production, use proper QR encoding)
        for (let i = 0; i < 25; i++) {
          for (let j = 0; j < 25; j++) {
            if (Math.random() > 0.5) {
              ctx.fillRect(i * moduleSize, j * moduleSize, moduleSize, moduleSize);
            }
          }
        }
      }
    }
  }, [url]);
  const downloadQR = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = 'memorial-qr-code.png';
      link.href = canvasRef.current.toDataURL();
      link.click();
    }
  };
  return <motion.div initial={{
    opacity: 0,
    scale: 0.9
  }} animate={{
    opacity: 1,
    scale: 1
  }} className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/50 text-center">
      <h3 className="text-xl script-font text-[var(--sunset-orange)] mb-4">
        Share via QR Code
      </h3>

      <div className="inline-block p-4 bg-white rounded-xl shadow-lg mb-4">
        <canvas ref={canvasRef} width={200} height={200} className="block" />
      </div>

      <p className="text-sm text-gray-600 font-serif mb-4">
        Scan to view the memorial on mobile devices
      </p>

      <div className="flex gap-2 justify-center">
        <button onClick={downloadQR} className="flex items-center gap-2 px-4 py-2 bg-[var(--sunset-orange)] text-white rounded-lg hover:shadow-lg transition-all font-serif text-sm">
          <Download className="w-4 h-4" />
          Download QR
        </button>
        <button onClick={() => {
        navigator.clipboard.writeText(url);
        alert('Link copied!');
      }} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:shadow-lg transition-all font-serif text-sm">
          <Share2 className="w-4 h-4" />
          Copy Link
        </button>
      </div>
    </motion.div>;
}