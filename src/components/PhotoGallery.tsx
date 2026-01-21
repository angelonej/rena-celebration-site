import React, { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
const photos = [{
  id: 1,
  url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1920',
  title: 'Naugatuck, Connecticut',
  location: 'Where it all began (1966-1977)',
  description: 'Childhood home in New England, where memories were made'
}, {
  id: 2,
  url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920',
  title: 'Connecticut Landscapes',
  location: 'Naugatuck Valley',
  description: 'The rolling hills and peaceful waters of her early years'
}, {
  id: 3,
  url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920',
  title: 'Fort Lauderdale',
  location: 'New beginnings (1977)',
  description: 'Where the family discovered Florida sunshine and coastal living'
}, {
  id: 4,
  url: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=1920',
  title: 'Florida Keys High School Years',
  location: '1977-1982',
  description: 'Making lifelong friends and falling in love with island life'
}, {
  id: 5,
  url: "/1000018221.jpg",
  title: 'The Florida Keys',
  location: 'Home sweet home',
  description: 'The turquoise waters and endless horizons that captured her heart forever'
}, {
  id: 6,
  url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920',
  title: 'Marco Island',
  location: 'Paradise found',
  description: 'Golden beaches and peaceful sunsets'
}, {
  id: 7,
  url: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=1920',
  title: 'Fort Myers Beach',
  location: 'Coastal adventures',
  description: 'Where waves meet memories'
}, {
  id: 8,
  url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920',
  title: 'Hopbrook Dam',
  location: 'Waterbury, Connecticut',
  description: 'Connecticut waters - a connection to home'
}, {
  id: 9,
  url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1920',
  title: 'Lake Waramaug',
  location: 'Connecticut memories',
  description: 'Peaceful waters and cherished moments'
}, {
  id: 10,
  url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920',
  title: 'Naples Sunset',
  location: 'Her final chapter (1999)',
  description: 'Where new adventures began and her spirit soared'
}];
export function PhotoGallery() {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const openLightbox = (index: number) => {
    setSelectedPhoto(index);
  };
  const closeLightbox = () => {
    setSelectedPhoto(null);
  };
  const goToPrevious = () => {
    if (selectedPhoto !== null) {
      setSelectedPhoto((selectedPhoto - 1 + photos.length) % photos.length);
    }
  };
  const goToNext = () => {
    if (selectedPhoto !== null) {
      setSelectedPhoto((selectedPhoto + 1) % photos.length);
    }
  };
  return <section id="photos" className="py-20 px-4 relative">
      <div className="max-w-7xl mx-auto">
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
            Places She Loved
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[var(--sunset-orange)] to-[var(--sunset-pink)] mx-auto rounded-full mb-6" />
          <p className="text-xl text-gray-600 font-serif max-w-2xl mx-auto leading-relaxed">
            From Naugatuck, Connecticut to Fort Lauderdale, the Florida Keys,
            and beyond
          </p>
        </motion.div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo, index) => <motion.div key={photo.id} initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          delay: index * 0.1
        }} onClick={() => openLightbox(index)} className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500">
              {/* Image */}
              <img src={photo.url} alt={photo.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

              {/* Text Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                <div className="flex items-center gap-2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm font-serif">{photo.location}</span>
                </div>
                <h3 className="text-2xl script-font mb-2">{photo.title}</h3>
                <p className="text-sm font-serif opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  {photo.description}
                </p>
              </div>

              {/* Decorative Corner */}
              <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>)}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedPhoto !== null && <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center" onClick={closeLightbox}>
            {/* Close Button */}
            <button onClick={closeLightbox} className="absolute top-6 right-6 p-3 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors z-10">
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Navigation Buttons */}
            <button onClick={e => {
          e.stopPropagation();
          goToPrevious();
        }} className="absolute left-6 p-4 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors z-10">
              <ChevronLeft className="w-8 h-8 text-white" />
            </button>

            <button onClick={e => {
          e.stopPropagation();
          goToNext();
        }} className="absolute right-6 p-4 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors z-10">
              <ChevronRight className="w-8 h-8 text-white" />
            </button>

            {/* Image Container */}
            <motion.div key={selectedPhoto} initial={{
          opacity: 0,
          scale: 0.9
        }} animate={{
          opacity: 1,
          scale: 1
        }} exit={{
          opacity: 0,
          scale: 0.9
        }} transition={{
          duration: 0.3
        }} className="relative max-w-7xl max-h-[90vh] mx-4" onClick={e => e.stopPropagation()}>
              <img src={photos[selectedPhoto].url} alt={photos[selectedPhoto].title} className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl" />

              {/* Caption */}
              <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.2
          }} className="mt-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <MapPin className="w-5 h-5 text-[var(--sunset-orange)]" />
                  <span className="text-white/80 font-serif">
                    {photos[selectedPhoto].location}
                  </span>
                </div>
                <h3 className="text-3xl script-font text-white mb-2">
                  {photos[selectedPhoto].title}
                </h3>
                <p className="text-white/70 font-serif text-lg">
                  {photos[selectedPhoto].description}
                </p>
              </motion.div>
            </motion.div>

            {/* Counter */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white font-serif text-sm">
              {selectedPhoto + 1} / {photos.length}
            </div>
          </motion.div>}
      </AnimatePresence>
    </section>;
}