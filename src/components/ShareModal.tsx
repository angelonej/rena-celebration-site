import React, { useState, memo, Component } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Facebook, Twitter, Mail, Link2, Check } from 'lucide-react';
interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}
export function ShareModal({
  isOpen,
  onClose
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const memorialUrl = window.location.href;
  const memorialTitle = 'Rena Michele Voghel - Celebration of Life';
  const memorialDescription = 'Join us in celebrating the life of Rena Michele Voghel. Love Will Keep Us Together.';
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(memorialUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
  const shareViaEmail = () => {
    const subject = encodeURIComponent(memorialTitle);
    const body = encodeURIComponent(`${memorialDescription}\n\n${memorialUrl}`);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };
  const shareViaFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(memorialUrl)}`, '_blank', 'width=600,height=400');
  };
  const shareViaTwitter = () => {
    const text = encodeURIComponent(memorialDescription);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(memorialUrl)}`, '_blank', 'width=600,height=400');
  };
  return <AnimatePresence>
      {isOpen && <>
          {/* Backdrop */}
          <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} onClick={onClose} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />

          {/* Modal */}
          <motion.div initial={{
        opacity: 0,
        scale: 0.9,
        y: 20
      }} animate={{
        opacity: 1,
        scale: 1,
        y: 0
      }} exit={{
        opacity: 0,
        scale: 0.9,
        y: 20
      }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-50 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-serif text-gray-800">
                Share Memorial
              </h3>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Share Options */}
            <div className="space-y-3">
              <button onClick={shareViaFacebook} className="flex items-center gap-4 w-full p-4 bg-[#1877F2] text-white rounded-xl hover:bg-[#166FE5] transition-colors">
                <Facebook className="w-6 h-6" fill="currentColor" />
                <span className="font-serif text-lg">Share on Facebook</span>
              </button>

              <button onClick={shareViaTwitter} className="flex items-center gap-4 w-full p-4 bg-[#1DA1F2] text-white rounded-xl hover:bg-[#1A8CD8] transition-colors">
                <Twitter className="w-6 h-6" fill="currentColor" />
                <span className="font-serif text-lg">Share on Twitter</span>
              </button>

              <button onClick={shareViaEmail} className="flex items-center gap-4 w-full p-4 bg-[var(--wildflower-purple)] text-white rounded-xl hover:opacity-90 transition-opacity">
                <Mail className="w-6 h-6" />
                <span className="font-serif text-lg">Share via Email</span>
              </button>

              {/* Copy Link */}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 font-serif mb-2">
                  Or copy link
                </p>
                <div className="flex gap-2">
                  <input type="text" value={memorialUrl} readOnly className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 font-mono" />
                  <button onClick={copyToClipboard} className={`px-4 py-3 rounded-lg transition-all ${copied ? 'bg-green-500 text-white' : 'bg-[var(--sunset-orange)] text-white hover:bg-[var(--sunset-coral)]'}`}>
                    {copied ? <Check className="w-5 h-5" /> : <Link2 className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>}
    </AnimatePresence>;
}