import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Eye, Users, Image as ImageIcon, Clock, Loader, Folder } from 'lucide-react';
import { listAllUsersFiles, type S3File } from '../utils/s3Upload';

interface UserMedia {
  userId: string;
  files: S3File[];
}

export function AdminDashboard() {
  const [userMedia, setUserMedia] = useState<UserMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<{ file: S3File; userId: string } | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  // Load all users and their files on mount
  useEffect(() => {
    async function loadAllMedia() {
      setLoading(true);
      const result = await listAllUsersFiles();
      
      if (result.success && result.userFiles) {
        const users = Object.entries(result.userFiles).map(([userId, files]) => ({
          userId,
          files: files.filter(f => f.type === 'image' || f.type === 'video'),
        }));
        setUserMedia(users);
        console.log('📊 Loaded media from', users.length, 'users');
      }
      
      setLoading(false);
    }
    
    loadAllMedia();
  }, []);

  const totalFiles = userMedia.reduce((sum, user) => sum + user.files.length, 0);
  const totalUsers = userMedia.length;

  // Get files for selected user or all files
  const displayFiles = selectedUser
    ? userMedia.find(u => u.userId === selectedUser)?.files || []
    : userMedia.flatMap(u => u.files.map(f => ({ ...f, userId: u.userId })));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-8 h-8 text-[var(--sunset-orange)] animate-spin" />
      </div>
    );
  }

  return <div className="space-y-6">
      <div>
        <h2 className="text-3xl script-font text-[var(--sunset-orange)] mb-2">
          Admin Dashboard
        </h2>
        <p className="text-gray-600 font-serif">
          Review uploaded content from all users
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50">
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <Users className="w-4 h-4" />
            <span className="text-sm font-serif">Total Users</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {totalUsers}
          </div>
        </div>
        <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50">
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <ImageIcon className="w-4 h-4" />
            <span className="text-sm font-serif">Total Files</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {totalFiles}
          </div>
        </div>
        <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50">
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <Folder className="w-4 h-4" />
            <span className="text-sm font-serif">Viewing</span>
          </div>
          <div className="text-sm font-bold text-gray-800 truncate">
            {selectedUser || 'All Users'}
          </div>
        </div>
      </div>

      {/* User Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedUser(null)}
          className={`px-4 py-2 rounded-lg font-serif text-sm transition-colors ${
            !selectedUser
              ? 'bg-[var(--sunset-orange)] text-white'
              : 'bg-white/60 text-gray-700 hover:bg-white/80'
          }`}
        >
          All Users ({totalFiles})
        </button>
        {userMedia.map(user => (
          <button
            key={user.userId}
            onClick={() => setSelectedUser(user.userId)}
            className={`px-4 py-2 rounded-lg font-serif text-sm transition-colors truncate max-w-xs ${
              selectedUser === user.userId
                ? 'bg-[var(--sunset-orange)] text-white'
                : 'bg-white/60 text-gray-700 hover:bg-white/80'
            }`}
          >
            {user.userId.replace(/_/g, '.')} ({user.files.length})
          </button>
        ))}
      </div>

      {/* Media Grid */}
      <div>
        {displayFiles.length === 0 ? <div className="text-center py-12 bg-white/40 rounded-xl border-2 border-dashed border-gray-300">
            <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 font-serif">
              No uploads found
            </p>
          </div> : <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {displayFiles.map((file) => {
              const userId = 'userId' in file ? file.userId : selectedUser;
              return (
                <motion.div
                  key={file.key}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/60 backdrop-blur-sm rounded-xl overflow-hidden border border-white/50 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedFile({ file, userId: userId || 'unknown' })}
                >
                  {/* Thumbnail */}
                  <div className="relative h-48 bg-gray-100">
                    <img src={file.url} alt="" className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 text-white text-xs font-serif rounded">
                      {file.type}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-3 h-3 text-gray-400" />
                      <p className="text-xs text-gray-600 truncate font-serif">
                        {userId?.replace(/_/g, '.')}
                      </p>
                    </div>
                    
                    <p className="text-xs text-gray-500 truncate mb-2">
                      {new Date(file.lastModified).toLocaleDateString()}
                    </p>
                    
                    <p className="text-xs text-gray-600 font-serif line-clamp-2">
                      {file.caption || 'No caption'}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>}
      </div>

      {/* Preview Modal */}
      {selectedFile && <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedFile(null)}>
          <motion.div initial={{
        opacity: 0,
        scale: 0.9
      }} animate={{
        opacity: 1,
        scale: 1
      }} onClick={e => e.stopPropagation()} className="bg-white rounded-2xl max-w-4xl w-full overflow-hidden max-h-[90vh] overflow-y-auto">
            <img src={selectedFile.file.url} alt="" className="w-full max-h-96 object-contain bg-gray-100" />
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-gray-400" />
                <p className="text-sm font-bold text-gray-800">
                  {selectedFile.userId.replace(/_/g, '.')}
                </p>
              </div>
              
              <p className="text-sm text-gray-600 font-serif mb-2">
                {selectedFile.file.caption || 'No caption provided'}
              </p>
              
              <p className="text-xs text-gray-400 font-serif mb-4">
                Uploaded: {new Date(selectedFile.file.lastModified).toLocaleString()}
              </p>
              
              <p className="text-xs text-gray-400 font-mono mb-4">
                {selectedFile.file.key}
              </p>
              
              <button
                onClick={() => setSelectedFile(null)}
                className="w-full px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-serif"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>}
    </div>;
}