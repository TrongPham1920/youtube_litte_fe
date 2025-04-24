import React, { useState } from 'react';
import VideoCard from '../components/ui/VideoCard';
import { videos, categories } from '../data/mockData';

interface HomePageProps {
  onVideoClick: (videoId: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onVideoClick }) => {
  const [selectedCategory, setSelectedCategory] = useState('1'); // Default to 'All'

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

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
        {videos.map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            onClick={onVideoClick}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage;