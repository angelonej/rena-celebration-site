import React, { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Send } from 'lucide-react';
interface TributeFormProps {
  isOpen: boolean;
  onClose: () => void;
}
export function TributeForm({
  isOpen,
  onClose
}: TributeFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    relationship: '',
    memory: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send to a backend
    console.log('Tribute submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
      setFormData({
        name: '',
        relationship: '',
        memory: ''
      });
    }, 2000);
  };
  return <AnimatePresence>
      {isOpen && <>
          {/* Backdrop */}
          <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} onClick={onClose} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />

          {/* Modal */}
          <motion.div initial={{
        opacity: 0,
        scale: 0.9,
        y: 20
      }} animate={{
        opacity: 1,
        scale: 1,
        y: 0
      }} exit={{
        opacity: 0,
        scale: 0.9,
        y: 20
      }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-2xl shadow-2xl z-50 p-6 max-h-[90vh] overflow-y-auto">
            {submitted ? <motion.div initial={{
          opacity: 0,
          scale: 0.8
        }} animate={{
          opacity: 1,
          scale: 1
        }} className="text-center py-12">
                <motion.div animate={{
            scale: [1, 1.2, 1]
          }} transition={{
            duration: 0.5
          }} className="inline-block mb-4">
                  <Heart className="w-16 h-16 text-[var(--heart-pink)] fill-current" />
                </motion.div>
                <h3 className="text-2xl font-serif text-gray-800 mb-2">
                  Thank You
                </h3>
                <p className="text-gray-600 font-serif">
                  Your memory has been shared with love
                </p>
              </motion.div> : <>
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-serif text-gray-800">
                    Share a Memory
                  </h3>
                  <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-serif text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <input type="text" required value={formData.name} onChange={e => setFormData({
                ...formData,
                name: e.target.value
              })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--sunset-orange)] focus:border-transparent outline-none transition-all font-serif" placeholder="Enter your name" />
                  </div>

                  <div>
                    <label className="block text-sm font-serif text-gray-700 mb-2">
                      Relationship to Rena
                    </label>
                    <input type="text" value={formData.relationship} onChange={e => setFormData({
                ...formData,
                relationship: e.target.value
              })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--sunset-orange)] focus:border-transparent outline-none transition-all font-serif" placeholder="Friend, Family, Colleague, etc." />
                  </div>

                  <div>
                    <label className="block text-sm font-serif text-gray-700 mb-2">
                      Your Memory *
                    </label>
                    <textarea required value={formData.memory} onChange={e => setFormData({
                ...formData,
                memory: e.target.value
              })} rows={6} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--sunset-orange)] focus:border-transparent outline-none transition-all font-serif resize-none" placeholder="Share a favorite memory, story, or message about Rena..." />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button type="button" onClick={onClose} className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-serif">
                      Cancel
                    </button>
                    <button type="submit" className="flex-1 px-6 py-3 bg-gradient-to-r from-[var(--sunset-orange)] to-[var(--sunset-coral)] text-white rounded-lg hover:shadow-lg transition-all font-serif flex items-center justify-center gap-2">
                      <Send className="w-4 h-4" />
                      Share Memory
                    </button>
                  </div>
                </form>
              </>}
          </motion.div>
        </>}
    </AnimatePresence>;
}