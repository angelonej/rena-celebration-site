import React, { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle } from 'lucide-react';
// Sample tributes (in a real app, these would come from a backend)
const sampleTributes = [{
  id: 1,
  name: 'Sarah Johnson',
  relationship: 'Childhood Friend',
  memory: 'Rena had the most infectious laugh. I remember our road trips through the Keys, windows down, singing "Love Will Keep Us Together" at the top of our lungs. She taught me that joy is a choice we make every day.',
  date: 'January 15, 2024'
}, {
  id: 2,
  name: 'Michael Torres',
  relationship: 'Hiking Buddy',
  memory: 'Every trail we hiked together, Rena would stop to admire the wildflowers. She said they reminded her that beauty grows even in the toughest conditions. That was Rena - finding light everywhere.',
  date: 'January 14, 2024'
}, {
  id: 3,
  name: 'Linda Martinez',
  relationship: 'Neighbor',
  memory: 'Rena rescued three of my dogs over the years. Her compassion knew no bounds. She would say, "They don\'t need a perfect home, they need a loving one." She lived that truth every day.',
  date: 'January 13, 2024'
}];
export function Guestbook() {
  const [tributes] = useState(sampleTributes);
  return <section id="guestbook" className="py-20 px-4 max-w-6xl mx-auto">
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
          Memories & Tributes
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-[var(--sunset-orange)] to-[var(--sunset-pink)] mx-auto rounded-full mb-6" />
        <p className="text-gray-600 font-serif text-lg max-w-2xl mx-auto">
          Share your memories and celebrate the beautiful life Rena lived
        </p>
      </motion.div>

      {/* Tributes Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {tributes.map((tribute, index) => <motion.div key={tribute.id} initial={{
        opacity: 0,
        y: 30
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} transition={{
        delay: index * 0.1
      }} className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-shadow">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 bg-[var(--sunset-pink)]/30 rounded-full">
                <MessageCircle className="w-5 h-5 text-[var(--sunset-orange)]" />
              </div>
              <div className="flex-1">
                <h3 className="font-serif text-lg text-gray-800">
                  {tribute.name}
                </h3>
                <p className="text-sm text-gray-500 font-serif">
                  {tribute.relationship}
                </p>
              </div>
            </div>
            <p className="text-gray-600 font-serif leading-relaxed mb-4">
              "{tribute.memory}"
            </p>
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <span className="text-xs text-gray-400 font-serif">
                {tribute.date}
              </span>
              <Heart className="w-4 h-4 text-[var(--heart-pink)]" />
            </div>
          </motion.div>)}
      </div>

      {/* Call to Action */}
      <motion.div initial={{
      opacity: 0,
      y: 20
    }} whileInView={{
      opacity: 1,
      y: 0
    }} viewport={{
      once: true
    }} className="text-center">
        <p className="text-gray-600 font-serif mb-4">
          Have a memory to share? Your words bring comfort and celebrate Rena's
          legacy.
        </p>
        <div className="inline-flex items-center gap-2 text-[var(--sunset-orange)] font-serif">
          <Heart className="w-5 h-5 fill-current" />
          <span>Click "Share Memory" in the toolbar above</span>
        </div>
      </motion.div>
    </section>;
}