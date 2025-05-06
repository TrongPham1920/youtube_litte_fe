import React, { useState } from 'react';
import { deleteVideo, updateVideo, Video } from '../../data/api/app/api';
import { Edit, Trash2 } from 'lucide-react';

interface VideoCardProps {
  video: Video;
  onClick: () => void;
  isChannelOwner: boolean; // New prop to indicate if the user is the channel owner
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onClick, isChannelOwner }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(video.title);
  const [description, setDescription] = useState(video.description || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<Video>(video);
  const [isDeleted, setIsDeleted] = useState(false);

  const handleDelete = async () => {
    if (!currentVideo._id) return;

    if (!window.confirm('Bạn có chắc muốn xóa video này?')) return;

    try {
      await deleteVideo(currentVideo._id);
      alert('Video đã được xóa thành công!');
      setIsDeleted(true); // Mark as deleted to hide the card
    } catch (err) {
      console.error(err);
      alert('Xóa video thất bại!');
    }
  };

  const handleUpdate = async () => {
    if (!currentVideo._id || !title || !description) {
      alert('Vui lòng nhập đầy đủ thông tin để cập nhật!');
      return;
    }

    setIsUpdating(true);
    try {
      const updatedVideo: Partial<Video> = {
        title,
        description,
      };

      const result = await updateVideo(currentVideo._id, updatedVideo);
      setCurrentVideo(result); // Update local video state
      alert('Video đã được cập nhật thành công!');
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert('Cập nhật video thất bại!');
    } finally {
      setIsUpdating(false);
    }
  };

  // If video is deleted, don't render the card
  if (isDeleted) {
    return null;
  }

  return (
    <div className="video-card bg-white dark:bg-zinc-800 rounded-lg shadow p-4" style={{ cursor: 'pointer' }}>
      {isEditing ? (
        <div className="mb-4">
          <input
            type="text"
            placeholder="Tiêu đề video"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mb-2 p-2 border rounded dark:bg-zinc-700 dark:text-white"
          />
          <textarea
            placeholder="Mô tả video"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full mb-2 p-2 border rounded dark:bg-zinc-700 dark:text-white"
            rows={3}
          />
        </div>
      ) : (
        <div onClick={onClick}>
          <video src={currentVideo.videoUrl} width="200" height="120" controls className="rounded" />
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mt-2">{currentVideo.title}</h3>
          <p className="text-xs text-gray-600 dark:text-gray-300">{currentVideo.description}</p>
        </div>
      )}

      {isChannelOwner && (
        <div className="flex justify-end space-x-2 mt-2">
          <button
            onClick={handleDelete}
            className="flex items-center space-x-1 bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
          >
            <Trash2 size={16} />
            <span>Xóa</span>
          </button>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center space-x-1 bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
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