import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Camera, PawPrint, Sparkles } from 'lucide-react';
const dogs = [{
  id: 1,
  name: 'Archie',
  personality: 'The Loyal Companion',
  description: 'Her faithful friend who never left her side, bringing comfort and unconditional love every single day.',
  imageUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1920',
  color: 'var(--sunset-orange)',
  traits: ['Loyal', 'Gentle', 'Always by her side', 'Her shadow']
}, {
  id: 2,
  name: 'Baskin',
  personality: 'The Playful Spirit',
  description: 'Full of energy and joy, turning every moment into an adventure and every day into a celebration.',
  imageUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=1920',
  color: 'var(--wildflower-purple)',
  traits: ['Energetic', 'Playful', 'Full of life', 'The entertainer']
}, {
  id: 3,
  name: 'Skeetz',
  personality: 'The Sweet Soul',
  description: 'A gentle heart wrapped in fur, bringing peace, love, and endless cuddles to every moment.',
  imageUrl: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1920',
  color: 'var(--heart-pink)',
  traits: ['Sweet', 'Loving', 'Cuddle expert', 'Pure heart']
}];
export function FurryFamily() {
  return <section id="furry-family" className="py-20 px-4 relative bg-gradient-to-b from-transparent via-[var(--sunset-pink)]/5 to-transparent">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div initial={{
        opacity: 0,
        y: 30
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} className="text-center mb-16">
          <motion.div animate={{
          rotate: [0, -10, 10, 0],
          y: [0, -5, 0]
        }} transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }} className="inline-block mb-6">
            <PawPrint className="w-16 h-16 text-[var(--sunset-orange)]" />
          </motion.div>

          <h2 className="text-4xl md:text-5xl script-font text-[var(--sunset-orange)] mb-4">
            Her Furry Family
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[var(--sunset-orange)] to-[var(--sunset-pink)] mx-auto rounded-full mb-6" />
          <p className="text-2xl text-gray-700 font-serif max-w-3xl mx-auto leading-relaxed mb-4">
            Archie, Baskin & Skeetz
          </p>
          <p className="text-lg text-gray-600 font-serif max-w-2xl mx-auto leading-relaxed">
            Her beloved rescue dogs filled her life with boundless love, wagging
            tails, and pure joy. They weren't just pets—they were family,
            companions, and the keepers of her heart.
          </p>
        </motion.div>

        {/* Dog Cards with Photo Frames */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {dogs.map((dog, index) => <motion.div key={dog.id} initial={{
          opacity: 0,
          y: 40
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          delay: index * 0.2,
          duration: 0.6
        }} className="group">
              {/* Decorative Frame */}
              <div className="relative">
                {/* Outer Glow */}
                <div className="absolute -inset-6 rounded-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500 blur-xl" style={{
              backgroundColor: dog.color
            }} />

                {/* Main Frame */}
                <div className="relative bg-white p-6 rounded-2xl shadow-2xl group-hover:shadow-3xl transition-all duration-500">
                  {/* Paw Print Corner Decorations */}
                  <div className="absolute -top-3 -right-3 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
                    <PawPrint className="w-6 h-6" style={{
                  color: dog.color
                }} />
                  </div>

                  {/* Photo Container */}
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 mb-6">
                    {/* Upload Placeholder */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[var(--sunset-pink)]/10 to-[var(--sunset-gold)]/10 z-10">
                      <Camera className="w-16 h-16 text-gray-300 mb-3" />
                      <p className="text-sm font-serif text-gray-400">
                        Add {dog.name}'s Photo
                      </p>
                    </div>

                    {/* Background Image (placeholder) */}
                    <img src={dog.imageUrl} alt={dog.name} className="w-full h-full object-cover opacity-30" />

                    {/* Hover Upload Overlay */}
                    <motion.div initial={{
                  opacity: 0
                }} whileHover={{
                  opacity: 1
                }} className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center cursor-pointer z-20">
                      <Camera className="w-12 h-12 text-white mb-2" />
                      <p className="text-white font-serif text-sm">
                        Click to Upload
                      </p>
                    </motion.div>
                  </div>

                  {/* Dog Info */}
                  <div className="text-center">
                    <h3 className="text-3xl script-font mb-2" style={{
                  color: dog.color
                }}>
                      {dog.name}
                    </h3>
                    <p className="text-sm font-serif text-gray-500 uppercase tracking-wide mb-3">
                      {dog.personality}
                    </p>
                    <p className="text-sm font-serif text-gray-600 leading-relaxed mb-4">
                      {dog.description}
                    </p>

                    {/* Traits */}
                    <div className="flex flex-wrap gap-2 justify-center">
                      {dog.traits.map((trait, idx) => <span key={idx} className="px-3 py-1 text-xs font-serif rounded-full" style={{
                    backgroundColor: `${dog.color}15`,
                    color: dog.color
                  }}>
                          {trait}
                        </span>)}
                    </div>
                  </div>

                  {/* Decorative Corners */}
                  <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 rounded-tl-lg opacity-30" style={{
                borderColor: dog.color
              }} />
                  <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 rounded-tr-lg opacity-30" style={{
                borderColor: dog.color
              }} />
                  <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 rounded-bl-lg opacity-30" style={{
                borderColor: dog.color
              }} />
                  <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 rounded-br-lg opacity-30" style={{
                borderColor: dog.color
              }} />
                </div>
              </div>
            </motion.div>)}
        </div>

        {/* Collage Section - Multiple Photos */}
        <motion.div initial={{
        opacity: 0,
        y: 40
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} className="mb-16">
          <div className="relative bg-white/60 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl border border-white/50">
            <h3 className="text-3xl script-font text-[var(--sunset-orange)] text-center mb-8">
              Adventures Together
            </h3>

            {/* Photo Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(item => <motion.div key={item} initial={{
              opacity: 0,
              scale: 0.9
            }} whileInView={{
              opacity: 1,
              scale: 1
            }} viewport={{
              once: true
            }} transition={{
              delay: item * 0.05
            }} className="group relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer">
                  {/* Upload Placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[var(--sunset-pink)]/10 to-[var(--sunset-gold)]/10">
                    <Camera className="w-8 h-8 text-gray-300" />
                  </div>

                  {/* Hover Overlay */}
                  <motion.div initial={{
                opacity: 0
              }} whileHover={{
                opacity: 1
              }} className="absolute inset-0 bg-[var(--sunset-orange)]/80 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-center text-white">
                      <Camera className="w-8 h-8 mx-auto mb-1" />
                      <p className="text-xs font-serif">Upload Photo</p>
                    </div>
                  </motion.div>
                </motion.div>)}
            </div>

            <p className="text-center text-sm font-serif text-gray-500 mt-6">
              Beach walks, car rides, cuddle sessions, and all the moments in
              between
            </p>
          </div>
        </motion.div>

        {/* Heartfelt Quote */}
        <motion.div initial={{
        opacity: 0,
        y: 30
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} className="max-w-4xl mx-auto">
          <div className="relative bg-gradient-to-br from-[var(--sunset-orange)]/10 via-[var(--wildflower-purple)]/10 to-[var(--heart-pink)]/10 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/50 shadow-xl">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2">
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--sunset-orange)] to-[var(--heart-pink)] rounded-full flex items-center justify-center shadow-lg">
                <Heart className="w-6 h-6 text-white fill-current" />
              </div>
            </div>

            <div className="text-center">
              <div className="text-6xl text-[var(--sunset-orange)] mb-4">"</div>
              <p className="text-2xl md:text-3xl font-serif text-gray-700 italic leading-relaxed mb-6">
                Dogs are not our whole life, but they make our lives whole.
                Archie, Baskin, and Skeetz were more than pets—they were her
                constant companions, her comfort in difficult times, and the
                source of endless joy and unconditional love.
              </p>

              <div className="flex items-center justify-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <PawPrint className="w-5 h-5 text-[var(--sunset-orange)]" />
                  <span className="font-serif text-gray-600">Rescue Dogs</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-[var(--heart-pink)] fill-current" />
                  <span className="font-serif text-gray-600">
                    Forever Loved
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[var(--wildflower-purple)]" />
                  <span className="font-serif text-gray-600">Pure Joy</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Upload Instructions */}
        <motion.div initial={{
        opacity: 0
      }} whileInView={{
        opacity: 1
      }} viewport={{
        once: true
      }} className="mt-12 text-center">
          <div className="inline-block px-6 py-3 bg-[var(--sunset-orange)]/10 border border-[var(--sunset-orange)]/20 rounded-full">
            <p className="text-sm font-serif text-gray-600">
              <Camera className="w-4 h-4 inline mr-2" />
              Share your favorite photos of Archie, Baskin, and Skeetz to
              celebrate their beautiful spirits
            </p>
          </div>
        </motion.div>

        {/* Floating Paw Prints Animation */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => <motion.div key={i} className="absolute" initial={{
          x: Math.random() * 100 + '%',
          y: '100%',
          opacity: 0
        }} animate={{
          y: '-20%',
          opacity: [0, 0.3, 0]
        }} transition={{
          duration: 8 + Math.random() * 4,
          repeat: Infinity,
          delay: i * 2,
          ease: 'linear'
        }}>
              <PawPrint className="w-8 h-8 text-[var(--sunset-orange)]/20" />
            </motion.div>)}
        </div>
      </div>
    </section>;
}