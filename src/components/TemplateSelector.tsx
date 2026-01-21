import React, { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Film, Layout, Grid } from 'lucide-react';
export type SlideshowTemplate = 'classic' | 'modern' | 'cinematic' | 'collage';
interface Template {
  id: SlideshowTemplate;
  name: string;
  description: string;
  icon: React.ReactNode;
  preview: string;
  features: string[];
}
const templates: Template[] = [{
  id: 'classic',
  name: 'Classic Elegance',
  description: 'Timeless fade transitions with elegant typography',
  icon: <Layout className="w-6 h-6" />,
  preview: 'linear-gradient(135deg, #FFF5EE 0%, #FFB6A3 100%)',
  features: ['Fade transitions', 'Centered layout', 'Elegant captions', 'Soft music']
}, {
  id: 'modern',
  name: 'Modern Slideshow',
  description: 'Dynamic slides with smooth animations',
  icon: <Sparkles className="w-6 h-6" />,
  preview: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
  features: ['Slide transitions', 'Ken Burns effect', 'Bold typography', 'Upbeat tempo']
}, {
  id: 'cinematic',
  name: 'Cinematic Experience',
  description: 'Widescreen format with dramatic effects',
  icon: <Film className="w-6 h-6" />,
  preview: 'linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 100%)',
  features: ['Zoom transitions', 'Letterbox format', 'Dramatic music', 'Slow pacing']
}, {
  id: 'collage',
  name: 'Photo Collage',
  description: 'Multiple photos displayed together',
  icon: <Grid className="w-6 h-6" />,
  preview: 'linear-gradient(135deg, #8B4789 0%, #4A7C59 100%)',
  features: ['Grid layouts', 'Multiple photos', 'Quick transitions', 'Energetic feel']
}];
interface TemplateSelectorProps {
  selectedTemplate: SlideshowTemplate;
  onSelectTemplate: (template: SlideshowTemplate) => void;
}
export function TemplateSelector({
  selectedTemplate,
  onSelectTemplate
}: TemplateSelectorProps) {
  return <div className="space-y-6">
      <div>
        <h3 className="text-2xl script-font text-[var(--sunset-orange)] mb-2">
          Choose a Template
        </h3>
        <p className="text-gray-600 font-serif text-sm">
          Select a style for your memorial slideshow
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {templates.map(template => <motion.button key={template.id} onClick={() => onSelectTemplate(template.id)} whileHover={{
        scale: 1.02
      }} whileTap={{
        scale: 0.98
      }} className={`relative p-6 rounded-xl border-2 transition-all text-left ${selectedTemplate === template.id ? 'border-[var(--sunset-orange)] bg-[var(--sunset-pink)]/10' : 'border-gray-200 bg-white/60 hover:border-gray-300'}`}>
            {/* Preview Background */}
            <div className="absolute top-0 left-0 right-0 h-24 rounded-t-xl opacity-20" style={{
          background: template.preview
        }} />

            {/* Selected Indicator */}
            {selectedTemplate === template.id && <motion.div initial={{
          scale: 0
        }} animate={{
          scale: 1
        }} className="absolute top-4 right-4 w-8 h-8 bg-[var(--sunset-orange)] rounded-full flex items-center justify-center z-10">
                <Check className="w-5 h-5 text-white" />
              </motion.div>}

            {/* Content */}
            <div className="relative pt-20">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-[var(--sunset-pink)]/30 rounded-lg text-[var(--sunset-orange)]">
                  {template.icon}
                </div>
                <h4 className="font-serif text-lg text-gray-800 font-bold">
                  {template.name}
                </h4>
              </div>

              <p className="text-sm text-gray-600 font-serif mb-4">
                {template.description}
              </p>

              <ul className="space-y-1">
                {template.features.map((feature, index) => <li key={index} className="text-xs text-gray-500 font-serif flex items-center gap-2">
                    <span className="w-1 h-1 bg-[var(--sunset-orange)] rounded-full" />
                    {feature}
                  </li>)}
              </ul>
            </div>
          </motion.button>)}
      </div>
    </div>;
}