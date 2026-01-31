import React, { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { MediaUploader } from '../components/MediaUploader';
import { SlideshowEditor, type SlideItem } from '../components/SlideshowEditor';
import { TemplateSelector, type SlideshowTemplate } from '../components/TemplateSelector';
import { AudioManager } from '../components/AudioManager';
import { listUserFiles, deleteFromS3, saveCaptionsToS3, loadCaptionsFromS3 } from '../utils/s3Upload';
import { ArrowLeft, Play, LogOut, Heart, Image as ImageIcon, Download, Share2, Settings } from 'lucide-react';
interface AudioTrack {
  id: string;
  name: string;
  file: File;
  url: string;
  duration: number;
  volume: number;
}
export function UploadPage() {
  const {
    user,
    logout
  } = useAuth();
  const navigate = useNavigate();
  const [uploadCount, setUploadCount] = useState(0);
  const [slides, setSlides] = useState<SlideItem[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<SlideshowTemplate>('classic');
  const [audioTracks, setAudioTracks] = useState<AudioTrack[]>([]);
  const [activeTab, setActiveTab] = useState<'upload' | 'arrange' | 'template' | 'audio'>('upload');
  const [loadingFiles, setLoadingFiles] = useState(true);

  // Debug: Log whenever slides changes
  useEffect(() => {
    console.log('🎬 SLIDES STATE CHANGED:', slides.length, 'slides');
    slides.forEach((s, i) => console.log(`  ${i+1}. ${s.s3Key || s.id} - Caption: "${s.caption}"`));
    
    // Auto-save slides to slideshow_config for slideshow page
    if (slides.length > 0) {
      const config = {
        slides,
        template: selectedTemplate,
        audioTracks,
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('slideshow_config', JSON.stringify(config));
      console.log('💾 Saved', slides.length, 'slides to slideshow_config with captions');
      
      // Also save captions to S3 as a JSON file
      if (user?.email) {
        const captions: Record<string, string> = {};
        slides.forEach(slide => {
          if (slide.s3Key && slide.caption) {
            captions[slide.s3Key] = slide.caption;
          }
        });
        
        if (Object.keys(captions).length > 0) {
          saveCaptionsToS3(user.email, captions).then(result => {
            if (result.success) {
              console.log('✅ Captions synced to S3');
            } else {
              console.warn('⚠️ Failed to sync captions to S3:', result.error);
            }
          });
        }
      }
    }
  }, [slides, selectedTemplate, audioTracks, user?.email]);

  // Load user's existing files on mount
  useEffect(() => {
    async function loadUserFiles() {
      if (!user?.email) return;
      
      // Clear old localStorage data - S3 is now source of truth
      localStorage.removeItem('memorial_media');
      
      setLoadingFiles(true);
      
      // Load captions from S3
      const captionsResult = await loadCaptionsFromS3(user.email);
      const s3Captions = captionsResult.success && captionsResult.captions ? captionsResult.captions : {};
      
      // Also check localStorage for any newer captions
      const savedConfig = localStorage.getItem('slideshow_config');
      let localCaptions: Record<string, string> = {};
      
      if (savedConfig) {
        try {
          const config = JSON.parse(savedConfig);
          if (config.slides && Array.isArray(config.slides)) {
            config.slides.forEach((slide: any) => {
              if (slide.s3Key && slide.caption) {
                localCaptions[slide.s3Key] = slide.caption;
              }
            });
          }
        } catch (error) {
          console.error('Error parsing slideshow_config:', error);
        }
      }
      
      // Merge captions: localStorage takes precedence over S3
      const allCaptions = { ...s3Captions, ...localCaptions };
      console.log('📝 Loaded captions:', Object.keys(s3Captions).length, 'from S3,', Object.keys(localCaptions).length, 'from localStorage');
      
      const result = await listUserFiles(user.email);
      
      if (result.success && result.files) {
        console.log('📂 Loaded', result.files.length, 'existing files from S3');
        
        // Convert S3 files to slides with captions
        const existingSlides: SlideItem[] = result.files
          .filter(f => f.type === 'image' || f.type === 'video')
          .map(file => ({
            id: file.key,
            type: file.type === 'video' ? 'video' : 'image',
            url: file.url,
            thumbnail: file.url,
            caption: allCaptions[file.key] || '',
            duration: 5,
            transition: 'fade' as const,
            s3Key: file.key // Store S3 key for deletion
          }));
        
        console.log('📊 Setting slides to:', existingSlides.length, 'items');
        setSlides(existingSlides);
        setUploadCount(result.files.length);
        
        if (Object.keys(allCaptions).length > 0) {
          console.log('✅ Loaded', Object.keys(allCaptions).length, 'captions total');
        }
      } else {
        console.log('📂 No files found, starting fresh');
        setSlides([]);
        setUploadCount(0);
      }
      
      setLoadingFiles(false);
    }
    
    loadUserFiles();
  }, [user?.email]);

  const handleUploadComplete = (files: any[]) => {
    console.log('📥 handleUploadComplete received:', files.length, 'files');
    files.forEach(f => {
      console.log('  File:', f.id, 'S3 URL:', f.s3Url, 'Preview:', f.preview, 'S3 Key:', f.s3Key);
    });
    
    setUploadCount(prev => prev + files.length);
    // Convert uploaded files to slides
    const newSlides: SlideItem[] = files.map(file => ({
      id: file.id,
      type: file.type,
      url: file.s3Url || file.preview, // Use S3 URL if available, fallback to preview
      thumbnail: file.s3Url || file.preview,
      caption: file.caption || '',
      duration: 5,
      transition: 'fade' as const,
      s3Key: file.s3Key // Store S3 key for deletion
    }));
    
    console.log('📊 Created slides:', newSlides);
    
    // Remove duplicates - if s3Key already exists, replace it
    setSlides(prev => {
      const filtered = prev.filter(existingSlide => 
        !newSlides.some(newSlide => newSlide.s3Key && newSlide.s3Key === existingSlide.s3Key)
      );
      return [...filtered, ...newSlides];
    });
    // Auto-switch to arrange tab
    setActiveTab('arrange');
  };
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  const handleExportSlideshow = () => {
    // Save slideshow configuration
    const config = {
      slides,
      template: selectedTemplate,
      audioTracks: audioTracks.map(t => ({
        id: t.id,
        name: t.name,
        volume: t.volume
      })),
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('slideshow_config', JSON.stringify(config));
    // In production, this would trigger a backend export job
    alert('Slideshow configuration saved! In production, this would generate a downloadable video file.');
  };
  const tabs = [{
    id: 'upload' as const,
    label: 'Upload Media',
    icon: <ImageIcon className="w-4 h-4" />
  }, {
    id: 'arrange' as const,
    label: 'Arrange Slides',
    icon: <Settings className="w-4 h-4" />,
    badge: slides.length
  }, {
    id: 'template' as const,
    label: 'Choose Template',
    icon: <Play className="w-4 h-4" />
  }, {
    id: 'audio' as const,
    label: 'Add Music',
    icon: <Heart className="w-4 h-4" />,
    badge: audioTracks.length
  }];
  return <div className="min-h-screen bg-gradient-to-br from-[#FFF5EE] via-[var(--sunset-pink)]/20 to-[var(--sunset-gold)]/20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-600 hover:text-[var(--sunset-orange)] transition-colors font-serif">
              <ArrowLeft className="w-5 h-5" />
              Back to Memorial
            </button>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 font-serif hidden sm:inline">
                Welcome, <span className="font-bold">{user?.name}</span>
              </span>
              <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-serif text-sm">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl script-font text-[var(--sunset-orange)] mb-3">
            Create Memorial Slideshow
          </h1>
          <p className="text-lg text-gray-600 font-serif leading-relaxed max-w-2xl mx-auto">
            Upload photos and videos, arrange them into a beautiful slideshow
            for{' '}
            <span className="text-[var(--sunset-orange)] font-bold">
              February 13th, 2026
            </span>
          </p>
        </motion.div>

        {/* Progress Stats */}
        {(uploadCount > 0 || slides.length > 0 || audioTracks.length > 0) && <motion.div initial={{
        opacity: 0,
        scale: 0.95
      }} animate={{
        opacity: 1,
        scale: 1
      }} className="mb-8 grid grid-cols-3 gap-4">
            <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50 text-center">
              <div className="text-3xl font-bold text-[var(--sunset-orange)] mb-1">
                {uploadCount}
              </div>
              <div className="text-sm text-gray-600 font-serif">
                Files Uploaded
              </div>
            </div>
            <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50 text-center">
              <div className="text-3xl font-bold text-[var(--wildflower-purple)] mb-1">
                {slides.length}
              </div>
              <div className="text-sm text-gray-600 font-serif">
                Slides Arranged
              </div>
            </div>
            <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50 text-center">
              <div className="text-3xl font-bold text-[var(--nature-green)] mb-1">
                {audioTracks.length}
              </div>
              <div className="text-sm text-gray-600 font-serif">
                Music Tracks
              </div>
            </div>
          </motion.div>}

        {/* Tab Navigation */}
        <div className="mb-8 bg-white/60 backdrop-blur-sm rounded-xl p-2 border border-white/50">
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map(tab => <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-3 rounded-lg font-serif text-sm transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-[var(--sunset-orange)] text-white shadow-lg' : 'text-gray-600 hover:bg-white/50'}`}>
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${activeTab === tab.id ? 'bg-white/20' : 'bg-[var(--sunset-orange)] text-white'}`}>
                    {tab.badge}
                  </span>}
              </button>)}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} exit={{
          opacity: 0,
          y: -20
        }} transition={{
          duration: 0.3
        }}>
            {activeTab === 'upload' && <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/50">
                <MediaUploader onUploadComplete={handleUploadComplete} />
              </div>}

            {activeTab === 'arrange' && <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/50">
                <SlideshowEditor slides={slides} onReorder={setSlides} onUpdateSlide={async (id, updates) => {
              console.log('📝 Updating slide:', id, 'Updates:', updates);
              
              // Update local state immediately for responsiveness
              setSlides(prev => prev.map(s => s.id === id ? {
                ...s,
                ...updates
              } : s));
              
              // Note: S3 metadata updates disabled due to CORS complexity with CopyObject
              // Captions are persisted in localStorage and will be included in slideshow
              console.log('💾 Caption saved to localStorage (will be in slideshow)');
            }} onRemoveSlide={async (id) => {
              console.log('🗑️  Removing slide:', id);
              const slideToDelete = slides.find(s => s.id === id);
              console.log('   Slide to delete:', slideToDelete);
              
              // If slide has S3 key, delete from S3
              if (slideToDelete?.s3Key && user) {
                console.log('   Deleting from S3:', slideToDelete.s3Key);
                try {
                  const result = await deleteFromS3(slideToDelete.s3Key);
                  
                  if (!result.success) {
                    console.error('Failed to delete from S3:', result.error);
                    alert(`Failed to delete file: ${result.error}`);
                    return;
                  }
                  console.log('✅ Deleted from S3 successfully');
                } catch (error) {
                  console.error('Error deleting from S3:', error);
                  alert('Failed to delete file from server');
                  return;
                }
              }
              
              // Remove from local state and update count
              setSlides(prev => prev.filter(s => s.id !== id));
              setUploadCount(prev => Math.max(0, prev - 1));
              console.log('✅ Slide removed from list');
            }} />
              </div>}

            {activeTab === 'template' && <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/50">
                <TemplateSelector selectedTemplate={selectedTemplate} onSelectTemplate={setSelectedTemplate} />
              </div>}

            {activeTab === 'audio' && <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/50">
                <AudioManager tracks={audioTracks} onAddTrack={track => setAudioTracks(prev => [...prev, track])} onRemoveTrack={id => setAudioTracks(prev => prev.filter(t => t.id !== id))} onUpdateVolume={(id, volume) => {
              setAudioTracks(prev => prev.map(t => t.id === id ? {
                ...t,
                volume
              } : t));
            }} />
              </div>}
          </motion.div>
        </AnimatePresence>

        {/* Action Buttons */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.2
      }} className="mt-8 grid md:grid-cols-3 gap-4">
          <button onClick={() => navigate('/slideshow')} disabled={slides.length === 0} className="flex items-center justify-center gap-3 px-6 py-4 bg-[var(--wildflower-purple)] text-white rounded-xl hover:shadow-lg transition-all font-serif disabled:opacity-50 disabled:cursor-not-allowed">
            <Play className="w-5 h-5" />
            Preview Slideshow
          </button>

          <button onClick={handleExportSlideshow} disabled={slides.length === 0} className="flex items-center justify-center gap-3 px-6 py-4 bg-[var(--sunset-orange)] text-white rounded-xl hover:shadow-lg transition-all font-serif disabled:opacity-50 disabled:cursor-not-allowed">
            <Download className="w-5 h-5" />
            Export Slideshow
          </button>

          <button onClick={() => {
          const url = window.location.origin;
          navigator.clipboard.writeText(url);
          alert('Memorial link copied to clipboard!');
        }} className="flex items-center justify-center gap-3 px-6 py-4 bg-white/60 backdrop-blur-sm text-gray-700 rounded-xl hover:shadow-lg transition-all font-serif border border-white/50">
            <Share2 className="w-5 h-5" />
            Share Memorial
          </button>
        </motion.div>

        {/* Guidelines */}
        <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        delay: 0.4
      }} className="mt-8 p-6 bg-white/40 backdrop-blur-sm rounded-xl border border-white/50">
          <h3 className="font-serif text-lg text-gray-800 mb-4">
            📋 Slideshow Creation Guide
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600 font-serif">
            <div>
              <h4 className="font-bold text-gray-800 mb-2">
                ✨ Best Practices
              </h4>
              <ul className="space-y-1">
                <li>• Use high-resolution photos (1920x1080 or higher)</li>
                <li>• Keep videos under 15 seconds for best flow</li>
                <li>• Add meaningful captions to tell the story</li>
                <li>• Choose music that reflects Rena's spirit</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-800 mb-2">
                🎬 Production Tips
              </h4>
              <ul className="space-y-1">
                <li>• Arrange slides chronologically or thematically</li>
                <li>• Mix photo types (portraits, landscapes, candids)</li>
                <li>• Preview before finalizing</li>
                <li>• Export early to allow time for review</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </main>
    </div>;
}