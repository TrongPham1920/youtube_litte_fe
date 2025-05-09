import React, { useEffect, useState } from 'react';
import { getVideoById, getAllVideos, Video, Channel } from '../data/api/app/api';

interface VideoPageProps {
  videoId: string;
  onVideoClick: (videoId: string) => void;
}

const isChannel = (channelId: string | Channel | undefined): channelId is Channel => {
  if (typeof channelId !== 'object' || channelId === null) {
    return false;
  }
  const channel = channelId as Channel;
  return (
    typeof channel.name === 'string' &&
    typeof channel.description === 'string'
  );
};

const VideoPage: React.FC<VideoPageProps> = ({ videoId, onVideoClick }) => {
  const [video, setVideo] = useState<Video | null>(null);
  const [allVideos, setAllVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const fetchedVideo = await getVideoById(videoId);
        console.log('Fetched video:', JSON.stringify(fetchedVideo, null, 2)); // Log chi tiết
        setVideo(fetchedVideo);
      } catch (error) {
        console.error('Error fetching video:', error);
      }
    };

    const fetchAllVideos = async () => {
      try {
        const fetchedVideos = await getAllVideos();
        console.log('Fetched all videos:', JSON.stringify(fetchedVideos, null, 2)); // Log chi tiết
        fetchedVideos.forEach((video, index) => {
          console.log(`Video ${index + 1} channelId:`, JSON.stringify(video.channelId, null, 2));
        });
        setAllVideos(fetchedVideos);
      } catch (error) {
        console.error('Error fetching all videos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideo();
    fetchAllVideos();
  }, [videoId]);

  if (!video) return <div className="p-4 text-center">Loading...</div>;

  return (
    <div className="video-page flex min-h-screen">
      {/* Video chính */}
      <div className="main-video w-3/4 p-4">
        <video src={video.videoUrl} width="100%" controls className="rounded-lg" />
        <h1 className="text-2xl font-semibold mt-4">{video.title}</h1>
        {isChannel(video.channelId) ? (
          <div className="flex items-center mt-2">
            {video.channelId.avatar ? (
              <img
                src={video.channelId.avatar}
                alt={`${video.channelId.name} avatar`}
                className="w-10 h-10 rounded-full mr-2 object-cover"
                // onError={() => console.log(`Failed to load avatar for ${video.channelId.name}`)}
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-2">
                <span className="text-lg font-medium">
                  {video.channelId.name?.charAt(0).toUpperCase() || 'C'}
                </span>
              </div>
            )}
            <span className="text-lg font-medium">{video.channelId.name}</span>
          </div>
        ) : (
          <p className="text-gray-600 mt-2">
            Channel info not available (channelId: {String(video.channelId)})
          </p>
        )}
        {video.description && (
          <p className="text-gray-600 dark:text-gray-300 mt-2">{video.description}</p>
        )}
      </div>

      {/* Danh sách tất cả video bên phải */}
      <div className="all-videos w-1/4 p-4 space-y-4 bg-gray-100 dark:bg-zinc-800">
        <h2 className="text-xl font-semibold">All Videos</h2>
        {isLoading ? (
          <p className="text-gray-600 dark:text-gray-300">Loading videos...</p>
        ) : allVideos.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">No videos available</p>
        ) : (
          allVideos.map((video) => (
            <div
              key={video._id}
              className="all-video flex cursor-pointer hover:bg-gray-200 dark:hover:bg-zinc-700 p-2 rounded-lg transition"
              onClick={() => {
                if (typeof video._id === 'string') {
                  onVideoClick(video._id);
                }
              }}
            >
              <div className="w-32 h-18 rounded-lg overflow-hidden mr-4">
                <video
                  src={video.videoUrl}
                  width="100%"
                  height="100%"
                  className="object-cover"
                  muted
                  onMouseOver={(e) => e.currentTarget.play()}
                  onMouseOut={(e) => e.currentTarget.pause()}
                />
              </div>
              <div className="video-info flex-1">
                <h3 className="text-sm font-medium line-clamp-2">{video.title}</h3>
                {isChannel(video.channelId) ? (
                  <div className="flex items-center mt-1">
                    {video.channelId.avatar ? (
                      <img
                        src={video.channelId.avatar}
                        alt={`${video.channelId.name} avatar`}
                        className="w-6 h-6 rounded-full mr-1 object-cover"
                        // onError={() => console.log(`Failed to load avatar for ${video.channelId.name}`)}
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center mr-1">
                        <span className="text-xs font-medium">
                          {video.channelId.name?.charAt(0).toUpperCase() || 'C'}
                        </span>
                      </div>
                    )}
                    <span className="text-xs text-gray-600 dark:text-gray-300">
                      {video.channelId.name}
                    </span>
                  </div>
                ) : (
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    Channel info not available (channelId: {String(video.channelId)})
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VideoPage;