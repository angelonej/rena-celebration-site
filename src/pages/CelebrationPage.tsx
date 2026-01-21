import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AnimatedPattern } from '../components/AnimatedPattern';
import { PhotoGallery } from '../components/PhotoGallery';
import { LovedOnes } from '../components/LovedOnes';
import { FamilySection } from '../components/FamilySection';
import { FurryFamily } from '../components/FurryFamily';
import { FriendsAndPassions } from '../components/FriendsAndPassions';
import { FavoritePlaces } from '../components/FavoritePlaces';
import { Toolbar } from '../components/Toolbar';
import { ShareModal } from '../components/ShareModal';
import { TributeForm } from '../components/TributeForm';
import { CandleLighting } from '../components/CandleLighting';
import { ServiceDetails } from '../components/ServiceDetails';
import { LifeTimeline } from '../components/LifeTimeline';
import { Guestbook } from '../components/Guestbook';
import { Heart, Music, Waves } from 'lucide-react';
export function CelebrationPage() {
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [tributeFormOpen, setTributeFormOpen] = useState(false);
  const [candleModalOpen, setCandleModalOpen] = useState(false);
  return <div className="min-h-screen relative bg-[#FFF5EE] text-[#4A4A4A] overflow-hidden">
      <AnimatedPattern />

      {/* Toolbar */}
      <Toolbar onShare={() => setShareModalOpen(true)} onLightCandle={() => setCandleModalOpen(true)} onLeaveMemory={() => setTributeFormOpen(true)} />

      {/* Modals */}
      <ShareModal isOpen={shareModalOpen} onClose={() => setShareModalOpen(false)} />
      <TributeForm isOpen={tributeFormOpen} onClose={() => setTributeFormOpen(false)} />
      <CandleLighting isOpen={candleModalOpen} onClose={() => setCandleModalOpen(false)} />

      {/* Main Content Container */}
      <main className="relative z-10">
        {/* Hero Section with Parallax */}
        <section id="hero" className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
          {/* Hero Background Image */}
          <motion.div initial={{
          scale: 1.1,
          opacity: 0
        }} animate={{
          scale: 1,
          opacity: 1
        }} transition={{
          duration: 2,
          ease: 'easeOut'
        }} className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FFF5EE]/60 to-[#FFF5EE]" />
            <img src="/1000018221.jpg" alt="Florida Keys" className="w-full h-full object-cover" />
          </motion.div>

          {/* Hero Content */}
          <div className="relative z-10 text-center px-4 pt-32 pb-20">
            <motion.div initial={{
            opacity: 0,
            y: 30
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 1.2,
            delay: 0.5
          }}>
              <motion.div animate={{
              rotate: [0, 5, -5, 0],
              scale: [1, 1.05, 1]
            }} transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut'
            }} className="inline-block p-4 rounded-full bg-white/80 backdrop-blur-sm mb-6 shadow-2xl">
                <Waves className="w-12 h-12 text-[var(--sunset-orange)]" />
              </motion.div>

              <motion.h2 initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 1,
              delay: 0.8
            }} className="text-2xl md:text-3xl tracking-widest uppercase text-[var(--sunset-coral)] font-serif mb-4 drop-shadow-lg">
                Celebration of Life
              </motion.h2>

              <motion.h1 initial={{
              opacity: 0,
              scale: 0.9
            }} animate={{
              opacity: 1,
              scale: 1
            }} transition={{
              duration: 1.5,
              delay: 1
            }} className="text-7xl md:text-9xl lg:text-[10rem] script-font text-white mb-6 drop-shadow-2xl leading-tight" style={{
              textShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}>
                Rena' Michele Voghel
              </motion.h1>

              <motion.p initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 1,
              delay: 1.3
            }} className="text-2xl md:text-3xl text-white font-serif italic max-w-2xl mx-auto leading-relaxed drop-shadow-lg bg-black/20 backdrop-blur-sm py-4 px-8 rounded-2xl">
                "Love Will Keep Us Together"
              </motion.p>

              <motion.div initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 1,
              delay: 1.6
            }} className="mt-8 text-white/90 font-serif text-lg bg-white/20 backdrop-blur-md py-3 px-6 rounded-full inline-block">
                1966 - 2024
              </motion.div>
            </motion.div>

            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 2,
            duration: 1
          }} className="flex gap-4 justify-center items-center text-white mt-12">
              <Heart className="w-6 h-6 fill-current drop-shadow-lg" />
              <span className="text-xl font-serif drop-shadow-lg">
                Forever in Our Hearts
              </span>
              <Heart className="w-6 h-6 fill-current drop-shadow-lg" />
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} transition={{
            delay: 2.5,
            duration: 1
          }} className="absolute bottom-8 left-1/2 -translate-x-1/2">
              <motion.div animate={{
              y: [0, 10, 0]
            }} transition={{
              duration: 2,
              repeat: Infinity
            }} className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
                <motion.div animate={{
                y: [0, 12, 0]
              }} transition={{
                duration: 2,
                repeat: Infinity
              }} className="w-1.5 h-1.5 bg-white rounded-full" />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Photo Gallery */}
        <PhotoGallery />

        {/* Tribute Text Section */}
        <section className="py-20 px-4 max-w-4xl mx-auto text-center relative">
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] rounded-3xl -z-10 shadow-sm border border-white/50" />

          <motion.div initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} className="space-y-8 p-8 md:p-12">
            <p className="text-2xl md:text-3xl leading-relaxed font-serif text-gray-700">
              From her childhood in{' '}
              <span className="text-[var(--nature-green)] font-bold">
                Naugatuck, Connecticut
              </span>{' '}
              to her teenage years in{' '}
              <span className="text-[var(--sunset-gold)] font-bold">
                Fort Lauderdale
              </span>{' '}
              and the{' '}
              <span className="text-[var(--sunset-orange)] font-bold">
                Florida Keys
              </span>
              , Rena' spirit was as boundless as the ocean.
            </p>

            <div className="w-24 h-1 bg-gradient-to-r from-[var(--sunset-orange)] to-[var(--sunset-pink)] mx-auto rounded-full" />

            <p className="text-lg md:text-xl leading-relaxed text-gray-600">
              From Connecticut's peaceful landscapes to Florida's endless
              horizons, with sun and water in her heart, her beloved dogs by her
              side, and classic cars gleaming in the driveway, Rena' journey was
              one of joy, adventure, and boundless love. Her melody plays on in
              every heart she touched.
            </p>

            <div className="flex justify-center gap-6 pt-8">
              <motion.div animate={{
              rotate: [0, 10, 0, -10, 0]
            }} transition={{
              duration: 4,
              repeat: Infinity
            }}>
                <Music className="w-8 h-8 text-[var(--wildflower-purple)]" />
              </motion.div>
              <motion.div animate={{
              scale: [1, 1.2, 1]
            }} transition={{
              duration: 2,
              repeat: Infinity
            }}>
                <Heart className="w-8 h-8 text-[var(--heart-pink)] fill-current" />
              </motion.div>
              <motion.div animate={{
              rotate: [0, -10, 0, 10, 0]
            }} transition={{
              duration: 5,
              repeat: Infinity
            }}>
                <Waves className="w-8 h-8 text-[var(--sunset-orange)]" />
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Loved Ones - Family & Friends */}
        <LovedOnes />

        {/* Family Section - Kalin & Joey */}
        <FamilySection />

        {/* Furry Family - Dogs */}
        <FurryFamily />

        {/* Friends & Passions - Naples Community & Classic Cars */}
        <FriendsAndPassions />

        {/* Favorite Places - Good Times Diner */}
        <FavoritePlaces />

        {/* Life Timeline */}
        <LifeTimeline />

        {/* Service Details */}
        <ServiceDetails />

        {/* Guestbook */}
        <Guestbook />

        {/* Footer */}
        <footer className="py-12 text-center text-gray-500 font-serif text-sm relative z-10">
          <p>With love, always.</p>
        </footer>
      </main>
    </div>;
}