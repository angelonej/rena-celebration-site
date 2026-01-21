/**
 * Master Slideshow Compiler
 * Aggregates content from all sources and generates a complete slideshow
 */

export interface SlideContent {
  id: string;
  type: 'image' | 'video' | 'text' | 'tribute' | 'timeline' | 'title';
  content: string; // URL for media, text for text slides
  caption?: string;
  author?: string;
  timestamp?: string;
  duration: number; // seconds
  transition: 'fade' | 'slide' | 'zoom' | 'kenburns';
  template?: string;
}
export interface SlideshowConfig {
  title: string;
  slides: SlideContent[];
  template: 'classic' | 'modern' | 'cinematic' | 'collage';
  music?: {
    url: string;
    volume: number;
  }[];
  totalDuration: number;
  createdAt: string;
}

/**
 * Aggregate content from localStorage
 */
export function aggregateContent(): {
  uploadedMedia: any[];
  tributes: any[];
  timeline: any[];
  photos: any[];
} {
  // DEPRECATED: We now use S3 as source of truth
  // Get uploaded media from slideshow_config if available (set by UploadPage)
  const config = JSON.parse(localStorage.getItem('slideshow_config') || '{}');
  const uploadedMedia = config.slides || [];

  // Get tributes from guestbook
  const tributes = JSON.parse(localStorage.getItem('memorial_tributes') || '[]');

  // No hardcoded timeline - use only what user creates
  const timeline: any[] = [];

  // No hardcoded photos - use only uploaded media
  const photos: any[] = [];
  
  return {
    uploadedMedia,
    tributes,
    timeline,
    photos
  };
}

/**
 * Generate title slide
 */
function generateTitleSlide(): SlideContent {
  return {
    id: 'title-slide',
    type: 'title',
    content: 'Rena Michele Voghel',
    caption: 'Love Will Keep Us Together',
    duration: 5,
    transition: 'fade'
  };
}

/**
 * Generate timeline slides
 */
function generateTimelineSlides(timeline: any[]): SlideContent[] {
  return timeline.map((event, index) => ({
    id: `timeline-${index}`,
    type: 'timeline' as const,
    content: event.year,
    caption: `${event.title}\n${event.description}`,
    duration: 6,
    transition: 'slide' as const
  }));
}

/**
 * Generate tribute slides
 */
function generateTributeSlides(tributes: any[]): SlideContent[] {
  return tributes.map((tribute, index) => ({
    id: `tribute-${index}`,
    type: 'tribute' as const,
    content: tribute.memory,
    caption: `— ${tribute.name}${tribute.relationship ? `, ${tribute.relationship}` : ''}`,
    author: tribute.name,
    duration: 8,
    transition: 'fade' as const
  }));
}

/**
 * Generate media slides from uploaded content
 */
function generateMediaSlides(media: any[]): SlideContent[] {
  return media.map((item, index) => ({
    id: `media-${index}`,
    type: item.type || 'image',
    content: item.preview || item.url,
    caption: item.caption || '',
    author: item.userName,
    duration: item.type === 'video' ? 10 : 5,
    transition: 'kenburns' as const
  }));
}

/**
 * Generate photo gallery slides
 */
function generatePhotoSlides(photos: any[]): SlideContent[] {
  return photos.map((photo, index) => ({
    id: `photo-${index}`,
    type: 'image' as const,
    content: photo.url,
    caption: photo.caption || '',
    duration: 5,
    transition: 'kenburns' as const
  }));
}

/**
 * Generate closing slide
 */
function generateClosingSlide(): SlideContent {
  return {
    id: 'closing-slide',
    type: 'text',
    content: 'Forever in Our Hearts',
    caption: 'Rena Michele Voghel\n1966 - 2024\n\n"Love Will Keep Us Together"',
    duration: 8,
    transition: 'fade'
  };
}

/**
 * Smart ordering of slides based on template
 */
function orderSlides(slides: SlideContent[], template: string): SlideContent[] {
  switch (template) {
    case 'classic':
      // Chronological: Title → Timeline → Photos → Tributes → Closing
      return slides.sort((a, b) => {
        const order = ['title', 'timeline', 'image', 'video', 'tribute', 'text'];
        return order.indexOf(a.type) - order.indexOf(b.type);
      });
    case 'modern':
      // Mixed: Title → Interleave photos/tributes → Timeline → Closing
      const title = slides.filter(s => s.type === 'title');
      const timeline = slides.filter(s => s.type === 'timeline');
      const media = slides.filter(s => s.type === 'image' || s.type === 'video');
      const tributes = slides.filter(s => s.type === 'tribute');
      const closing = slides.filter(s => s.type === 'text');

      // Interleave media and tributes
      const interleaved: SlideContent[] = [];
      const maxLength = Math.max(media.length, tributes.length);
      for (let i = 0; i < maxLength; i++) {
        if (media[i]) interleaved.push(media[i]);
        if (tributes[i]) interleaved.push(tributes[i]);
      }
      return [...title, ...interleaved, ...timeline, ...closing];
    case 'cinematic':
      // Dramatic: Title → Photos with Ken Burns → Timeline → Tributes → Closing
      return slides.sort((a, b) => {
        const order = ['title', 'image', 'video', 'timeline', 'tribute', 'text'];
        return order.indexOf(a.type) - order.indexOf(b.type);
      });
    case 'collage':
      // Random mix for energy
      const titleSlides = slides.filter(s => s.type === 'title');
      const closingSlides = slides.filter(s => s.type === 'text');
      const middleSlides = slides.filter(s => s.type !== 'title' && s.type !== 'text');

      // Shuffle middle slides
      for (let i = middleSlides.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [middleSlides[i], middleSlides[j]] = [middleSlides[j], middleSlides[i]];
      }
      return [...titleSlides, ...middleSlides, ...closingSlides];
    default:
      return slides;
  }
}

/**
 * Apply template-specific transitions
 */
function applyTemplateTransitions(slides: SlideContent[], template: string): SlideContent[] {
  const transitionMap: Record<string, SlideContent['transition']> = {
    classic: 'fade',
    modern: 'slide',
    cinematic: 'zoom',
    collage: 'slide'
  };
  const defaultTransition = transitionMap[template] || 'fade';
  return slides.map(slide => ({
    ...slide,
    transition: slide.type === 'image' && template === 'cinematic' ? 'kenburns' : slide.transition || defaultTransition
  }));
}

/**
 * Compile master slideshow from all sources
 */
export function compileMasterSlideshow(template: 'classic' | 'modern' | 'cinematic' | 'collage' = 'classic'): SlideshowConfig {
  // Aggregate all content
  const {
    uploadedMedia,
    tributes,
    timeline,
    photos
  } = aggregateContent();

  // Generate slides ONLY from uploaded media (no title, timeline, or closing slides)
  const allSlides: SlideContent[] = [
    ...generateMediaSlides(uploadedMedia),
    ...generateTributeSlides(tributes)
  ];

  // Order slides based on template
  const orderedSlides = orderSlides(allSlides, template);

  // Apply template-specific transitions
  const finalSlides = applyTemplateTransitions(orderedSlides, template);

  // Calculate total duration
  const totalDuration = finalSlides.reduce((sum, slide) => sum + slide.duration, 0);

  // Get audio tracks
  const audioConfig = JSON.parse(localStorage.getItem('slideshow_audio') || '[]');
  return {
    title: 'Rena Michele Voghel - Celebration of Life',
    slides: finalSlides,
    template,
    music: audioConfig,
    totalDuration,
    createdAt: new Date().toISOString()
  };
}

/**
 * Export slideshow configuration
 */
export function exportSlideshowConfig(config: SlideshowConfig): void {
  const dataStr = JSON.stringify(config, null, 2);
  const dataBlob = new Blob([dataStr], {
    type: 'application/json'
  });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `rena-memorial-slideshow-${Date.now()}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Generate slideshow statistics
 */
export function getSlideshowStats(config: SlideshowConfig) {
  const stats = {
    totalSlides: config.slides.length,
    totalDuration: config.totalDuration,
    durationFormatted: formatDuration(config.totalDuration),
    breakdown: {
      photos: config.slides.filter(s => s.type === 'image').length,
      videos: config.slides.filter(s => s.type === 'video').length,
      tributes: config.slides.filter(s => s.type === 'tribute').length,
      timeline: config.slides.filter(s => s.type === 'timeline').length,
      text: config.slides.filter(s => s.type === 'text' || s.type === 'title').length
    },
    contributors: new Set(config.slides.filter(s => s.author).map(s => s.author)).size
  };
  return stats;
}
function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}