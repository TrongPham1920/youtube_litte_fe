import React, { useState } from 'react';
import { deleteVideo, updateVideo, Video, Channel } from '../../data/api/app/api';
import { Edit, Trash2 } from 'lucide-react';
import Notification from '../../components/ui/Notification';

const isChannel = (channelId: string | Channel | undefined): channelId is Channel => {
  if (typeof channelId !== 'object' || channelId === null || channelId === undefined) {
    return false;
  }
  const channel = channelId as Channel;
  return typeof channel.name === 'string';
};

interface VideoCardProps {
  video: Video;
  onClick: () => void;
  isChannelOwner: boolean;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onClick, isChannelOwner }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(video.title);
  const [description, setDescription] = useState(video.description || '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentVideo, setCurrentVideo] = useState<Video>(video);
  const [isDeleted, setIsDeleted] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const uploadChunks = async (file: File, filename: string) => {
    const chunkSize = 5 * 1024 * 1024;
    const totalChunks = Math.ceil(file.size / chunkSize);

    for (let i = 0; i < totalChunks; i++) {
      const chunk = file.slice(i * chunkSize, (i + 1) * chunkSize);
      const formData = new FormData();
      formData.append('chunk', chunk);
      formData.append('filename', filename);
      formData.append('chunkIndex', i.toString());

      await fetch('http://localhost:5000/upload-chunk', {
        method: 'POST',
        body: formData,
      });

      const progress = Math.round(((i + 1) / totalChunks) * 100);
      setUploadProgress(progress);
    }

    return totalChunks;
  };

  const mergeChunks = async (filename: string, totalChunks: number): Promise<string> => {
    const res = await fetch('http://localhost:5000/merge-chunks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename, totalChunks }),
    });

    const data = await res.json();
    return data.videoUrl;
  };

  const handleDelete = async () => {
    if (!currentVideo._id) return;

    try {
      await deleteVideo(currentVideo._id);
      setNotification({ message: 'Video đã được xóa thành công!', type: 'success' });
      // Delay hiding the card to show the notification
      setTimeout(() => {
        setIsDeleted(true);
      }, 2000); // 2-second delay
    } catch (err) {
      console.error(err);
      setNotification({ message: 'Xóa video thất bại!', type: 'error' });
    }
  };

  const handleUpdate = async () => {
    if (!currentVideo._id || !title || !description) {
      setNotification({ message: 'Vui lòng nhập đầy đủ thông tin để cập nhật!', type: 'error' });
      return;
    }

    setIsUpdating(true);
    setNotification(null);
    try {
      let videoUrl = currentVideo.videoUrl;
      if (selectedFile) {
        const filename = `${Date.now()}_${selectedFile.name}`;
        const totalChunks = await uploadChunks(selectedFile, filename);
        videoUrl = await mergeChunks(filename, totalChunks);
      }

      const updatedVideo: Partial<Video> = {
        title,
        description,
        videoUrl,
      };

      const result = await updateVideo(currentVideo._id, updatedVideo);
      setCurrentVideo(result);
      setNotification({ message: 'Video đã được cập nhật thành công!', type: 'success' });
      setIsEditing(false);
      setSelectedFile(null);
      setUploadProgress(0);
    } catch (err) {
      console.error(err);
      setNotification({ message: 'Cập nhật video thất bại!', type: 'error' });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isDeleted) {
    return null;
  }

  return (
    <div className="video-card bg-white dark:bg-zinc-800 rounded-lg shadow p-2 max-w-sm mx-auto">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      {isEditing ? (
        <div className="mb-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Chọn video mới (nếu muốn thay đổi)
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="w-full p-2 border rounded dark:bg-zinc-700 dark:text-white text-sm"
              disabled={isUpdating}
            />
            {selectedFile && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
              </p>
            )}
          </div>
          <input
            type="text"
            placeholder="Tiêu đề video"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mb-2 p-2 border rounded dark:bg-zinc-700 dark:text-white"
            disabled={isUpdating}
          />
          <textarea
            placeholder="Mô tả video"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full mb-2 p-2 border rounded dark:bg-zinc-700 dark:text-white"
            rows={3}
            disabled={isUpdating}
          />
          {isUpdating && uploadProgress > 0 && (
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div
                  className="bg-red-600 h-2.5 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="mt-1 text-sm text-center text-gray-500 dark:text-gray-400">
                {uploadProgress}% đã hoàn thành
              </p>
            </div>
          )}
        </div>
      ) : (
        <div onClick={onClick} style={{ cursor: 'pointer' }}>
          <video
            src={currentVideo.videoUrl}
            width="200"
            height="120"
            className="rounded"
            muted
            controls={false}
            onMouseOver={(e) => e.currentTarget.play()}
            onMouseOut={(e) => e.currentTarget.pause()}
          />
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mt-2">{currentVideo.title}</h3>
          <p className="text-xs text-gray-600 dark:text-gray-300">{currentVideo.description}</p>

          {isChannel(currentVideo.channelId) && (
            <div className="flex items-center mt-2">
              {currentVideo.channelId.avatar ? (
                <img
                  src={currentVideo.channelId.avatar}
                  alt={`${currentVideo.channelId.name} avatar`}
                  className="w-6 h-6 rounded-full mr-1 object-cover"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center mr-1">
                  <span className="text-xs font-medium">
                    {currentVideo.channelId.name?.charAt(0).toUpperCase() || 'C'}
                  </span>
                </div>
              )}
              <span className="text-xs text-gray-600 dark:text-gray-300">
                {currentVideo.channelId.name}
              </span>
            </div>
          )}
        </div>
      )}

      {isChannelOwner && (
        <div className="flex space-x-2 mt-2">
          <button
            onClick={handleDelete}
            className="flex items-center space-x-1 bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
            disabled={isUpdating}
          >
            <Trash2 size={16} />
            <span>Xóa</span>
          </button>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center space-x-1 bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
            disabled={isUpdating}
          >
            <Edit size={16} />
            <span>{isEditing ? 'Hủy chỉnh sửa' : 'Chỉnh sửa'}</span>
          </button>
          {isEditing && (
            <button
              onClick={handleUpdate}
              disabled={isUpdating}
              className="flex items-center space-x-1 bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded disabled:opacity-50"
            >
              {isUpdating ? 'Đang cập nhật...' : 'Lưu'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoCard;