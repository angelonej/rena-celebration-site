import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { MapPin, ExternalLink, Coffee, Heart, Utensils, Star } from 'lucide-react';
const favoritePlaces = [{
  id: 1,
  name: 'Good Times Diner',
  type: 'Restaurant',
  location: 'Naples, Florida',
  description: 'Her absolute favorite spot - where good food met great memories. The place where smiles were served with every meal.',
  googleMapsUrl: 'https://share.google/NZtllzhTvG1xsSbje',
  imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1920',
  icon: <Utensils className="w-6 h-6" />,
  color: 'var(--sunset-orange)',
  memories: ['Sunday brunches with family', 'Her favorite booth by the window', 'The staff who knew her by name', 'Laughter over coffee and conversation']
}, {
  id: 2,
  name: 'Naples Pier',
  type: 'Landmark',
  location: 'Naples, Florida',
  description: 'Sunset walks and dolphin watching - where the sky painted masterpieces every evening.',
  googleMapsUrl: 'https://maps.google.com/?q=Naples+Pier+FL',
  imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920',
  icon: <Star className="w-6 h-6" />,
  color: 'var(--sunset-gold)',
  memories: ['Golden hour photography', 'Watching pelicans dive', 'Evening strolls with loved ones', 'The sound of waves at sunset']
}, {
  id: 3,
  name: 'Local Coffee Spot',
  type: 'Café',
  location: 'Naples, Florida',
  description: 'Morning rituals and friendly faces - where every day started with warmth and a smile.',
  googleMapsUrl: 'https://maps.google.com/?q=Naples+FL+coffee',
  imageUrl: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=1920',
  icon: <Coffee className="w-6 h-6" />,
  color: 'var(--wildflower-purple)',
  memories: ['Her usual order', 'Morning conversations', 'Reading the paper', 'Community connections']
}];
export function FavoritePlaces() {
  return <section id="favorite-places" className="py-20 px-4 relative">
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
            <MapPin className="w-16 h-16 text-[var(--sunset-orange)]" />
          </motion.div>

          <h2 className="text-4xl md:text-5xl script-font text-[var(--sunset-orange)] mb-4">
            Her Favorite Places
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[var(--sunset-orange)] to-[var(--sunset-pink)] mx-auto rounded-full mb-6" />
          <p className="text-xl text-gray-600 font-serif max-w-2xl mx-auto leading-relaxed">
            The spots in Naples that held a special place in her heart
          </p>
        </motion.div>

        {/* Featured Place - Good Times Diner */}
        <motion.div initial={{
        opacity: 0,
        y: 40
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} className="mb-12">
          <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-[var(--sunset-gold)]">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Image Side */}
              <div className="relative h-80 md:h-auto">
                <img src={favoritePlaces[0].imageUrl} alt={favoritePlaces[0].name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                {/* Featured Badge */}
                <div className="absolute top-6 left-6">
                  <div className="px-4 py-2 bg-[var(--sunset-orange)] text-white rounded-full font-serif text-sm font-bold shadow-lg flex items-center gap-2">
                    <Heart className="w-4 h-4 fill-current" />
                    Her Favorite
                  </div>
                </div>
              </div>

              {/* Content Side */}
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-[var(--sunset-orange)]/10 rounded-full">
                    {favoritePlaces[0].icon}
                  </div>
                  <div>
                    <h3 className="text-3xl md:text-4xl script-font text-[var(--sunset-orange)]">
                      {favoritePlaces[0].name}
                    </h3>
                    <p className="text-sm font-serif text-gray-500 uppercase tracking-wide">
                      {favoritePlaces[0].type}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-6 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span className="font-serif">
                    {favoritePlaces[0].location}
                  </span>
                </div>

                <p className="text-lg font-serif text-gray-700 leading-relaxed mb-6">
                  {favoritePlaces[0].description}
                </p>

                {/* Memories */}
                <div className="mb-6">
                  <h4 className="font-serif font-bold text-gray-800 mb-3">
                    Cherished Memories:
                  </h4>
                  <ul className="space-y-2">
                    {favoritePlaces[0].memories.map((memory, index) => <motion.li key={index} initial={{
                    opacity: 0,
                    x: -20
                  }} whileInView={{
                    opacity: 1,
                    x: 0
                  }} viewport={{
                    once: true
                  }} transition={{
                    delay: index * 0.1
                  }} className="flex items-center gap-2 text-gray-600 font-serif">
                        <Heart className="w-4 h-4 text-[var(--heart-pink)] fill-current flex-shrink-0" />
                        {memory}
                      </motion.li>)}
                  </ul>
                </div>

                {/* Google Maps Link */}
                <a href={favoritePlaces[0].googleMapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[var(--sunset-orange)] to-[var(--sunset-coral)] text-white rounded-full hover:shadow-lg transition-all font-serif group">
                  <MapPin className="w-5 h-5" />
                  View on Google Maps
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Other Favorite Places */}
        <div className="grid md:grid-cols-2 gap-8">
          {favoritePlaces.slice(1).map((place, index) => <motion.div key={place.id} initial={{
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
              <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-white/50 hover:shadow-2xl transition-all duration-500">
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <img src={place.imageUrl} alt={place.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Icon Badge */}
                  <div className="absolute top-4 right-4">
                    <div className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg" style={{
                  color: place.color
                }}>
                      {place.icon}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl script-font mb-1" style={{
                color: place.color
              }}>
                    {place.name}
                  </h3>
                  <p className="text-xs font-serif text-gray-500 uppercase tracking-wide mb-3">
                    {place.type}
                  </p>

                  <div className="flex items-center gap-2 mb-4 text-gray-600 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span className="font-serif">{place.location}</span>
                  </div>

                  <p className="text-sm font-serif text-gray-600 leading-relaxed mb-4">
                    {place.description}
                  </p>

                  {/* Memories */}
                  <div className="mb-4">
                    <ul className="space-y-1">
                      {place.memories.slice(0, 2).map((memory, idx) => <li key={idx} className="flex items-center gap-2 text-xs text-gray-500 font-serif">
                          <Heart className="w-3 h-3 text-[var(--heart-pink)] fill-current flex-shrink-0" />
                          {memory}
                        </li>)}
                    </ul>
                  </div>

                  {/* Link */}
                  <a href={place.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-serif hover:underline group/link" style={{
                color: place.color
              }}>
                    <MapPin className="w-4 h-4" />
                    View Location
                    <ExternalLink className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            </motion.div>)}
        </div>

        {/* Quote Section */}
        <motion.div initial={{
        opacity: 0,
        y: 30
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} className="mt-16 max-w-3xl mx-auto">
          <div className="relative bg-gradient-to-br from-[var(--sunset-orange)]/10 to-[var(--sunset-pink)]/10 backdrop-blur-sm rounded-2xl p-8 border border-[var(--sunset-orange)]/20">
            <div className="text-center">
              <div className="text-6xl text-[var(--sunset-orange)] mb-4">"</div>
              <p className="text-xl font-serif text-gray-700 italic leading-relaxed">
                These weren't just places on a map - they were the backdrop to
                her daily joy, the settings where memories were made, and the
                spots where her spirit felt most at home.
              </p>
              <div className="flex items-center justify-center gap-3 mt-6">
                <Heart className="w-5 h-5 text-[var(--heart-pink)] fill-current" />
                <span className="font-serif text-gray-600">
                  Naples, Forever Home
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>;
}