import React, { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Eye, Users, Image as ImageIcon, Clock, AlertCircle } from 'lucide-react';
interface PendingMedia {
  id: string;
  userName: string;
  userEmail: string;
  type: 'image' | 'video';
  thumbnail: string;
  caption: string;
  uploadedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}
// Sample pending uploads
const samplePendingMedia: PendingMedia[] = [{
  id: '1',
  userName: 'Sarah Johnson',
  userEmail: 'sarah@example.com',
  type: 'image',
  thumbnail: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
  caption: 'Beautiful memories from our road trip',
  uploadedAt: '2 hours ago',
  status: 'pending'
}, {
  id: '2',
  userName: 'Michael Torres',
  userEmail: 'michael@example.com',
  type: 'video',
  thumbnail: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=200',
  caption: 'Hiking adventure in the mountains',
  uploadedAt: '5 hours ago',
  status: 'pending'
}];
export function AdminDashboard() {
  const [pendingMedia, setPendingMedia] = useState<PendingMedia[]>(samplePendingMedia);
  const [selectedMedia, setSelectedMedia] = useState<PendingMedia | null>(null);
  const handleApprove = (id: string) => {
    setPendingMedia(prev => prev.map(m => m.id === id ? {
      ...m,
      status: 'approved' as const
    } : m));
    setSelectedMedia(null);
  };
  const handleReject = (id: string) => {
    setPendingMedia(prev => prev.map(m => m.id === id ? {
      ...m,
      status: 'rejected' as const
    } : m));
    setSelectedMedia(null);
  };
  const stats = {
    totalUploads: pendingMedia.length,
    pending: pendingMedia.filter(m => m.status === 'pending').length,
    approved: pendingMedia.filter(m => m.status === 'approved').length,
    rejected: pendingMedia.filter(m => m.status === 'rejected').length
  };
  return <div className="space-y-6">
      <div>
        <h2 className="text-3xl script-font text-[var(--sunset-orange)] mb-2">
          Admin Dashboard
        </h2>
        <p className="text-gray-600 font-serif">
          Review and approve uploaded content
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50">
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <ImageIcon className="w-4 h-4" />
            <span className="text-sm font-serif">Total</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {stats.totalUploads}
          </div>
        </div>
        <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
          <div className="flex items-center gap-2 text-yellow-700 mb-2">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-serif">Pending</span>
          </div>
          <div className="text-2xl font-bold text-yellow-800">
            {stats.pending}
          </div>
        </div>
        <div className="p-4 bg-green-50 rounded-xl border border-green-200">
          <div className="flex items-center gap-2 text-green-700 mb-2">
            <Check className="w-4 h-4" />
            <span className="text-sm font-serif">Approved</span>
          </div>
          <div className="text-2xl font-bold text-green-800">
            {stats.approved}
          </div>
        </div>
        <div className="p-4 bg-red-50 rounded-xl border border-red-200">
          <div className="flex items-center gap-2 text-red-700 mb-2">
            <X className="w-4 h-4" />
            <span className="text-sm font-serif">Rejected</span>
          </div>
          <div className="text-2xl font-bold text-red-800">
            {stats.rejected}
          </div>
        </div>
      </div>

      {/* Pending Media Grid */}
      <div>
        <h3 className="text-xl font-serif text-gray-800 mb-4">
          Pending Approval
        </h3>
        {stats.pending === 0 ? <div className="text-center py-12 bg-white/40 rounded-xl border-2 border-dashed border-gray-300">
            <Check className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className="text-gray-600 font-serif">
              All uploads have been reviewed!
            </p>
          </div> : <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingMedia.filter(m => m.status === 'pending').map(media => <motion.div key={media.id} initial={{
          opacity: 0,
          scale: 0.9
        }} animate={{
          opacity: 1,
          scale: 1
        }} className="bg-white/60 backdrop-blur-sm rounded-xl overflow-hidden border border-white/50 shadow-sm hover:shadow-md transition-shadow">
                  {/* Thumbnail */}
                  <div className="relative h-48 bg-gray-100">
                    <img src={media.thumbnail} alt={media.caption} className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 text-white text-xs font-serif rounded">
                      {media.type}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-4">
                    <div className="flex items-start gap-2 mb-3">
                      <Users className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-800 truncate">
                          {media.userName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {media.userEmail}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 font-serif mb-3 line-clamp-2">
                      {media.caption}
                    </p>

                    <p className="text-xs text-gray-400 font-serif mb-4">
                      {media.uploadedAt}
                    </p>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button onClick={() => setSelectedMedia(media)} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-serif text-sm">
                        <Eye className="w-4 h-4" />
                        Preview
                      </button>
                      <button onClick={() => handleApprove(media.id)} className="flex items-center justify-center px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors" title="Approve">
                        <Check className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleReject(media.id)} className="flex items-center justify-center px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors" title="Reject">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>)}
          </div>}
      </div>

      {/* Preview Modal */}
      {selectedMedia && <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedMedia(null)}>
          <motion.div initial={{
        opacity: 0,
        scale: 0.9
      }} animate={{
        opacity: 1,
        scale: 1
      }} onClick={e => e.stopPropagation()} className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden">
            <img src={selectedMedia.thumbnail} alt={selectedMedia.caption} className="w-full h-96 object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-serif text-gray-800 mb-2">
                {selectedMedia.caption}
              </h3>
              <p className="text-sm text-gray-600 font-serif mb-4">
                Uploaded by {selectedMedia.userName} •{' '}
                {selectedMedia.uploadedAt}
              </p>
              <div className="flex gap-3">
                <button onClick={() => handleApprove(selectedMedia.id)} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-serif">
                  <Check className="w-5 h-5" />
                  Approve
                </button>
                <button onClick={() => handleReject(selectedMedia.id)} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-serif">
                  <X className="w-5 h-5" />
                  Reject
                </button>
              </div>
            </div>
          </motion.div>
        </div>}
    </div>;
}