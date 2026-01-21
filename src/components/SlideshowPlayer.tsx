import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, Maximize, Volume2, VolumeX, Download, X } from 'lucide-react';
interface MediaItem {
  id: string;
  type: 'image' | 'video' | 'text' | 'tribute' | 'timeline' | 'title';
  url: string;
  caption: string;
}
interface SlideshowPlayerProps {
  media: MediaItem[];
  autoPlay?: boolean;
}
export function SlideshowPlayer({
  media,
  autoPlay = true
}: SlideshowPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();
  const currentMedia = media[currentIndex];
  useEffect(() => {
    if (isPlaying && currentMedia?.type === 'image') {
      const timer = setTimeout(() => {
        goToNext();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, isPlaying, currentMedia]);
  useEffect(() => {
    if (showControls) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [showControls]);
  const goToNext = () => {
    setCurrentIndex(prev => (prev + 1) % media.length);
  };
  const goToPrevious = () => {
    setCurrentIndex(prev => (prev - 1 + media.length) % media.length);
  };
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };
  const handleExit = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    window.history.back();
  };
  const renderSlideContent = () => {
    if (!currentMedia) return null;
    switch (currentMedia.type) {
      case 'title':
        return <div className="flex flex-col items-center justify-center h-full text-center px-8">
            <motion.h1 initial={{
            opacity: 0,
            scale: 0.9
          }} animate={{
            opacity: 1,
            scale: 1
          }} transition={{
            duration: 1
          }} className="text-6xl md:text-8xl script-font text-white mb-6 drop-shadow-2xl">
              {currentMedia.url}
            </motion.h1>
            <motion.p initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.5,
            duration: 1
          }} className="text-2xl md:text-3xl font-serif text-white/90 italic">
              {currentMedia.caption}
            </motion.p>
          </div>;
      case 'timeline':
        return <div className="flex flex-col items-center justify-center h-full text-center px-8">
            <motion.div initial={{
            opacity: 0,
            scale: 0
          }} animate={{
            opacity: 1,
            scale: 1
          }} transition={{
            duration: 0.8
          }} className="w-32 h-32 rounded-full bg-[var(--sunset-orange)] flex items-center justify-center mb-8">
              <span className="text-4xl font-bold text-white">
                {currentMedia.url}
              </span>
            </motion.div>
            <motion.div initial={{
            opacity: 0,
            y: 30
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.5,
            duration: 1
          }} className="max-w-2xl">
              <p className="text-3xl md:text-4xl font-serif text-white whitespace-pre-line leading-relaxed">
                {currentMedia.caption}
              </p>
            </motion.div>
          </div>;
      case 'tribute':
        return <div className="flex flex-col items-center justify-center h-full text-center px-8">
            <motion.div initial={{
            opacity: 0,
            y: 30
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 1
          }} className="max-w-3xl">
              <div className="text-6xl text-[var(--sunset-orange)] mb-8">"</div>
              <p className="text-2xl md:text-3xl font-serif text-white italic leading-relaxed mb-8">
                {currentMedia.url}
              </p>
              <p className="text-xl text-white/80 font-serif">
                {currentMedia.caption}
              </p>
            </motion.div>
          </div>;
      case 'text':
        return <div className="flex flex-col items-center justify-center h-full text-center px-8">
            <motion.div initial={{
            opacity: 0,
            scale: 0.9
          }} animate={{
            opacity: 1,
            scale: 1
          }} transition={{
            duration: 1
          }} className="max-w-3xl">
              <h2 className="text-5xl md:text-6xl script-font text-white mb-6">
                {currentMedia.url}
              </h2>
              <p className="text-xl md:text-2xl font-serif text-white/90 whitespace-pre-line leading-relaxed">
                {currentMedia.caption}
              </p>
            </motion.div>
          </div>;
      case 'image':
        return <motion.img src={currentMedia.url} alt={currentMedia.caption} className="max-w-full max-h-full object-contain" initial={{
          opacity: 0,
          scale: 1
        }} animate={{
          opacity: 1,
          scale: [1, 1.05, 1]
        }} transition={{
          opacity: {
            duration: 1
          },
          scale: {
            duration: 5,
            ease: 'easeInOut'
          }
        }} />;
      case 'video':
        return <video src={currentMedia.url} className="max-w-full max-h-full object-contain" autoPlay onEnded={goToNext} />;
      default:
        return null;
    }
  };
  return <div className="relative w-full h-screen bg-black overflow-hidden" onMouseMove={() => setShowControls(true)}>
      {/* Background Music */}
      <audio ref={audioRef} src="/love-will-keep-us-together.mp3" loop autoPlay={isPlaying} muted={isMuted} />

      {/* Media Display */}
      <AnimatePresence mode="wait">
        <motion.div key={currentIndex} initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} transition={{
        duration: 1,
        ease: 'easeInOut'
      }} className="absolute inset-0 flex items-center justify-center">
          {renderSlideContent()}

          {/* Caption for image/video slides */}
          {(currentMedia?.type === 'image' || currentMedia?.type === 'video') && currentMedia.caption && <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.5
        }} className="absolute bottom-24 left-0 right-0 text-center px-4">
                <p className="text-white text-xl md:text-2xl font-serif drop-shadow-lg max-w-3xl mx-auto bg-black/40 backdrop-blur-sm py-3 px-6 rounded-lg">
                  {currentMedia.caption}
                </p>
              </motion.div>}
        </motion.div>
      </AnimatePresence>

      {/* Controls Overlay */}
      <AnimatePresence>
        {showControls && <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/60 pointer-events-none">
            {/* Top Bar */}
            <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between pointer-events-auto">
              <div className="text-white font-serif">
                <h2 className="text-2xl script-font">
                  Rena's Life in Pictures
                </h2>
                <p className="text-sm opacity-80">
                  {currentIndex + 1} / {media.length}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={toggleMute} className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
                  {isMuted ? <VolumeX className="w-5 h-5 text-white" /> : <Volume2 className="w-5 h-5 text-white" />}
                </button>
                <button onClick={toggleFullscreen} className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
                  <Maximize className="w-5 h-5 text-white" />
                </button>
                <button onClick={handleExit} className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-6 pointer-events-auto">
              {/* Progress Bar */}
              <div className="mb-4 h-1 bg-white/20 rounded-full overflow-hidden">
                <motion.div className="h-full bg-white" initial={{
              width: '0%'
            }} animate={{
              width: `${(currentIndex + 1) / media.length * 100}%`
            }} transition={{
              duration: 0.3
            }} />
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-center gap-4">
                <button onClick={goToPrevious} className="p-4 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
                  <SkipBack className="w-6 h-6 text-white" />
                </button>
                <button onClick={togglePlay} className="p-6 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
                  {isPlaying ? <Pause className="w-8 h-8 text-white" /> : <Play className="w-8 h-8 text-white" />}
                </button>
                <button onClick={goToNext} className="p-4 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
                  <SkipForward className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>
          </motion.div>}
      </AnimatePresence>

      {/* Watermark */}
      <div className="absolute bottom-6 right-6 text-white/50 text-sm font-serif pointer-events-none">
        In Loving Memory of Rena Michele Voghel
      </div>
    </div>;
}