import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
  Channel,
  createChannel,
  getChannelByUserId,
  updateChannel,
  Video,
  getVideosByChannelId,
  uploadImage,
} from '../data/api/app/api';
import UploadVideoForm from '../components/ui/UploadVideoForm';
import VideoCard from '../components/ui/VideoCard';
import Notification from '../components/ui/Notification';
import { Edit, Upload, User } from 'lucide-react';

const YourChannelPage = () => {
  const { user } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [channel, setChannel] = useState<Channel | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (user) {
      getChannelByUserId(user.id).then((channelData) => {
        if (channelData) {
          setChannel(channelData);
        }
      });
    }
  }, [user]);

  useEffect(() => {
    if (channel?._id) {
      getVideosByChannelId(channel._id).then(setVideos);
    }
  }, [channel]);

  const handleSaveChannel = async () => {
    if (!title || !description) {
      setNotification({ message: 'Vui lòng nhập đầy đủ thông tin kênh!', type: 'error' });
      return;
    }

    setIsLoading(true);
    try {
      let avatarUrl = channel?.avatar || '';
      if (avatar) {
        const uploadResponse = await uploadImage(avatar);
        avatarUrl = uploadResponse.imageUrl;
      }

      const newChannelData: Channel = {
        name: title,
        description,
        avatar: avatarUrl,
        userId: user?.id,
      };

      let updated;
      if (channel) {
        updated = await updateChannel(channel._id!, newChannelData);
      } else {
        updated = await createChannel(newChannelData);
      }

      setChannel(updated);
      setShowModal(false);
      setTitle('');
      setAvatar(null);
      setDescription('');
      setNotification({
        message: channel ? 'Cập nhật kênh thành công!' : 'Tạo kênh thành công!',
        type: 'success',
      });
    } catch (err) {
      console.error('Error saving channel:', err);
      setNotification({
        message: channel ? 'Cập nhật kênh thất bại!' : 'Tạo kênh thất bại!',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVideoUploadSuccess = (newVideo: Video) => {
    setVideos((prev) => [newVideo, ...prev]);
    setShowUploadModal(false);
    setNotification({ message: 'Tải video lên thành công!', type: 'success' });
  };

  const handleVideoUploadError = (error: string) => {
    setNotification({ message: error, type: 'error' });
  };

  const handleVideoClick = (videoId: string) => {
    console.log(`Clicked video with ID: ${videoId}`);
    // Thêm điều hướng đến trang chi tiết video nếu cần
    // navigate(`/videos/${videoId}`);
  };

  if (!user) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold">Bạn chưa đăng nhập!</h1>
        <p className="mt-4">Vui lòng đăng nhập để xem kênh của bạn</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <div className="flex flex-col items-center bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6 mb-8">
        <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-gray-200 dark:border-zinc-700">
          {channel?.avatar ? (
            <img
              src={channel.avatar}
              alt="Avatar Kênh"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-red-600 flex items-center justify-center text-white text-3xl">
              {user.username.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <h1 className="text-3xl font-bold">{user.username}</h1>

        {channel ? (
          <>
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              Kênh: <strong>{channel.name}</strong>
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-center max-w-md">
              {channel.description}
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setTitle(channel.name);
                  setDescription(channel.description);
                  setShowModal(true);
                }}
                className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition"
              >
                <Edit size={18} className="mr-1" />
                Chỉnh sửa Kênh
              </button>

              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition"
              >
                <Upload size={18} className="mr-1" />
                Tải video lên
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Bạn chưa có kênh. Tạo kênh để bắt đầu!
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition"
            >
              <User size={18} className="mr-1" />
              Tạo Kênh
            </button>
          </>
        )}
      </div>

      <h2 className="text-2xl font-bold mb-4">Video của bạn</h2>

      {videos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((video) => (
            <VideoCard
              key={video._id}
              video={video}
              onClick={() => handleVideoClick(video._id!)}
              isChannelOwner={channel?.userId === user.id}
            />
          ))}
        </div>
      ) : (
        <div className="text-center p-8 bg-gray-100 dark:bg-zinc-800 rounded-lg">
          <p className="text-gray-600 dark:text-gray-300">
            {channel ? 'Bạn chưa có video nào. Hãy tải video lên!' : 'Tạo kênh để bắt đầu tải video lên!'}
          </p>
        </div>
      )}

      {/* Modal chỉnh sửa/tạo kênh */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <h2 className="text-2xl font-bold mb-6 text-center">
              {channel ? 'Chỉnh sửa Kênh' : 'Tạo Kênh'}
            </h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tên kênh
              </label>
              <input
                type="text"
                placeholder="Nhập tên kênh"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border rounded dark:bg-zinc-700 dark:text-white"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Avatar kênh
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setAvatar(e.target.files?.[0] || null)}
                className="w-full p-2 border rounded dark:bg-zinc-700 dark:text-white"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Mô tả kênh
              </label>
              <textarea
                placeholder="Nhập mô tả kênh"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border rounded dark:bg-zinc-700 dark:text-white"
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:opacity-50 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600"
                disabled={isLoading}
              >
                Hủy
              </button>
              <button
                onClick={handleSaveChannel}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? 'Đang xử lý...' : channel ? 'Lưu' : 'Tạo'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal tải lên video */}
      {showUploadModal && channel && (
        <UploadVideoForm
          channelId={channel?._id || ''}
          onClose={() => setShowUploadModal(false)}
          onUploadSuccess={handleVideoUploadSuccess}
          onUploadError={handleVideoUploadError}
        />
      )}
    </div>
  );
};

export default YourChannelPage;