import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Navigation, Truck } from 'lucide-react';
export function ServiceDetails() {
  const serviceInfo = {
    date: 'Friday, February 13th, 2026',
    time: '5:30 PM - 7:30 PM',
    venue: 'Phelps Motor Sports Showroom',
    address: '2255 Linwood Ave',
    city: 'Naples, FL',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=2255+Linwood+Ave+Naples+FL'
  };
  return <section id="service" className="py-20 px-4 relative bg-gradient-to-b from-transparent to-[var(--sunset-pink)]/10">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{
        opacity: 0,
        y: 30
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl script-font text-[var(--sunset-orange)] mb-4">
            Celebration of Life
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[var(--sunset-orange)] to-[var(--sunset-pink)] mx-auto rounded-full" />
        </motion.div>

        <motion.div initial={{
        opacity: 0,
        y: 40
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} className="relative">
          {/* Main Card */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border-2 border-white/50">
            {/* Header with Icon */}
            <div className="bg-gradient-to-r from-[var(--sunset-orange)] to-[var(--sunset-coral)] p-8 text-white text-center relative overflow-hidden">
              <motion.div animate={{
              rotate: [0, 5, -5, 0],
              scale: [1, 1.05, 1]
            }} transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut'
            }} className="inline-block mb-4">
                <Truck className="w-16 h-16" />
              </motion.div>
              <h3 className="text-3xl md:text-4xl script-font mb-2">
                Join Us in Celebrating Rena'
              </h3>
              <p className="text-lg font-serif opacity-90">
                A gathering of love, memories, and shared stories
              </p>

              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
            </div>

            {/* Details Grid */}
            <div className="p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Date */}
                <motion.div initial={{
                opacity: 0,
                x: -20
              }} whileInView={{
                opacity: 1,
                x: 0
              }} viewport={{
                once: true
              }} transition={{
                delay: 0.1
              }} className="flex items-start gap-4">
                  <div className="p-4 bg-[var(--sunset-orange)]/10 rounded-full flex-shrink-0">
                    <Calendar className="w-6 h-6 text-[var(--sunset-orange)]" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-gray-800 mb-1">
                      Date
                    </h4>
                    <p className="text-gray-600 font-serif text-lg">
                      {serviceInfo.date}
                    </p>
                  </div>
                </motion.div>

                {/* Time */}
                <motion.div initial={{
                opacity: 0,
                x: 20
              }} whileInView={{
                opacity: 1,
                x: 0
              }} viewport={{
                once: true
              }} transition={{
                delay: 0.2
              }} className="flex items-start gap-4">
                  <div className="p-4 bg-[var(--wildflower-purple)]/10 rounded-full flex-shrink-0">
                    <Clock className="w-6 h-6 text-[var(--wildflower-purple)]" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-gray-800 mb-1">
                      Time
                    </h4>
                    <p className="text-gray-600 font-serif text-lg">
                      {serviceInfo.time}
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Location */}
              <motion.div initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              delay: 0.3
            }} className="p-6 bg-gradient-to-br from-[var(--sunset-pink)]/10 to-[var(--sunset-gold)]/10 rounded-2xl border border-[var(--sunset-orange)]/20 mb-8">
                <div className="flex items-start gap-4">
                  <div className="p-4 bg-white rounded-full shadow-md flex-shrink-0">
                    <MapPin className="w-6 h-6 text-[var(--sunset-orange)]" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-serif font-bold text-gray-800 mb-2 text-lg">
                      Location
                    </h4>
                    <p className="text-xl font-serif text-[var(--sunset-orange)] font-bold mb-1">
                      {serviceInfo.venue}
                    </p>
                    <p className="text-gray-600 font-serif mb-1">
                      {serviceInfo.address}
                    </p>
                    <p className="text-gray-600 font-serif mb-4">
                      {serviceInfo.city}
                    </p>

                    <div className="flex items-center gap-2 text-sm text-gray-500 font-serif mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <Truck className="w-5 h-5 text-[var(--sunset-orange)]" />
                      <span>
                        A fitting tribute at a motor sports showroom -
                        celebrating Rena' love for cars and adventure
                      </span>
                    </div>

                    <a href={serviceInfo.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--sunset-orange)] text-white rounded-full hover:shadow-lg transition-all font-serif group">
                      <Navigation className="w-5 h-5" />
                      Get Directions
                      <span className="group-hover:translate-x-1 transition-transform">
                        →
                      </span>
                    </a>
                  </div>
                </div>
              </motion.div>

              {/* Additional Info */}
              <motion.div initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              delay: 0.4
            }} className="space-y-4">
                <div className="p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50">
                  <h4 className="font-serif font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <span className="text-[var(--sunset-orange)]">•</span>
                    What to Expect
                  </h4>
                  <p className="text-gray-600 font-serif leading-relaxed">
                    Join us for an evening of remembrance, celebration, and
                    shared stories. This is a time to honor Rena' vibrant
                    spirit, her love for life, and the countless memories she
                    created with all of us. The venue reflects her passion for
                    classic cars and the open road - a perfect setting to
                    celebrate her adventurous soul.
                  </p>
                </div>

                <div className="p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50">
                  <h4 className="font-serif font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <span className="text-[var(--sunset-orange)]">•</span>
                    Share Your Memories
                  </h4>
                  <p className="text-gray-600 font-serif leading-relaxed mb-4">
                    We invite you to share your favorite photos, stories, and
                    memories of Rena'. Whether it's a beach day, a car show, a
                    dinner at Good Times Diner, or just a quiet moment together
                    - every memory is precious.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button onClick={() => window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                  })} className="px-4 py-2 bg-[var(--wildflower-purple)] text-white rounded-full hover:shadow-lg transition-all font-serif text-sm">
                      Upload Photos
                    </button>
                    <button onClick={() => document.getElementById('guestbook')?.scrollIntoView({
                    behavior: 'smooth'
                  })} className="px-4 py-2 bg-[var(--sunset-coral)] text-white rounded-full hover:shadow-lg transition-all font-serif text-sm">
                      Leave a Message
                    </button>
                  </div>
                </div>

                <div className="p-6 bg-gradient-to-r from-[var(--sunset-orange)]/5 to-[var(--sunset-pink)]/5 rounded-xl border border-[var(--sunset-orange)]/20">
                  <h4 className="font-serif font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <span className="text-[var(--sunset-orange)]">•</span>
                    Questions?
                  </h4>
                  <p className="text-gray-600 font-serif leading-relaxed mb-3">
                    Please feel free to reach out to the family with any
                    questions or if you'd like to share memories.
                  </p>
                  <p className="text-sm text-gray-500 font-serif italic">
                    "Please pass along to anyone you see fit" - Kalin
                  </p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-[var(--sunset-gold)] rounded-full opacity-20 blur-2xl" />
          <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-[var(--sunset-pink)] rounded-full opacity-20 blur-2xl" />
        </motion.div>

        {/* Call to Action */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} className="text-center mt-12">
          <p className="text-lg font-serif text-gray-600 mb-6 max-w-2xl mx-auto leading-relaxed">
            Let's come together to celebrate a life well-lived, filled with
            love, laughter, and the joy of the open road.
          </p>
          <div className="flex items-center justify-center gap-3 text-[var(--sunset-orange)]">
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-[var(--sunset-orange)]" />
            <span className="text-2xl script-font">With Love, Always</span>
            <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-[var(--sunset-orange)]" />
          </div>
        </motion.div>
      </div>
    </section>;
}