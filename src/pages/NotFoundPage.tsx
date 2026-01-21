import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
export function NotFoundPage() {
  const navigate = useNavigate();
  return <div className="min-h-screen bg-gradient-to-br from-[#FFF5EE] via-[var(--sunset-pink)]/20 to-[var(--sunset-gold)]/20 flex items-center justify-center px-4">
      <motion.div initial={{
      opacity: 0,
      scale: 0.9
    }} animate={{
      opacity: 1,
      scale: 1
    }} className="text-center max-w-md">
        <motion.div animate={{
        rotate: [0, 10, -10, 0]
      }} transition={{
        duration: 2,
        repeat: Infinity,
        repeatDelay: 1
      }} className="text-9xl font-bold text-[var(--sunset-orange)] mb-4 script-font">
          404
        </motion.div>

        <h1 className="text-3xl script-font text-gray-800 mb-4">
          Page Not Found
        </h1>

        <p className="text-gray-600 font-serif mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={() => navigate(-1)} className="flex items-center justify-center gap-2 px-6 py-3 bg-white/60 backdrop-blur-sm text-gray-700 rounded-xl hover:shadow-lg transition-all font-serif border border-white/50">
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
          <button onClick={() => navigate('/')} className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[var(--sunset-orange)] to-[var(--sunset-coral)] text-white rounded-xl hover:shadow-lg transition-all font-serif">
            <Home className="w-5 h-5" />
            Home
          </button>
        </div>
      </motion.div>
    </div>;
}