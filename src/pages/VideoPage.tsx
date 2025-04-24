import React from 'react';
import { ThumbsUp, ThumbsDown, Share, Download, Plus, Flag } from 'lucide-react';
import VideoCard from '../components/ui/VideoCard';
import { videos } from '../data/mockData';

interface VideoPageProps {
  videoId: string | null;
  onVideoClick: (videoId: string) => void;
}

const VideoPage: React.FC<VideoPageProps> = ({ videoId, onVideoClick }) => {
  const currentVideo = videos.find(video => video.id === videoId);
  
  if (!currentVideo) {
    return <div className="p-4">Video not found</div>;
  }

  const relatedVideos = videos.filter(video => video.id !== videoId);

  return (
    <div className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        {/* Video Player */}
        <div className="w-full aspect-video bg-black rounded-lg overflow-hidden mb-4">
          <div className="w-full h-full flex items-center justify-center text-white">
            <div className="text-center p-4">
              <p className="text-lg font-medium mb-2">Video Player</p>
              <p className="text-sm text-gray-300">This is a placeholder for the video player.</p>
              <p className="text-sm text-gray-300 mt-1">Video ID: {currentVideo.id}</p>
            </div>
          </div>
        </div>

        {/* Video Info */}
        <div className="mb-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {currentVideo.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between mt-2 pb-4 border-b border-gray-200 dark:border-zinc-700">
            <div className="flex items-center">
              <img 
                src={currentVideo.channelAvatar}
                alt={currentVideo.channelName}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  {currentVideo.channelName}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  582K subscribers
                </p>
              </div>
              <button className="ml-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm font-medium">
                Subscribe
              </button>
            </div>

            <div className="flex mt-3 sm:mt-0">
              <div className="flex items-center bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <button className="flex items-center px-4 py-2 hover:bg-gray-200 dark:hover:bg-zinc-700">
                  <ThumbsUp className="w-5 h-5 mr-2 text-gray-700 dark:text-gray-300" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{currentVideo.likes}</span>
                </button>
                <div className="h-6 border-l border-gray-300 dark:border-zinc-600"></div>
                <button className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-zinc-700">
                  <ThumbsDown className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </button>
              </div>

              <button className="ml-2 flex items-center px-4 py-2 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-full">
                <Share className="w-5 h-5 mr-2 text-gray-700 dark:text-gray-300" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Share</span>
              </button>

              <button className="ml-2 flex items-center px-4 py-2 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-full">
                <Download className="w-5 h-5 mr-2 text-gray-700 dark:text-gray-300" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:inline">Download</span>
              </button>

              <button className="ml-2 p-2 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-full">
                <Plus className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>

              <button className="ml-2 p-2 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-full">
                <Flag className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>
            </div>
          </div>

          {/* Video description */}
          <div className="mt-4 p-3 bg-gray-100 dark:bg-zinc-800 rounded-lg">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span className="font-medium mr-2">{currentVideo.views} views</span>
              <span>{currentVideo.uploadTime}</span>
              <div className="flex ml-2">
                {currentVideo.tags.map((tag, index) => (
                  <span key={index} className="mr-1 text-blue-600 dark:text-blue-400">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-800 dark:text-gray-200">
              {currentVideo.description}
            </p>
            <button className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-2">
              Show more
            </button>
          </div>
        </div>

        {/* Comments Section (placeholder) */}
        <div className="mt-6 border-t border-gray-200 dark:border-zinc-700 pt-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Comments • 1.4K
            </h3>
            <button className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
              Sort by
            </button>
          </div>
          
          {/* Add a comment */}
          <div className="flex items-start mb-6">
            <img 
              src="https://randomuser.me/api/portraits/men/72.jpg"
              alt="Your profile"
              className="w-10 h-10 rounded-full mr-3"
            />
            <div className="flex-1">
              <input 
                type="text" 
                placeholder="Add a comment..."
                className="w-full px-2 py-1 border-b border-gray-200 dark:border-zinc-700 bg-transparent text-gray-800 dark:text-gray-200 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Comment examples */}
          <div className="space-y-4">
            {[1, 2, 3].map((comment) => (
              <div key={comment} className="flex items-start">
                <img 
                  src={`https://randomuser.me/api/portraits/${comment % 2 === 0 ? 'women' : 'men'}/${20 + comment}.jpg`}
                  alt="Commenter"
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">User {comment}</span>
                    <span className="ml-2 text-xs text-gray-600 dark:text-gray-400">{comment} months ago</span>
                  </div>
                  <p className="text-sm text-gray-800 dark:text-gray-200 mt-1">
                    This is a great video! Lorem ipsum dolor sit amet, consectetur adipiscing elit. Thanks for sharing your knowledge!
                  </p>
                  <div className="flex items-center mt-1">
                    <button className="flex items-center mr-4">
                      <ThumbsUp className="w-4 h-4 mr-1 text-gray-600 dark:text-gray-400" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">{42 * comment}</span>
                    </button>
                    <button className="mr-4">
                      <ThumbsDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </button>
                    <button className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related Videos */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Related Videos
        </h3>
        <div className="space-y-4">
          {relatedVideos.slice(0, 10).map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onClick={onVideoClick}
              compact={true}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoPage;