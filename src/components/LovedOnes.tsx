import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, Camera, Sparkles, Star } from 'lucide-react';
const familyMembers = [{
  id: 1,
  name: 'Steve Young',
  relationship: 'Husband & High School Sweetheart',
  description: 'Her first love and life partner, sharing decades of adventures, laughter, and unwavering devotion.',
  imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1920',
  color: 'var(--sunset-orange)'
}, {
  id: 2,
  name: 'Kalin',
  relationship: 'Stepdaughter',
  description: 'Her beloved daughter who brought joy, sunshine, and countless beautiful memories to her life.',
  imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1920',
  color: 'var(--wildflower-purple)'
}, {
  id: 3,
  name: 'Joey',
  relationship: 'Stepson',
  description: 'Her cherished son who filled her days with laughter, love, and unforgettable moments.',
  imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920',
  color: 'var(--sunset-gold)'
}];
const friendCircles = [{
  id: 1,
  title: 'Naples Community',
  description: 'The friends who became family in her Florida home',
  icon: <Users className="w-8 h-8" />,
  color: 'var(--sunset-orange)'
}, {
  id: 2,
  title: 'Classic Car Enthusiasts',
  description: 'Sharing the passion for vintage rides and open roads',
  icon: <Star className="w-8 h-8" />,
  color: 'var(--sunset-gold)'
}, {
  id: 3,
  title: 'Good Times Crew',
  description: 'The regulars at her favorite diner, sharing meals and memories',
  icon: <Sparkles className="w-8 h-8" />,
  color: 'var(--wildflower-purple)'
}];
export function LovedOnes() {
  return <section id="loved-ones" className="py-20 px-4 relative bg-gradient-to-b from-[var(--sunset-pink)]/5 via-transparent to-[var(--sunset-gold)]/5">
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
          scale: [1, 1.1, 1]
        }} transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }} className="inline-block mb-6">
            <Heart className="w-16 h-16 text-[var(--sunset-orange)] fill-current" />
          </motion.div>

          <h2 className="text-4xl md:text-5xl script-font text-[var(--sunset-orange)] mb-4">
            Her Circle of Love
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[var(--sunset-orange)] to-[var(--sunset-pink)] mx-auto rounded-full mb-6" />
          <p className="text-xl text-gray-600 font-serif max-w-2xl mx-auto leading-relaxed">
            The family and friends who filled her life with love, laughter, and
            countless cherished memories
          </p>
        </motion.div>

        {/* Family Members - Featured Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {familyMembers.map((person, index) => <motion.div key={person.id} initial={{
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
              {/* Elegant Frame */}
              <div className="relative">
                {/* Outer Glow */}
                <div className="absolute -inset-4 rounded-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500 blur-xl" style={{
              backgroundColor: person.color
            }} />

                {/* Main Card */}
                <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden group-hover:shadow-3xl transition-all duration-500">
                  {/* Photo Frame */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
                    {/* Upload Placeholder */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[var(--sunset-pink)]/10 to-[var(--sunset-gold)]/10 z-10">
                      <Camera className="w-16 h-16 text-gray-300 mb-3" />
                      <p className="text-sm font-serif text-gray-400 text-center px-4">
                        Add {person.name}'s Photo
                      </p>
                    </div>

                    {/* Background Image (placeholder) */}
                    <img src={person.imageUrl} alt={person.name} className="w-full h-full object-cover opacity-30" />

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

                    {/* Decorative Corner */}
                    <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 rounded-tr-xl opacity-50" style={{
                  borderColor: person.color
                }} />
                  </div>

                  {/* Info Section */}
                  <div className="p-6 text-center">
                    <h3 className="text-2xl script-font mb-2" style={{
                  color: person.color
                }}>
                      {person.name}
                    </h3>
                    <p className="text-sm font-serif uppercase tracking-wide mb-3" style={{
                  color: person.color
                }}>
                      {person.relationship}
                    </p>
                    <p className="text-sm font-serif text-gray-600 leading-relaxed">
                      {person.description}
                    </p>
                  </div>

                  {/* Bottom Border Accent */}
                  <div className="h-1 w-full" style={{
                backgroundColor: person.color
              }} />
                </div>
              </div>
            </motion.div>)}
        </div>

        {/* Extended Family & Friends Grid */}
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
              Extended Family & Dear Friends
            </h3>

            {/* Photo Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
              {[...Array(12)].map((_, index) => <motion.div key={index} initial={{
              opacity: 0,
              scale: 0.9
            }} whileInView={{
              opacity: 1,
              scale: 1
            }} viewport={{
              once: true
            }} transition={{
              delay: index * 0.05
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
                      <Camera className="w-6 h-6 mx-auto mb-1" />
                      <p className="text-xs font-serif">Add Photo</p>
                    </div>
                  </motion.div>
                </motion.div>)}
            </div>

            <p className="text-center text-sm font-serif text-gray-500">
              Siblings, cousins, lifelong friends, and all the beautiful souls
              who enriched her journey
            </p>
          </div>
        </motion.div>

        {/* Friend Circles */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {friendCircles.map((circle, index) => <motion.div key={circle.id} initial={{
          opacity: 0,
          y: 40
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          delay: index * 0.15
        }} className="group">
              <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{
              backgroundColor: `${circle.color}20`
            }}>
                  <div style={{
                color: circle.color
              }}>
                    {circle.icon}
                  </div>
                </div>

                <h3 className="text-2xl script-font mb-3" style={{
              color: circle.color
            }}>
                  {circle.title}
                </h3>

                <p className="text-sm font-serif text-gray-600 leading-relaxed">
                  {circle.description}
                </p>

                {/* Decorative Line */}
                <div className="w-12 h-1 mx-auto mt-4 rounded-full" style={{
              backgroundColor: circle.color
            }} />
              </div>
            </motion.div>)}
        </div>

        {/* Heartfelt Message */}
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
                Family isn't just about blood—it's about the people who stand by
                you, laugh with you, and love you unconditionally. Rena built a
                beautiful family of both blood and choice, creating a circle of
                love that will endure forever.
              </p>

              <div className="flex items-center justify-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-[var(--heart-pink)] fill-current" />
                  <span className="font-serif text-gray-600">Loved Deeply</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-[var(--sunset-orange)]" />
                  <span className="font-serif text-gray-600">
                    Cherished Always
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[var(--wildflower-purple)]" />
                  <span className="font-serif text-gray-600">
                    Forever Connected
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Upload Call to Action */}
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
              Share photos of Rena with family and friends to celebrate the love
              and connections that defined her life
            </p>
          </div>
        </motion.div>
      </div>
    </section>;
}