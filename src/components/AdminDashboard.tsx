import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Eye, Users, Image as ImageIcon, Clock, Loader, Folder, Trash2, Play } from 'lucide-react';
import { listAllUsersFiles, loadCaptionsFromS3, deleteFromS3, loadDeletedFilesFromS3, saveDeletedFilesToS3, type S3File } from '../utils/s3Upload';
import { useNavigate } from 'react-router-dom';

interface UserMedia {
  userId: string;
  files: S3File[];
}

export function AdminDashboard() {
  const [userMedia, setUserMedia] = useState<UserMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<{ file: S3File; userId: string } | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const navigate = useNavigate();

  // Load all users and their files on mount
  useEffect(() => {
    async function loadAllMedia() {
      setLoading(true);
      const result = await listAllUsersFiles();
      
      if (result.success && result.userFiles) {
        // Load captions for each user and merge with files
        const usersWithCaptions = await Promise.all(
          Object.entries(result.userFiles).map(async ([userId, files]) => {
            const captionsResult = await loadCaptionsFromS3(userId);
            const captions = captionsResult.success && captionsResult.captions ? captionsResult.captions : {};
            
            // Merge captions into files
            const filesWithCaptions = files
              .filter(f => f.type === 'image' || f.type === 'video')
              .map(file => ({
                ...file,
                caption: captions[file.key] || file.caption || '',
              }));
            
            return {
              userId,
              files: filesWithCaptions,
            };
          })
        );
        
        setUserMedia(usersWithCaptions);
        console.log('📊 Loaded media from', usersWithCaptions.length, 'users');
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

  // Handle delete
  const handleDelete = async (fileKey: string, userId: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;
    
    setDeleting(fileKey);
    const result = await deleteFromS3(fileKey);
    
    if (result.success) {
      // Track this deletion in S3 so it won't be re-synced on login
      const deletedResult = await loadDeletedFilesFromS3(userId);
      const currentDeleted = deletedResult.success && deletedResult.deletedKeys ? deletedResult.deletedKeys : [];
      const updatedDeleted = [...currentDeleted, fileKey];
      await saveDeletedFilesToS3(userId, updatedDeleted);
      console.log('🗑️ Recorded deletion of', fileKey, 'for user', userId);
      
      // Remove from local state
      setUserMedia(prev => prev.map(user => 
        user.userId === userId 
          ? { ...user, files: user.files.filter(f => f.key !== fileKey) }
          : user
      ));
      setSelectedFile(null);
      console.log('✅ File deleted successfully');
    } else {
      alert('Failed to delete file: ' + result.error);
    }
    
    setDeleting(null);
  };

  // Create combined slideshow from all photos
  const handleCreateCombinedSlideshow = () => {
    const allSlides = userMedia.flatMap(user => 
      user.files.map(file => ({
        id: file.key,
        type: file.type === 'video' ? 'video' as const : 'image' as const,
        url: file.url,
        thumbnail: file.url,
        caption: file.caption || '',
        duration: 5,
        transition: 'fade' as const,
        s3Key: file.key,
      }))
    );
    
    // Save to localStorage for slideshow page
    const config = {
      slides: allSlides,
      template: 'classic',
      audioTracks: [],
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem('slideshow_config', JSON.stringify(config));
    
    console.log('📺 Created combined slideshow with', allSlides.length, 'slides');
    
    // Navigate to slideshow
    navigate('/slideshow');
  };

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
        
        {/* Create Combined Slideshow Button */}
        {totalFiles > 0 && (
          <button
            onClick={handleCreateCombinedSlideshow}
            className="mt-4 flex items-center gap-2 px-6 py-3 bg-[var(--sunset-orange)] text-white rounded-lg hover:bg-[var(--sunset-orange)]/90 transition-colors font-serif shadow-lg"
          >
            <Play className="w-5 h-5" />
            Create Combined Slideshow ({totalFiles} photos)
          </button>
        )}
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
              const isDeleting = deleting === file.key;
              return (
                <motion.div
                  key={file.key}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/60 backdrop-blur-sm rounded-xl overflow-hidden border border-white/50 shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Thumbnail */}
                  <div 
                    className="relative h-48 bg-gray-100 cursor-pointer"
                    onClick={() => setSelectedFile({ file, userId: userId || 'unknown' })}
                  >
                    <img src={file.url} alt="" className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 text-white text-xs font-serif rounded">
                      {file.type}
                    </div>
                    
                    {/* Delete button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(file.key, userId || 'unknown');
                      }}
                      disabled={isDeleting}
                      className="absolute top-2 left-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Delete"
                    >
                      {isDeleting ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
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
              
              <p className="text-xs text-gray-400 font-mono mb-6">
                {selectedFile.file.key}
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    handleDelete(selectedFile.file.key, selectedFile.userId);
                  }}
                  disabled={deleting === selectedFile.file.key}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-serif disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleting === selectedFile.file.key ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-5 h-5" />
                      Delete
                    </>
                  )}
                </button>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-serif"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>}
    </div>;
}