import React, { useEffect, useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, X } from 'lucide-react';
interface CandleLightingProps {
  isOpen: boolean;
  onClose: () => void;
}
export function CandleLighting({
  isOpen,
  onClose
}: CandleLightingProps) {
  const [lit, setLit] = useState(false);
  useEffect(() => {
    if (isOpen) {
      setLit(false);
      const timer = setTimeout(() => setLit(true), 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);
  return <AnimatePresence>
      {isOpen && <>
          {/* Backdrop */}
          <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} onClick={onClose} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" />

          {/* Modal */}
          <motion.div initial={{
        opacity: 0,
        scale: 0.9
      }} animate={{
        opacity: 1,
        scale: 1
      }} exit={{
        opacity: 0,
        scale: 0.9
      }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-gradient-to-b from-gray-900 to-gray-800 rounded-2xl shadow-2xl z-50 p-8 text-center">
            <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors">
              <X className="w-5 h-5 text-white" />
            </button>

            <div className="mb-8">
              <h3 className="text-3xl script-font text-white mb-2">
                Light a Candle
              </h3>
              <p className="text-gray-300 font-serif text-sm">
                In loving memory of Rena Michele Voghel
              </p>
            </div>

            {/* Candle Animation */}
            <div className="relative h-64 flex items-end justify-center mb-8">
              {/* Candle body */}
              <div className="w-16 h-48 bg-gradient-to-b from-amber-100 to-amber-200 rounded-t-lg relative shadow-xl">
                {/* Wick */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-4 bg-gray-800" />

                {/* Flame */}
                <AnimatePresence>
                  {lit && <motion.div initial={{
                opacity: 0,
                scale: 0
              }} animate={{
                opacity: 1,
                scale: 1
              }} exit={{
                opacity: 0,
                scale: 0
              }} className="absolute -top-8 left-1/2 -translate-x-1/2">
                      <motion.div animate={{
                  scale: [1, 1.1, 1],
                  y: [0, -2, 0]
                }} transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}>
                        <Flame className="w-12 h-12 text-orange-500 fill-orange-400 drop-shadow-[0_0_10px_rgba(251,146,60,0.8)]" />
                      </motion.div>

                      {/* Glow effect */}
                      <motion.div animate={{
                  opacity: [0.5, 0.8, 0.5],
                  scale: [1, 1.2, 1]
                }} transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }} className="absolute inset-0 bg-orange-400/30 blur-xl rounded-full" />
                    </motion.div>}
                </AnimatePresence>

                {/* Wax drips */}
                <div className="absolute bottom-0 left-0 right-0 h-2 bg-amber-300 rounded-b-lg" />
              </div>
            </div>

            <motion.div initial={{
          opacity: 0,
          y: 10
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 1
        }}>
              <p className="text-white font-serif italic mb-6">
                "May this light shine as a symbol of love and remembrance"
              </p>
              <button onClick={onClose} className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors font-serif backdrop-blur-sm">
                Close
              </button>
            </motion.div>
          </motion.div>
        </>}
    </AnimatePresence>;
}