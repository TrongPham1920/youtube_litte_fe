import React from 'react';
import { Video } from '../../types';

interface VideoCardProps {
  video: Video;
  onClick: (videoId: string) => void;
  compact?: boolean;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onClick, compact = false }) => {
  const { id, title, thumbnail, channelName, channelAvatar, views, uploadTime, duration } = video;

  const handleClick = () => {
    onClick(id);
  };

  if (compact) {
    return (
      <div 
        className="flex mb-3 cursor-pointer group"
        onClick={handleClick}
      >
        <div className="relative flex-shrink-0 w-40 h-24 bg-gray-200 dark:bg-zinc-800 rounded-lg overflow-hidden mr-2">
          <img 
            src={thumbnail} 
            alt={title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-xs px-1 py-0.5 rounded">
            {duration}
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium line-clamp-2 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
            {title}
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {channelName}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {views} views • {uploadTime}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="cursor-pointer group"
      onClick={handleClick}
    >
      <div className="relative w-full aspect-video bg-gray-200 dark:bg-zinc-800 rounded-lg overflow-hidden mb-2">
        <img 
          src={thumbnail} 
          alt={title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-xs px-1 py-0.5 rounded">
          {duration}
        </div>
      </div>
      <div className="flex mt-2">
        <div className="flex-shrink-0 mr-3">
          <img 
            src={channelAvatar} 
            alt={channelName} 
            className="w-9 h-9 rounded-full"
          />
        </div>
        <div>
          <h3 className="text-sm font-medium line-clamp-2 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
            {title}
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {channelName}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {views} views • {uploadTime}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;