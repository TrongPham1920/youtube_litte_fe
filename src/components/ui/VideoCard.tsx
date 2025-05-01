// ui/VideoCard.tsx
import React from 'react';
import { Video } from '../../data/api/app/api';


interface VideoCardProps {
  video: Video;
  onClick: () => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onClick }) => {
  return (
    <div className="video-card" onClick={onClick} style={{ cursor: 'pointer' }}>
      <video src={video.videoUrl} width="200" height="120" controls />
      <h3 className="text-sm font-medium text-gray-900">{video.title}</h3>
      <p className="text-xs text-gray-600">{video.description}</p>
    </div>
  );
};

export default VideoCard;
