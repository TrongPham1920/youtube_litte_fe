import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

interface UploadedVideo {
  title: string;
  avatarUrl: string;
  videoUrl: string;
  description: string;
}

const YourChannelPage = () => {
  const { user } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [uploadedVideos, setUploadedVideos] = useState<UploadedVideo[]>([]);

  if (!user) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold">Bạn chưa đăng nhập!</h1>
      </div>
    );
  }

  const handleCreateChannel = () => {
    if (!video || !avatar) {
      alert('Vui lòng chọn avatar và video!');
      return;
    }

    const newVideo: UploadedVideo = {
      title,
      avatarUrl: URL.createObjectURL(avatar),
      videoUrl: URL.createObjectURL(video),
      description,
    };

    setUploadedVideos((prev) => [...prev, newVideo]);

    // Reset modal fields
    setTitle('');
    setAvatar(null);
    setVideo(null);
    setDescription('');
    setShowModal(false);
  };

  return (
    <div className="p-8">
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center text-white text-3xl mb-4">
          {user.username.charAt(0).toUpperCase()}
        </div>
        <h1 className="text-3xl font-bold">{user.username}</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">Chào mừng bạn đến với kênh của mình!</p>

        {/* Button Tạo Kênh */}
        <button 
          onClick={() => setShowModal(true)}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full mb-8"
        >
          Tạo Kênh
        </button>

        {/* Danh sách Video */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {uploadedVideos.map((videoItem, index) => (
            <div key={index} className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-4">
              {/* Avatar */}
              <img
                src={videoItem.avatarUrl}
                alt="Avatar"
                className="w-16 h-16 rounded-full mb-4 object-cover mx-auto"
              />
              {/* Video */}
              <video
                controls
                src={videoItem.videoUrl}
                className="w-full rounded-lg mb-4"
              />
              {/* Title */}
              <h2 className="text-lg font-bold text-center text-black dark:text-white">{videoItem.title}</h2>
              {/* Description */}
              <p className="text-sm text-center text-gray-600 dark:text-gray-300 mt-2">{videoItem.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 w-96 relative">
            <h2 className="text-2xl font-bold mb-4 text-center">Tạo Kênh</h2>

            {/* Title */}
            <input
              type="text"
              placeholder="Tên kênh"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mb-4 p-2 border rounded dark:bg-zinc-700 dark:text-white"
            />

            {/* Avatar */}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatar(e.target.files ? e.target.files[0] : null)}
              className="w-full mb-4 p-2 border rounded dark:bg-zinc-700 dark:text-white"
            />

            {/* Upload Video */}
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideo(e.target.files ? e.target.files[0] : null)}
              className="w-full mb-4 p-2 border rounded dark:bg-zinc-700 dark:text-white"
            />

            {/* Description */}
            <textarea
              placeholder="Mô tả kênh"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full mb-4 p-2 border rounded dark:bg-zinc-700 dark:text-white"
              rows={3}
            />

            {/* Buttons */}
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
              >
                Hủy
              </button>
              <button
                onClick={handleCreateChannel}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Tạo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default YourChannelPage;
