import React, { useState } from 'react';
import { motion, Reorder } from 'framer-motion';
import { GripVertical, Trash2, Clock, Image as ImageIcon, Video, Music } from 'lucide-react';
export interface SlideItem {
  id: string;
  type: 'image' | 'video' | 'audio';
  url: string;
  thumbnail?: string;
  caption: string;
  duration: number; // seconds
  transition: 'fade' | 'slide' | 'zoom';
  s3Key?: string; // S3 object key for deletion
}
interface SlideshowEditorProps {
  slides: SlideItem[];
  onReorder: (newOrder: SlideItem[]) => void;
  onUpdateSlide: (id: string, updates: Partial<SlideItem>) => void;
  onRemoveSlide: (id: string) => void;
}
export function SlideshowEditor({
  slides,
  onReorder,
  onUpdateSlide,
  onRemoveSlide
}: SlideshowEditorProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempCaption, setTempCaption] = useState<string>('');
  const totalDuration = slides.reduce((sum, slide) => sum + slide.duration, 0);
  const getIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="w-4 h-4" />;
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'audio':
        return <Music className="w-4 h-4" />;
      default:
        return null;
    }
  };
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl script-font text-[var(--sunset-orange)] mb-1">
            Arrange Your Slideshow
          </h3>
          <p className="text-sm text-gray-600 font-serif">
            Drag to reorder • {slides.length} slides •{' '}
            {Math.floor(totalDuration / 60)}:
            {(totalDuration % 60).toString().padStart(2, '0')} total
          </p>
        </div>
      </div>

      {slides.length === 0 ? <div className="text-center py-12 bg-white/40 rounded-xl border-2 border-dashed border-gray-300">
          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 font-serif">
            No slides yet. Upload media to get started.
          </p>
        </div> : <Reorder.Group axis="y" values={slides} onReorder={onReorder} className="space-y-3">
          {slides.map((slide, index) => <Reorder.Item key={slide.id} value={slide} className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/50 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-4">
                <div className="flex gap-4">
                  {/* Drag Handle */}
                  <div className="flex-shrink-0 flex items-center cursor-grab active:cursor-grabbing">
                    <GripVertical className="w-5 h-5 text-gray-400" />
                  </div>

                  {/* Slide Number */}
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--sunset-orange)] text-white flex items-center justify-center font-serif font-bold text-sm">
                    {index + 1}
                  </div>

                  {/* Thumbnail */}
                  <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                    {slide.thumbnail ? <img src={slide.thumbnail} alt={slide.caption} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400">
                        {getIcon(slide.type)}
                      </div>}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    {editingId === slide.id ? <div className="space-y-2">
                        <input type="text" value={tempCaption} onChange={e => setTempCaption(e.target.value)} onBlur={() => {
                  // Save caption when user finishes editing
                  onUpdateSlide(slide.id, { caption: tempCaption });
                  setEditingId(null);
                }} onKeyDown={e => {
                  // Save on Enter key
                  if (e.key === 'Enter') {
                    onUpdateSlide(slide.id, { caption: tempCaption });
                    setEditingId(null);
                  }
                  // Cancel on Escape key
                  if (e.key === 'Escape') {
                    setEditingId(null);
                    setTempCaption(slide.caption);
                  }
                }} autoFocus className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--sunset-orange)] focus:border-transparent outline-none font-serif" placeholder="Add a caption..." />
                      </div> : <div onClick={() => {
                setEditingId(slide.id);
                setTempCaption(slide.caption);
              }} className="cursor-text">
                        <p className="font-serif text-sm text-gray-800 truncate mb-1">
                          {slide.caption || 'Click to add caption'}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-gray-500 font-serif">
                          <span className="flex items-center gap-1">
                            {getIcon(slide.type)}
                            {slide.type}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {slide.duration}s
                          </span>
                          <span className="px-2 py-0.5 bg-gray-100 rounded">
                            {slide.transition}
                          </span>
                        </div>
                      </div>}
                  </div>

                  {/* Controls */}
                  <div className="flex-shrink-0 flex items-center gap-2">
                    <select value={slide.duration} onChange={e => onUpdateSlide(slide.id, {
                duration: parseInt(e.target.value)
              })} className="px-2 py-1 text-xs border border-gray-200 rounded font-serif focus:ring-2 focus:ring-[var(--sunset-orange)] focus:border-transparent outline-none">
                      <option value={3}>3s</option>
                      <option value={5}>5s</option>
                      <option value={7}>7s</option>
                      <option value={10}>10s</option>
                    </select>

                    <select value={slide.transition} onChange={e => onUpdateSlide(slide.id, {
                transition: e.target.value as 'fade' | 'slide' | 'zoom'
              })} className="px-2 py-1 text-xs border border-gray-200 rounded font-serif focus:ring-2 focus:ring-[var(--sunset-orange)] focus:border-transparent outline-none">
                      <option value="fade">Fade</option>
                      <option value="slide">Slide</option>
                      <option value="zoom">Zoom</option>
                    </select>

                    <button onClick={() => onRemoveSlide(slide.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-500" title="Remove slide">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </Reorder.Item>)}
        </Reorder.Group>}
    </div>;
}