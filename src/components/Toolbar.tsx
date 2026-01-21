import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Share2, Heart, MessageCircle, Download, Calendar, Flame, Menu, X, Type, Minimize2, Sun, Upload, Play, LogIn, Shield } from 'lucide-react';
interface ToolbarProps {
  onShare: () => void;
  onLightCandle: () => void;
  onLeaveMemory: () => void;
}
export function Toolbar({
  onShare,
  onLightCandle,
  onLeaveMemory
}: ToolbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [textSize, setTextSize] = useState(100);
  const [reducedMotion, setReducedMotion] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    isAuthenticated,
    user
  } = useAuth();
  // Only show toolbar on home page
  const isHomePage = location.pathname === '/';
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  useEffect(() => {
    document.documentElement.style.fontSize = `${textSize}%`;
  }, [textSize]);
  useEffect(() => {
    if (reducedMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  }, [reducedMotion]);
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      setMobileMenuOpen(false);
    }
  };
  const navItems = [{
    label: 'Home',
    id: 'hero'
  }, {
    label: 'Photos',
    id: 'photos'
  }, {
    label: 'Life Story',
    id: 'timeline'
  }, {
    label: 'Service Details',
    id: 'service'
  }, {
    label: 'Memories',
    id: 'guestbook'
  }];
  if (!isHomePage) {
    return null;
  }
  return <>
      {/* Main Toolbar */}
      <motion.header initial={{
      y: -100
    }} animate={{
      y: 0
    }} className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo/Title */}
            <button onClick={() => scrollToSection('hero')} className="flex items-center gap-2 group">
              <Sun className="w-6 h-6 text-[var(--sunset-orange)] group-hover:rotate-90 transition-transform duration-500" />
              <span className="font-serif text-lg text-gray-700 hidden sm:inline">
                Rena's Celebration
              </span>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              {navItems.map(item => <button key={item.id} onClick={() => scrollToSection(item.id)} className="text-gray-600 hover:text-[var(--sunset-orange)] transition-colors font-serif">
                  {item.label}
                </button>)}
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Auth-dependent buttons */}
              {isAuthenticated ? <>
                  {user?.role === 'admin' && <button onClick={() => navigate('/admin')} className="hidden md:flex items-center gap-2 px-4 py-2 bg-[var(--sunset-orange)] text-white rounded-full hover:shadow-lg transition-all duration-300" title="Admin Dashboard">
                      <Shield className="w-4 h-4" />
                      <span className="text-sm font-serif">Admin</span>
                    </button>}
                  <button onClick={() => navigate('/upload')} className="hidden md:flex items-center gap-2 px-4 py-2 bg-[var(--wildflower-purple)] text-white rounded-full hover:shadow-lg transition-all duration-300" title="Upload Media">
                    <Upload className="w-4 h-4" />
                    <span className="text-sm font-serif">Upload</span>
                  </button>
                  <button onClick={() => navigate('/slideshow')} className="hidden md:flex items-center gap-2 px-4 py-2 bg-[var(--sunset-orange)] text-white rounded-full hover:shadow-lg transition-all duration-300" title="View Slideshow">
                    <Play className="w-4 h-4" />
                    <span className="text-sm font-serif">Slideshow</span>
                  </button>
                </> : <button onClick={() => navigate('/login')} className="hidden md:flex items-center gap-2 px-4 py-2 bg-[var(--sunset-orange)] text-white rounded-full hover:shadow-lg transition-all duration-300" title="Sign In">
                  <LogIn className="w-4 h-4" />
                  <span className="text-sm font-serif">Sign In</span>
                </button>}

              {/* Primary Actions */}
              <button onClick={onLightCandle} className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[var(--sunset-orange)] to-[var(--sunset-coral)] text-white rounded-full hover:shadow-lg transition-all duration-300 group" title="Light a Candle">
                <Flame className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-serif">Light Candle</span>
              </button>

              <button onClick={onLeaveMemory} className="hidden md:flex items-center gap-2 px-4 py-2 bg-[var(--wildflower-purple)] text-white rounded-full hover:shadow-lg transition-all duration-300" title="Share a Memory">
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm font-serif">Share Memory</span>
              </button>

              <button onClick={onShare} className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Share Memorial">
                <Share2 className="w-5 h-5 text-gray-600" />
              </button>

              {/* Accessibility Controls */}
              <div className="hidden xl:flex items-center gap-1 ml-2 pl-2 border-l border-gray-300">
                <button onClick={() => setTextSize(Math.max(80, textSize - 10))} className="p-2 hover:bg-gray-100 rounded transition-colors" title="Decrease Text Size">
                  <Minimize2 className="w-4 h-4 text-gray-600" />
                </button>
                <button onClick={() => setTextSize(Math.min(120, textSize + 10))} className="p-2 hover:bg-gray-100 rounded transition-colors" title="Increase Text Size">
                  <Type className="w-4 h-4 text-gray-600" />
                </button>
                <button onClick={() => setReducedMotion(!reducedMotion)} className={`p-2 rounded transition-colors ${reducedMotion ? 'bg-[var(--sunset-orange)] text-white' : 'hover:bg-gray-100'}`} title="Toggle Reduced Motion">
                  <motion.div animate={reducedMotion ? {} : {
                  rotate: 360
                }} transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'linear'
                }}>
                    <Sun className="w-4 h-4" />
                  </motion.div>
                </button>
              </div>

              {/* Mobile Menu Toggle */}
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors">
                {mobileMenuOpen ? <X className="w-6 h-6 text-gray-600" /> : <Menu className="w-6 h-6 text-gray-600" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && <motion.div initial={{
          opacity: 0,
          height: 0
        }} animate={{
          opacity: 1,
          height: 'auto'
        }} exit={{
          opacity: 0,
          height: 0
        }} className="lg:hidden bg-white/95 backdrop-blur-md border-t border-gray-200">
              <nav className="max-w-7xl mx-auto px-4 py-4 space-y-2">
                {navItems.map(item => <button key={item.id} onClick={() => scrollToSection(item.id)} className="block w-full text-left px-4 py-3 text-gray-600 hover:bg-[var(--sunset-pink)]/20 rounded-lg transition-colors font-serif">
                    {item.label}
                  </button>)}

                {/* Mobile Action Buttons */}
                <div className="pt-4 space-y-2 border-t border-gray-200">
                  {isAuthenticated ? <>
                      {user?.role === 'admin' && <button onClick={() => {
                  navigate('/admin');
                  setMobileMenuOpen(false);
                }} className="flex items-center gap-3 w-full px-4 py-3 bg-[var(--sunset-orange)] text-white rounded-lg">
                          <Shield className="w-5 h-5" />
                          <span className="font-serif">Admin Dashboard</span>
                        </button>}
                      <button onClick={() => {
                  navigate('/upload');
                  setMobileMenuOpen(false);
                }} className="flex items-center gap-3 w-full px-4 py-3 bg-[var(--wildflower-purple)] text-white rounded-lg">
                        <Upload className="w-5 h-5" />
                        <span className="font-serif">Upload Media</span>
                      </button>
                      <button onClick={() => {
                  navigate('/slideshow');
                  setMobileMenuOpen(false);
                }} className="flex items-center gap-3 w-full px-4 py-3 bg-[var(--sunset-orange)] text-white rounded-lg">
                        <Play className="w-5 h-5" />
                        <span className="font-serif">View Slideshow</span>
                      </button>
                    </> : <button onClick={() => {
                navigate('/login');
                setMobileMenuOpen(false);
              }} className="flex items-center gap-3 w-full px-4 py-3 bg-[var(--sunset-orange)] text-white rounded-lg">
                      <LogIn className="w-5 h-5" />
                      <span className="font-serif">Sign In to Upload</span>
                    </button>}
                  <button onClick={() => {
                onLightCandle();
                setMobileMenuOpen(false);
              }} className="flex items-center gap-3 w-full px-4 py-3 bg-gradient-to-r from-[var(--sunset-orange)] to-[var(--sunset-coral)] text-white rounded-lg">
                    <Flame className="w-5 h-5" />
                    <span className="font-serif">Light a Candle</span>
                  </button>
                  <button onClick={() => {
                onLeaveMemory();
                setMobileMenuOpen(false);
              }} className="flex items-center gap-3 w-full px-4 py-3 bg-[var(--wildflower-purple)] text-white rounded-lg">
                    <MessageCircle className="w-5 h-5" />
                    <span className="font-serif">Share a Memory</span>
                  </button>
                </div>
              </nav>
            </motion.div>}
        </AnimatePresence>
      </motion.header>

      {/* Quick Action Floating Button (Mobile) */}
      <motion.div initial={{
      scale: 0
    }} animate={{
      scale: isScrolled ? 1 : 0
    }} className="fixed bottom-6 right-6 z-40 lg:hidden">
        <button onClick={onLightCandle} className="p-4 bg-gradient-to-r from-[var(--sunset-orange)] to-[var(--sunset-coral)] text-white rounded-full shadow-2xl hover:scale-110 transition-transform">
          <Flame className="w-6 h-6" />
        </button>
      </motion.div>
    </>;
}