import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Users, Truck, Coffee, Heart, Sparkles, Camera } from 'lucide-react';
const friendshipMoments = [{
  id: 1,
  title: 'Naples Friends',
  subtitle: 'Her Chosen Family',
  description: 'The friends who became family - sharing laughter, adventures, and countless memories under the Florida sun.',
  imageUrl: "/1000003704.jpg",
  color: 'var(--sunset-orange)',
  icon: <Users className="w-6 h-6" />
}, {
  id: 2,
  title: 'Good Times & Great Company',
  subtitle: 'Living Life to the Fullest',
  description: 'From classic car shows to backyard BBQs, every gathering was a celebration of friendship and joy.',
  imageUrl: "/1000017637.jpg",
  color: 'var(--wildflower-purple)',
  icon: <Coffee className="w-6 h-6" />
}];
const passions = [{
  id: 1,
  title: 'Her F250 4x4',
  description: 'Her pride and joy in the driveway - ready for any adventure, from beach trips to mountain roads.',
  imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1920',
  icon: <Truck className="w-8 h-8" />,
  color: 'var(--sunset-orange)'
}, {
  id: 2,
  title: 'Classic Car Community',
  description: 'Sharing her passion with friends who understood the beauty of vintage chrome and the roar of a classic engine.',
  imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1920',
  icon: <Sparkles className="w-8 h-8" />,
  color: 'var(--sunset-gold)'
}, {
  id: 3,
  title: 'Good Food & Great Conversations',
  description: 'From Good Times Diner to backyard gatherings, food was always better when shared with friends.',
  imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1920',
  icon: <Coffee className="w-8 h-8" />,
  color: 'var(--wildflower-purple)'
}];
export function FriendsAndPassions() {
  return <section id="friends-passions" className="py-20 px-4 relative bg-gradient-to-b from-transparent via-[var(--sunset-gold)]/5 to-transparent">
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
            <Users className="w-16 h-16 text-[var(--sunset-orange)]" />
          </motion.div>

          <h2 className="text-4xl md:text-5xl script-font text-[var(--sunset-orange)] mb-4">
            Friends, Food & Freedom
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[var(--sunset-orange)] to-[var(--sunset-pink)] mx-auto rounded-full mb-6" />
          <p className="text-xl text-gray-600 font-serif max-w-2xl mx-auto leading-relaxed">
            Her Naples community, classic car passion, and the simple joy of
            good times with great people
          </p>
        </motion.div>

        {/* Featured Friendship Photos */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {friendshipMoments.map((moment, index) => <motion.div key={moment.id} initial={{
          opacity: 0,
          y: 40
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          delay: index * 0.2
        }} className="group">
              <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-white/50 hover:shadow-3xl transition-all duration-500">
                {/* Photo */}
                <div className="relative h-[500px] overflow-hidden">
                  <img src={moment.imageUrl} alt={moment.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Icon Badge */}
                  <div className="absolute top-6 right-6">
                    <div className="p-4 bg-white/90 backdrop-blur-sm rounded-full shadow-lg" style={{
                  color: moment.color
                }}>
                      {moment.icon}
                    </div>
                  </div>

                  {/* Text Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <h3 className="text-3xl script-font mb-2">
                      {moment.title}
                    </h3>
                    <p className="text-sm font-serif uppercase tracking-wide mb-3 opacity-90">
                      {moment.subtitle}
                    </p>
                    <p className="text-base font-serif leading-relaxed">
                      {moment.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>)}
        </div>

        {/* Additional Friend Photos Grid */}
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
              Memories with Friends
            </h3>

            {/* Photo Upload Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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
                      <p className="text-xs font-serif">Add Photo</p>
                    </div>
                  </motion.div>
                </motion.div>)}
            </div>

            <p className="text-center text-sm font-serif text-gray-500">
              Classic car shows, beach days, dinners, and all the moments that
              made life beautiful
            </p>
          </div>
        </motion.div>

        {/* Passions Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {passions.map((passion, index) => <motion.div key={passion.id} initial={{
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
              <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500">
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <img src={passion.imageUrl} alt={passion.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                  {/* Icon */}
                  <div className="absolute top-4 right-4">
                    <div className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg" style={{
                  color: passion.color
                }}>
                      {passion.icon}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl script-font mb-3" style={{
                color: passion.color
              }}>
                    {passion.title}
                  </h3>
                  <p className="text-sm font-serif text-gray-600 leading-relaxed">
                    {passion.description}
                  </p>
                </div>
              </div>
            </motion.div>)}
        </div>

        {/* F250 Feature Section */}
        <motion.div initial={{
        opacity: 0,
        y: 40
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} className="mb-16">
          <div className="relative bg-gradient-to-br from-[var(--sunset-orange)]/10 to-[var(--sunset-gold)]/10 backdrop-blur-sm rounded-3xl overflow-hidden border border-[var(--sunset-orange)]/20 shadow-xl">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Image Side */}
              <div className="relative h-80 md:h-auto">
                <img src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1920" alt="F250 Truck" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[var(--sunset-orange)]/20" />

                {/* Upload Overlay */}
                <motion.div initial={{
                opacity: 0
              }} whileHover={{
                opacity: 1
              }} className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center cursor-pointer">
                  <div className="text-center text-white">
                    <Camera className="w-16 h-16 mx-auto mb-3" />
                    <p className="font-serif text-lg">
                      Upload Photo of Her F250
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Content Side */}
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-4 bg-[var(--sunset-orange)]/20 rounded-full">
                    <Truck className="w-8 h-8 text-[var(--sunset-orange)]" />
                  </div>
                  <h3 className="text-3xl md:text-4xl script-font text-[var(--sunset-orange)]">
                    Her F250 4x4
                  </h3>
                </div>

                <p className="text-lg font-serif text-gray-700 leading-relaxed mb-6">
                  Parked proudly in the driveway, her F250 was more than just a
                  truck - it was freedom on four wheels. Whether heading to the
                  beach, the mountains, or just cruising through Naples, it
                  represented her independent spirit and love for adventure.
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-600 font-serif">
                    <Heart className="w-5 h-5 text-[var(--heart-pink)] fill-current flex-shrink-0" />
                    <span>Ready for any adventure</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600 font-serif">
                    <Heart className="w-5 h-5 text-[var(--heart-pink)] fill-current flex-shrink-0" />
                    <span>Symbol of independence</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600 font-serif">
                    <Heart className="w-5 h-5 text-[var(--heart-pink)] fill-current flex-shrink-0" />
                    <span>Part of the classic car community</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quote Section */}
        <motion.div initial={{
        opacity: 0,
        y: 30
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} className="max-w-4xl mx-auto">
          <div className="relative bg-white/60 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl border border-white/50">
            <div className="text-center">
              <div className="text-6xl text-[var(--sunset-orange)] mb-4">"</div>
              <p className="text-2xl md:text-3xl font-serif text-gray-700 italic leading-relaxed mb-6">
                Life is meant to be shared - good food, great friends, open
                roads, and the simple joy of being together. Rena lived this
                truth every single day, creating a community of love wherever
                she went.
              </p>

              <div className="flex items-center justify-center gap-6 flex-wrap">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-[var(--sunset-orange)]" />
                  <span className="font-serif text-gray-600">
                    Naples Family
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-[var(--sunset-gold)]" />
                  <span className="font-serif text-gray-600">
                    Adventure Ready
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-[var(--heart-pink)] fill-current" />
                  <span className="font-serif text-gray-600">Living Fully</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>;
}