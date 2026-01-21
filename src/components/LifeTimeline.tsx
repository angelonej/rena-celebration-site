import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
const lifeEvents = [{
  year: '1966',
  title: 'A Star is Born',
  description: 'Born in Naugatuck, Connecticut, where her journey began with love and laughter.',
  color: 'var(--sunset-pink)'
}, {
  year: '1966-1977',
  title: 'Naugatuck Childhood',
  description: 'Growing up in Connecticut, surrounded by family, friends, and the beauty of New England.',
  color: 'var(--nature-green)'
}, {
  year: '1977',
  title: 'Florida Calling',
  description: 'The family moved to Fort Lauderdale, where sun and water would forever capture her heart.',
  color: 'var(--sunset-gold)'
}, {
  year: '1977-1982',
  title: 'Florida Keys High School',
  description: 'Attended Florida Keys High School, making lifelong friends and discovering her love for coastal life.',
  color: 'var(--sunset-orange)'
}, {
  year: '1989',
  title: 'High School Sweetheart',
  description: 'Married Steve Young, her first love and high school sweetheart, beginning a beautiful journey together.',
  color: 'var(--heart-pink)'
}, {
  year: '1990s',
  title: 'Keys Paradise',
  description: 'Made the Florida Keys her home, where sun and water filled her heart and sunsets became her daily inspiration.',
  color: 'var(--sunset-coral)'
}, {
  year: '1995',
  title: 'Furry Family',
  description: 'Welcomed her first rescue dog, beginning a lifelong passion for animal welfare and compassion.',
  color: 'var(--wildflower-purple)'
}, {
  year: '1999',
  title: 'New Chapter in Naples',
  description: 'Moved to Naples, Florida, embracing a new chapter filled with sunshine, community, and continued adventures.',
  color: 'var(--sunset-gold)'
}, {
  year: '2000s',
  title: 'Classic Car Enthusiast',
  description: 'Restored vintage cars, combining her love of craftsmanship, adventure, and the open road.',
  color: 'var(--sunset-coral)'
}, {
  year: '2010s',
  title: 'Outdoor Adventures',
  description: "Embraced the beauty of nature with beach walks, scenic drives, and exploring Florida's natural wonders.",
  color: 'var(--nature-green)'
}, {
  year: '2024',
  title: 'Forever in Our Hearts',
  description: 'Her spirit lives on in every sunset, every wagging tail, and every act of kindness she inspired.',
  color: 'var(--sunset-gold)'
}];
export function LifeTimeline() {
  return <section id="timeline" className="py-20 px-4 max-w-5xl mx-auto">
      <motion.div initial={{
      opacity: 0,
      y: 30
    }} whileInView={{
      opacity: 1,
      y: 0
    }} viewport={{
      once: true
    }} className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl script-font text-[var(--sunset-orange)] mb-4">
          A Life Well Lived
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-[var(--sunset-orange)] to-[var(--sunset-pink)] mx-auto rounded-full" />
      </motion.div>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[var(--sunset-orange)] via-[var(--sunset-pink)] to-[var(--sunset-gold)]" />

        {/* Timeline Events */}
        <div className="space-y-12">
          {lifeEvents.map((event, index) => <motion.div key={event.year} initial={{
          opacity: 0,
          x: index % 2 === 0 ? -50 : 50
        }} whileInView={{
          opacity: 1,
          x: 0
        }} viewport={{
          once: true
        }} transition={{
          delay: index * 0.1
        }} className={`relative flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} flex-row`}>
              {/* Year Badge */}
              <div className="absolute left-8 md:left-1/2 -translate-x-1/2 z-10">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-serif font-bold shadow-lg text-xs leading-tight px-2" style={{
              backgroundColor: event.color
            }}>
                  {event.year}
                </div>
              </div>

              {/* Content Card */}
              <div className={`ml-24 md:ml-0 ${index % 2 === 0 ? 'md:mr-auto md:pr-16' : 'md:ml-auto md:pl-16'} md:w-5/12`}>
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-shadow">
                  <h3 className="text-2xl script-font mb-2" style={{
                color: event.color
              }}>
                    {event.title}
                  </h3>
                  <p className="text-gray-600 font-serif leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </div>
            </motion.div>)}
        </div>

        {/* Heart at the end */}
        <motion.div initial={{
        opacity: 0,
        scale: 0
      }} whileInView={{
        opacity: 1,
        scale: 1
      }} viewport={{
        once: true
      }} className="relative mt-12 flex justify-center">
          <div className="w-16 h-16 bg-[var(--heart-pink)] rounded-full flex items-center justify-center shadow-lg">
            <Heart className="w-8 h-8 text-white fill-current" />
          </div>
        </motion.div>
      </div>
    </section>;
}