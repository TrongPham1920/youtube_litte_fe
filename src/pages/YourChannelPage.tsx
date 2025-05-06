import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
  Channel,
  createChannel,
  getChannelByUserId,
  updateChannel,
  Video,
  getVideosByChannelId,
} from '../data/api/app/api';
import UploadVideoForm from '../components/ui/UploadVideoForm';
import VideoCard from '../components/ui/VideoCard';

const YourChannelPage = () => {
  const { user } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [channel, setChannel] = useState<Channel | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);

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
      alert('Vui lòng nhập đầy đủ thông tin kênh!');
      return;
    }

    const avatarUrl = avatar ? URL.createObjectURL(avatar) : channel?.avatar || '';

    const newChannelData: Channel = {
      name: title,
      description,
      avatar: avatarUrl,
      userId: user?.id,
    };

    try {
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
    } catch (err) {
      console.error(err);
      alert(channel ? 'Cập nhật kênh thất bại!' : 'Tạo kênh thất bại!');
    }
  };

  const handleVideoUploadSuccess = (newVideo: Video) => {
    setVideos((prev) => [newVideo, ...prev]);
    setShowUploadModal(false);
  };

  const handleVideoClick = (videoId: string) => {
    console.log(`Clicked video with ID: ${videoId}`);
    // Add navigation or other click handling logic here if needed
  };

  if (!user) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold">Bạn chưa đăng nhập!</h1>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
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
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {channel.description}
            </p>
            <button
              onClick={() => {
                setTitle(channel.name);
                setDescription(channel.description);
                setShowModal(true);
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full mb-4"
            >
              Chỉnh sửa Kênh
            </button>

            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full mb-8"
            >
              Tải video lên
            </button>
          </>
        ) : (
          <>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Bạn chưa có kênh. Tạo kênh để bắt đầu!
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full mb-8"
            >
              Tạo Kênh
            </button>
          </>
        )}
      </div>

      {/* Danh sách video */}
      {videos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {videos.map((video) => (
            <VideoCard
              key={video._id}
              video={video}
              onClick={() => handleVideoClick(video._id!)}
              isChannelOwner={channel?.userId === user.id} // Pass ownership status
            />
          ))}
        </div>
      )}

      {/* Modal tạo/chỉnh sửa kênh */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 w-96 relative">
            <h2 className="text-2xl font-bold mb-4 text-center">
              {channel ? 'Chỉnh sửa Kênh' : 'Tạo Kênh'}
            </h2>

            <input
              type="text"
              placeholder="Tên kênh"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mb-4 p-2 border rounded dark:bg-zinc-700 dark:text-white"
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatar(e.target.files?.[0] || null)}
              className="w-full mb-4 p-2 border rounded dark:bg-zinc-700 dark:text-white"
            />

            <textarea
              placeholder="Mô tả kênh"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full mb-4 p-2 border rounded dark:bg-zinc-700 dark:text-white"
              rows={3}
            />

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveChannel}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                {channel ? 'Lưu' : 'Tạo'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal upload video */}
      {showUploadModal && channel && (
        <UploadVideoForm
          channelId={channel?._id || ''}
          onClose={() => setShowUploadModal(false)}
          onUploadSuccess={handleVideoUploadSuccess}
        />
      )}
    </div>
  );
};

export default YourChannelPage;