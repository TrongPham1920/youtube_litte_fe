import React, { useEffect, useState } from 'react';
import { getVideoById, getAllVideos, Video } from '../data/api/app/api'; // Giả định bạn đã tạo API để lấy video

interface VideoPageProps {
  videoId: string;
  onVideoClick: (videoId: string) => void; // Dùng nếu muốn click video khác
}

const VideoPage: React.FC<VideoPageProps> = ({ videoId, onVideoClick }) => {
  const [video, setVideo] = useState<Video | null>(null);
  const [allVideos, setAllVideos] = useState<Video[]>([]);

  useEffect(() => {
    const fetchVideo = async () => {
      const fetchedVideo = await getVideoById(videoId);
      setVideo(fetchedVideo);
    };

    const fetchAllVideos = async () => {
      const fetchedVideos = await getAllVideos();
      setAllVideos(fetchedVideos);
    };

    fetchVideo();
    fetchAllVideos();
  }, [videoId]);

  if (!video) return <div>Loading...</div>;

  return (
    <div className="video-page flex">
      {/* Video chính */}
      <div className="main-video w-3/4 p-4">
        <video src={video.videoUrl} width="100%" controls />
        <h1 className="text-2xl font-semibold mt-4">{video.title}</h1>
        {video.description && <p className="text-gray-600 mt-2">{video.description}</p>}
      </div>

      {/* Danh sách tất cả video bên phải */}
      <div className="all-videos w-1/4 p-4 space-y-4">
        <h2 className="text-xl font-semibold">All Videos</h2>
        {allVideos.map((video) => (
          <div
            key={video._id} // Sử dụng video._id trong key, không phải trong tham số videoId
            className="all-video flex cursor-pointer"
            onClick={() => {
              // Kiểm tra nếu video._id là string trước khi gọi onVideoClick
              if (typeof video._id === 'string') {
                onVideoClick(video._id); // Chỉ gọi onVideoClick nếu video._id là một chuỗi hợp lệ
              }
            }}
          >
            <div className="w-32 h-18 bg-gray-200 dark:bg-zinc-800 rounded-lg mr-4">
              <video src={video.videoUrl} width="100%" height="100" controls />
            </div>
            <div className="video-info">
              <h3 className="text-sm font-medium">{video.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoPage;
