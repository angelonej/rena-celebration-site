import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Music, Upload, Play, Pause, Volume2, VolumeX, Trash2 } from 'lucide-react';
interface AudioTrack {
  id: string;
  name: string;
  file: File;
  url: string;
  duration: number;
  volume: number;
}
interface AudioManagerProps {
  tracks: AudioTrack[];
  onAddTrack: (track: AudioTrack) => void;
  onRemoveTrack: (id: string) => void;
  onUpdateVolume: (id: string, volume: number) => void;
}
export function AudioManager({
  tracks,
  onAddTrack,
  onRemoveTrack,
  onUpdateVolume
}: AudioManagerProps) {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRefs = useRef<{
    [key: string]: HTMLAudioElement;
  }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    for (const file of Array.from(files)) {
      if (!file.type.startsWith('audio/')) continue;
      const audio = new Audio();
      audio.src = URL.createObjectURL(file);
      audio.onloadedmetadata = () => {
        const track: AudioTrack = {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          file,
          url: audio.src,
          duration: audio.duration,
          volume: 0.7
        };
        onAddTrack(track);
      };
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  const togglePlay = (id: string) => {
    const audio = audioRefs.current[id];
    if (!audio) return;
    if (playingId === id) {
      audio.pause();
      setPlayingId(null);
    } else {
      // Pause all other tracks
      Object.values(audioRefs.current).forEach(a => a.pause());
      audio.currentTime = 0;
      audio.play();
      setPlayingId(id);
    }
  };
  useEffect(() => {
    // Cleanup audio URLs on unmount
    return () => {
      tracks.forEach(track => URL.revokeObjectURL(track.url));
    };
  }, [tracks]);
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl script-font text-[var(--sunset-orange)] mb-1">
            Background Music
          </h3>
          <p className="text-sm text-gray-600 font-serif">
            Add music to accompany your slideshow
          </p>
        </div>
        <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-4 py-2 bg-[var(--wildflower-purple)] text-white rounded-lg hover:shadow-lg transition-all font-serif">
          <Upload className="w-4 h-4" />
          Add Music
        </button>
        <input ref={fileInputRef} type="file" accept="audio/*" multiple onChange={handleFileSelect} className="hidden" />
      </div>

      {tracks.length === 0 ? <div className="text-center py-12 bg-white/40 rounded-xl border-2 border-dashed border-gray-300">
          <Music className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 font-serif mb-4">No music added yet</p>
          <button onClick={() => fileInputRef.current?.click()} className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--sunset-orange)] text-white rounded-lg hover:shadow-lg transition-all font-serif text-sm">
            <Upload className="w-4 h-4" />
            Upload Audio
          </button>
        </div> : <div className="space-y-3">
          {tracks.map(track => <motion.div key={track.id} initial={{
        opacity: 0,
        y: 10
      }} animate={{
        opacity: 1,
        y: 0
      }} className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-sm">
              <audio ref={el => {
          if (el) audioRefs.current[track.id] = el;
        }} src={track.url} onEnded={() => setPlayingId(null)} volume={track.volume} />

              <div className="flex items-center gap-4">
                {/* Play/Pause */}
                <button onClick={() => togglePlay(track.id)} className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--sunset-orange)] text-white flex items-center justify-center hover:bg-[var(--sunset-coral)] transition-colors">
                  {playingId === track.id ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </button>

                {/* Track Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-serif text-sm text-gray-800 truncate">
                    {track.name}
                  </p>
                  <p className="text-xs text-gray-500 font-serif">
                    {Math.floor(track.duration / 60)}:
                    {Math.floor(track.duration % 60).toString().padStart(2, '0')}
                  </p>
                </div>

                {/* Volume Control */}
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-gray-400" />
                  <input type="range" min="0" max="1" step="0.1" value={track.volume} onChange={e => {
              const newVolume = parseFloat(e.target.value);
              onUpdateVolume(track.id, newVolume);
              if (audioRefs.current[track.id]) {
                audioRefs.current[track.id].volume = newVolume;
              }
            }} className="w-24" />
                </div>

                {/* Remove */}
                <button onClick={() => onRemoveTrack(track.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-500" title="Remove track">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>)}
        </div>}

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <p className="text-sm text-blue-800 font-serif">
          <strong>Tip:</strong> Music will loop throughout the slideshow. Choose
          tracks that match the mood and duration of your presentation.
        </p>
      </div>
    </div>;
}