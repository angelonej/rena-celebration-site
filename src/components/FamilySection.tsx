import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sun, Palmtree, Camera } from 'lucide-react';
const familyMemories = [{
  id: 1,
  title: 'Kalin & Joey',
  subtitle: 'Her Beloved Stepchildren',
  description: 'The joy of her life, bringing laughter and love to every moment',
  imageUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=1920',
  location: 'Family Love'
}, {
  id: 2,
  title: 'Naples Adventures',
  subtitle: 'Sun-Soaked Days',
  description: 'Beach days, sunset walks, and endless memories in paradise',
  imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920',
  location: 'Naples, Florida'
}, {
  id: 3,
  title: 'South Beach Memories',
  subtitle: 'Miami Magic',
  description: 'Art deco vibes, ocean breezes, and unforgettable family moments',
  imageUrl: 'https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?w=1920',
  location: 'South Beach, Miami'
}, {
  id: 4,
  title: 'Beach Days Together',
  subtitle: 'Sun & Fun',
  description: 'Building sandcastles, chasing waves, and making memories that last forever',
  imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920',
  location: 'Florida Beaches'
}, {
  id: 5,
  title: 'Naples Pier Sunsets',
  subtitle: 'Golden Hour Magic',
  description: 'Watching the sun paint the sky in colors of love and joy',
  imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920',
  location: 'Naples Pier'
}, {
  id: 6,
  title: 'Family Adventures',
  subtitle: 'Creating Memories',
  description: 'Every moment together was a treasure, every laugh a gift',
  imageUrl: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920',
  location: 'Together Forever'
}];
export function FamilySection() {
  return <section id="family" className="py-20 px-4 relative bg-gradient-to-b from-transparent to-[var(--sunset-pink)]/10">
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
          rotate: [0, 5, -5, 0],
          scale: [1, 1.1, 1]
        }} transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut'
        }} className="inline-block mb-6">
            <Heart className="w-16 h-16 text-[var(--heart-pink)] fill-current" />
          </motion.div>

          <h2 className="text-4xl md:text-5xl script-font text-[var(--sunset-orange)] mb-4">
            Her Greatest Joy
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[var(--sunset-orange)] to-[var(--sunset-pink)] mx-auto rounded-full mb-6" />
          <p className="text-2xl text-gray-700 font-serif max-w-3xl mx-auto leading-relaxed mb-4">
            Kalin & Joey
          </p>
          <p className="text-lg text-gray-600 font-serif max-w-2xl mx-auto leading-relaxed">
            Her stepchildren were the world to her - sharing sun-soaked
            adventures in Naples and South Beach, creating memories filled with
            laughter, love, and endless joy
          </p>
        </motion.div>

        {/* Photo Grid with Frames */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {familyMemories.map((memory, index) => <motion.div key={memory.id} initial={{
          opacity: 0,
          y: 40
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          delay: index * 0.15,
          duration: 0.6
        }} className="group">
              {/* Decorative Frame */}
              <div className="relative">
                {/* Outer Frame Border */}
                <div className="absolute -inset-4 bg-gradient-to-br from-[var(--sunset-gold)] via-[var(--sunset-orange)] to-[var(--sunset-coral)] rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500" />

                {/* Inner Frame */}
                <div className="relative bg-white p-4 rounded-xl shadow-2xl group-hover:shadow-3xl transition-all duration-500">
                  {/* Photo Container */}
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
                    {/* Placeholder for user photos */}
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[var(--sunset-pink)]/20 to-[var(--sunset-gold)]/20">
                      <Camera className="w-16 h-16 text-[var(--sunset-orange)]/30" />
                    </div>

                    {/* Background Image (can be replaced with actual family photos) */}
                    <img src={memory.imageUrl} alt={memory.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-all duration-700 group-hover:scale-110" />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Location Badge */}
                    <div className="absolute top-3 right-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full flex items-center gap-2 shadow-lg">
                      <Palmtree className="w-4 h-4 text-[var(--sunset-orange)]" />
                      <span className="text-xs font-serif text-gray-700">
                        {memory.location}
                      </span>
                    </div>

                    {/* Upload Indicator */}
                    <motion.div initial={{
                  opacity: 0
                }} whileHover={{
                  opacity: 1
                }} className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center cursor-pointer">
                      <div className="text-center text-white">
                        <Camera className="w-12 h-12 mx-auto mb-2" />
                        <p className="text-sm font-serif">Click to add photo</p>
                      </div>
                    </motion.div>
                  </div>

                  {/* Caption Area */}
                  <div className="mt-4 text-center">
                    <h3 className="text-2xl script-font text-[var(--sunset-orange)] mb-1">
                      {memory.title}
                    </h3>
                    <p className="text-sm font-serif text-gray-500 uppercase tracking-wide mb-2">
                      {memory.subtitle}
                    </p>
                    <p className="text-sm font-serif text-gray-600 leading-relaxed">
                      {memory.description}
                    </p>
                  </div>

                  {/* Decorative Corner Elements */}
                  <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-[var(--sunset-gold)]/30 rounded-tl-lg" />
                  <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-[var(--sunset-gold)]/30 rounded-tr-lg" />
                  <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-[var(--sunset-gold)]/30 rounded-bl-lg" />
                  <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-[var(--sunset-gold)]/30 rounded-br-lg" />
                </div>
              </div>
            </motion.div>)}
        </div>

        {/* Family Quote */}
        <motion.div initial={{
        opacity: 0,
        y: 30
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} className="mt-20 max-w-4xl mx-auto">
          <div className="relative bg-white/60 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl border border-white/50">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2">
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--sunset-orange)] to-[var(--sunset-coral)] rounded-full flex items-center justify-center shadow-lg">
                <Sun className="w-6 h-6 text-white" />
              </div>
            </div>

            <div className="text-center">
              <p className="text-2xl md:text-3xl font-serif text-gray-700 italic leading-relaxed mb-6">
                "The love between a mother and her children knows no bounds.
                Kalin and Joey brought endless sunshine to Rena' life, and
                together they created a lifetime of beautiful memories under the
                Florida sun."
              </p>

              <div className="flex items-center justify-center gap-4 text-[var(--sunset-orange)]">
                <Heart className="w-5 h-5 fill-current" />
                <span className="font-serif text-lg">Forever Family</span>
                <Heart className="w-5 h-5 fill-current" />
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
              Family and friends can upload photos to fill these frames with
              cherished memories
            </p>
          </div>
        </motion.div>
      </div>
    </section>;
}