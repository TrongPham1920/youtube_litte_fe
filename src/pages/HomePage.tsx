import React, { useState, useEffect } from 'react';
import VideoCard from '../components/ui/VideoCard';
import { getAllVideos, Video, getChannelByUserId } from '../data/api/app/api'; // Thêm getChannelByUserId
import { categories } from '../data/mockData'; // vẫn dùng category mock

interface HomePageProps {
  onVideoClick: (videoId: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onVideoClick }) => {
  const [selectedCategory, setSelectedCategory] = useState('1'); // Default to 'All'
  const [videos, setVideos] = useState<Video[]>([]);
  const [userChannelId, setUserChannelId] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const data = await getAllVideos();
        setVideos(data);
      } catch (err) {
        console.error('Error fetching videos:', err);
      }
    };

    // Lấy channel ID của người dùng hiện tại (nếu đã đăng nhập)
    const fetchUserChannel = async () => {
      try {
        // Lấy userId từ localStorage hoặc context/redux state
        const userId = localStorage.getItem('userId'); // hoặc từ context của bạn
        
        if (userId) {
          const channel = await getChannelByUserId(userId);
          if (channel && channel._id) {
            setUserChannelId(channel._id);
          }
        }
      } catch (err) {
        console.error('Error fetching user channel:', err);
      }
    };

    fetchVideos();
    fetchUserChannel();
  }, []);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  // Giả định mỗi video có video.categoryId (nếu backend có field này)
  const filteredVideos =
    selectedCategory === '1'
      ? videos
      : videos.filter((video) => {
          // Kiểm tra xem channelId có phải là object hay string
          if (typeof video.channelId === 'object' && video.channelId && '_id' in video.channelId) {
            return video.channelId._id === selectedCategory;
          }
          return video.channelId === selectedCategory;
        }); // hoặc video.categoryId nếu backend có

  return (
    <div className="p-4 md:p-6">
      {/* Categories */}
      <div className="mb-6 overflow-x-auto pb-2 -mx-4 px-4">
        <div className="flex space-x-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap
                ${selectedCategory === category.id
                  ? 'bg-black text-white dark:bg-white dark:text-black'
                  : 'bg-gray-200 text-gray-800 dark:bg-zinc-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-zinc-700'
                }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
      {/* Videos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredVideos.map((video) => {
          // Kiểm tra xem người dùng có phải là chủ của channel này không
          let isOwner = false;
          
          if (userChannelId) {
            if (typeof video.channelId === 'object' && video.channelId && '_id' in video.channelId) {
              isOwner = video.channelId._id === userChannelId;
            } else {
              isOwner = video.channelId === userChannelId;
            }
          }
          
          return (
            <VideoCard
              key={video._id}
              video={video}
              onClick={() => onVideoClick(video._id!)}
              isChannelOwner={isOwner}
            />
          );
        })}
      </div>
    </div>
  );
};

export default HomePage;