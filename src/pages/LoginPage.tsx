import React, { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { Heart, Lock, Mail, ArrowRight, Sun } from 'lucide-react';
import { useAuth } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';
export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const {
    login
  } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const success = await login(email, password);
    if (success) {
      // Check if admin
      if (email.toLowerCase().includes('admin')) {
        navigate('/admin');
      } else {
        navigate('/upload');
      }
    } else {
      setError('Invalid credentials. Use password: rena2025');
    }
    setLoading(false);
  };
  return <div className="min-h-screen bg-gradient-to-br from-[#FFF5EE] via-[var(--sunset-pink)]/20 to-[var(--sunset-gold)]/20 flex items-center justify-center px-4 py-12">
      <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div animate={{
          rotate: 360
        }} transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear'
        }} className="inline-block mb-4">
            <Sun className="w-16 h-16 text-[var(--sunset-orange)]" />
          </motion.div>
          <h1 className="text-4xl script-font text-[var(--sunset-orange)] mb-2">
            Rena's Memorial
          </h1>
          <p className="text-gray-600 font-serif">
            Share your memories and photos
          </p>
        </div>

        {/* Login Card */}
        <motion.div initial={{
        opacity: 0,
        scale: 0.95
      }} animate={{
        opacity: 1,
        scale: 1
      }} transition={{
        delay: 0.2
      }} className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-serif text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--sunset-orange)] focus:border-transparent outline-none transition-all font-serif" placeholder="your.email@example.com" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-serif text-gray-700 mb-2">
                Access Code
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--sunset-orange)] focus:border-transparent outline-none transition-all font-serif" placeholder="Enter access code" />
              </div>
            </div>

            {error && <motion.div initial={{
            opacity: 0,
            y: -10
          }} animate={{
            opacity: 1,
            y: 0
          }} className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm font-serif">
                {error}
              </motion.div>}

            <button type="submit" disabled={loading} className="w-full py-3 bg-gradient-to-r from-[var(--sunset-orange)] to-[var(--sunset-coral)] text-white rounded-lg hover:shadow-lg transition-all font-serif flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? 'Signing in...' : <>
                  Sign In
                  <ArrowRight className="w-5 h-5" />
                </>}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="space-y-3 text-sm text-gray-600 font-serif">
              <p className="font-bold text-gray-800">Access Information:</p>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p>
                  Use any email address with password: <strong>rena2025</strong>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button onClick={() => navigate('/')} className="text-[var(--sunset-orange)] hover:text-[var(--sunset-coral)] transition-colors font-serif text-sm flex items-center justify-center gap-2 mx-auto">
              <Heart className="w-4 h-4" />
              Return to Memorial
            </button>
          </div>
        </motion.div>

        {/* Info Card */}
        <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        delay: 0.4
      }} className="mt-6 text-center">
          <p className="text-sm text-gray-600 font-serif leading-relaxed">
            Family and friends are invited to share photos and videos
            <br />
            for the slideshow at Rena's Celebration of Life
            <br />
            <span className="text-[var(--sunset-orange)] font-bold">
              February 13th, 2026
            </span>
          </p>
        </motion.div>
      </motion.div>
    </div>;
}