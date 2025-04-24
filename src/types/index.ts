export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  channelName: string;
  channelAvatar: string;
  views: string;
  likes: string;
  uploadTime: string;
  duration: string;
  tags: string[];
}

export interface Category {
  id: string;
  name: string;
}