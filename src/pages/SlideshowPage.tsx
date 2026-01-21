import React, { useEffect, useState, memo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { SlideshowPlayer } from '../components/SlideshowPlayer';
import { ArrowLeft, Play, Download, Settings, BarChart } from 'lucide-react';
import { compileMasterSlideshow, exportSlideshowConfig, getSlideshowStats, type SlideshowConfig } from '../utils/slideshowCompiler';
export function SlideshowPage() {
  const navigate = useNavigate();
  const [isReady, setIsReady] = useState(false);
  const [slideshow, setSlideshow] = useState<SlideshowConfig | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<'classic' | 'modern' | 'cinematic' | 'collage'>('classic');
  const [showStats, setShowStats] = useState(false);
  useEffect(() => {
    // Compile slideshow on mount
    const compiled = compileMasterSlideshow(selectedTemplate);
    setSlideshow(compiled);
  }, [selectedTemplate]);
  const handleTemplateChange = (template: 'classic' | 'modern' | 'cinematic' | 'collage') => {
    setSelectedTemplate(template);
    const compiled = compileMasterSlideshow(template);
    setSlideshow(compiled);
  };
  const handleExport = () => {
    if (slideshow) {
      exportSlideshowConfig(slideshow);
    }
  };
  const stats = slideshow ? getSlideshowStats(slideshow) : null;
  if (!isReady && slideshow) {
    return <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <motion.div initial={{
        opacity: 0,
        scale: 0.9
      }} animate={{
        opacity: 1,
        scale: 1
      }} className="text-center max-w-3xl px-4">
          <motion.div animate={{
          rotate: 360
        }} transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear'
        }} className="inline-block mb-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[var(--sunset-orange)] to-[var(--sunset-gold)] flex items-center justify-center">
              <Play className="w-12 h-12 text-white" />
            </div>
          </motion.div>

          <h1 className="text-5xl script-font text-white mb-6">
            Rena's Memorial Slideshow
          </h1>
          <p className="text-xl text-gray-300 font-serif mb-8 leading-relaxed">
            A beautiful tribute celebrating the life, love, and legacy of Rena
            Michele Voghel
          </p>

          {/* Template Selector */}
          <div className="mb-8 p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
            <h3 className="text-lg font-serif text-white mb-4">
              Choose Presentation Style
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(['classic', 'modern', 'cinematic', 'collage'] as const).map(template => <button key={template} onClick={() => handleTemplateChange(template)} className={`px-4 py-3 rounded-lg font-serif text-sm transition-all capitalize ${selectedTemplate === template ? 'bg-[var(--sunset-orange)] text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}>
                    {template}
                  </button>)}
            </div>
          </div>

          {/* Stats Preview */}
          {stats && <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} className="mb-8 p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-[var(--sunset-orange)]">
                    {stats.totalSlides}
                  </div>
                  <div className="text-xs text-gray-400 font-serif">
                    Total Slides
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[var(--wildflower-purple)]">
                    {stats.breakdown.photos}
                  </div>
                  <div className="text-xs text-gray-400 font-serif">Photos</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[var(--nature-green)]">
                    {stats.breakdown.tributes}
                  </div>
                  <div className="text-xs text-gray-400 font-serif">
                    Tributes
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[var(--sunset-coral)]">
                    {stats.contributors}
                  </div>
                  <div className="text-xs text-gray-400 font-serif">
                    Contributors
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[var(--sunset-gold)]">
                    {stats.durationFormatted}
                  </div>
                  <div className="text-xs text-gray-400 font-serif">
                    Duration
                  </div>
                </div>
              </div>
            </motion.div>}

          <div className="space-y-4">
            <button onClick={() => setIsReady(true)} className="w-full px-8 py-4 bg-gradient-to-r from-[var(--sunset-orange)] to-[var(--sunset-coral)] text-white rounded-xl hover:shadow-2xl transition-all font-serif text-lg flex items-center justify-center gap-3">
              <Play className="w-6 h-6" />
              Start Slideshow
            </button>

            <div className="grid grid-cols-2 gap-4">
              <button onClick={handleExport} className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-all font-serif flex items-center justify-center gap-2">
                <Download className="w-5 h-5" />
                Export Config
              </button>
              <button onClick={() => navigate('/')} className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-all font-serif flex items-center justify-center gap-2">
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <p className="text-sm text-blue-300 font-serif">
              <strong>Master Slideshow:</strong> This presentation aggregates
              all uploaded photos, videos, tributes, and timeline events into
              one beautiful memorial.
            </p>
          </div>
        </motion.div>
      </div>;
  }
  if (!slideshow) {
    return <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white font-serif">Loading slideshow...</div>
      </div>;
  }
  // Convert slideshow config to player format
  const playerMedia = slideshow.slides.map(slide => ({
    id: slide.id,
    type: slide.type === 'image' || slide.type === 'video' ? slide.type : 'image',
    url: slide.content,
    caption: slide.caption || ''
  }));
  return <SlideshowPlayer media={playerMedia} autoPlay={true} />;
}