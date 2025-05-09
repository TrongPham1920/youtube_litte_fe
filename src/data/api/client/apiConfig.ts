// apiConfig.ts

export const API_PATH = {
  LOGIN: getPath("login"),
  REGISTER: getPath("register"),
  VIDEOS: getPath("videos"),
  VIDEO_BY_ID: (id: string) => getPath(`videos/${id}`),

  CHANNELS: getPath("channels"),
  CHANNEL_BY_ID: (id: string) => getPath(`channels/${id}`),
  CHANNEL_BY_USER_ID: (userId: string) => getPath(`channels/user/${userId}`),
  VIDEOS_BY_CHANNEL: (channelId: string) => `videos/channel/${channelId}`,
  UPLOAD_IMAGE: getPath("upload-image"),
};

function getPath(path: string): string {
  return `http://14.225.212.252:5000/api/v1/${path}`;
}

export default API_PATH;
