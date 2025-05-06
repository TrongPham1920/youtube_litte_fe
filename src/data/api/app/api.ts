// api.ts

import API_PATH from "../client/apiConfig";

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    username: string;
    email: string;
    password: string;
}

export interface ApiResponse {
    success: boolean;
    message?: string;
    token?: string;
    user?: {
        id: string;
        username: string;
    };
}
export interface Video {
    _id?: string;
    title: string;
    description?: string;
    videoUrl: string;
    channelId: string;
}
export interface Channel {
    _id?: string;
    name: string;
    description: string;
    avatar?: string;
    userId?: string;
}

// Function to handle API response
const handleApiResponse = async (response: Response) => {
    const data = await response.json();
    return response.ok ? { success: true, ...data } : { success: false, message: data.message };
};

// Login function
export const login = async (credentials: LoginCredentials): Promise<ApiResponse> => {
    try {
        const response = await fetch(API_PATH.LOGIN, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });
        return await handleApiResponse(response);
    } catch {
        return { success: false };
    }
};

// Register function
export const register = async (credentials: RegisterCredentials): Promise<ApiResponse> => {
    try {
        const response = await fetch(API_PATH.LOGIN, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });
        return await handleApiResponse(response);
    } catch {
        return { success: false };
    }
};
// Get all videos
export const getAllVideos = async (): Promise<Video[]> => {
    const response = await fetch(API_PATH.VIDEOS);
    return response.json();
};

// Get video by ID
export const getVideoById = async (id: string): Promise<Video> => {
    const response = await fetch(API_PATH.VIDEO_BY_ID(id));
    return response.json();
};

// Create a new video
export const createVideo = async (video: Video): Promise<Video> => {
    const response = await fetch(API_PATH.VIDEOS, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(video),
    });

    if (!response.ok) throw new Error("Failed to create video");

    return response.json();
};
// Delete a video
export const deleteVideo = async (id: string): Promise<{ message: string }> => {
    const response = await fetch(API_PATH.VIDEO_BY_ID(id), {
        method: 'DELETE',
    });

    if (!response.ok) throw new Error("Failed to delete video");

    return response.json();
};

// Update a video
export const updateVideo = async (id: string, video: Partial<Video>): Promise<Video> => {
    const response = await fetch(API_PATH.VIDEO_BY_ID(id), {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(video),
    });

    if (!response.ok) throw new Error("Failed to update video");

    return response.json();
};
// Get all channels
export const getAllChannels = async (): Promise<Channel[]> => {
    const response = await fetch(API_PATH.CHANNELS);
    return response.json();
};

// Get channel by ID
export const getChannelById = async (id: string): Promise<Channel> => {
    const response = await fetch(API_PATH.CHANNEL_BY_ID(id));
    return response.json();
};

// Create a new channel
export const createChannel = async (channel: Channel): Promise<Channel> => {
    const response = await fetch(API_PATH.CHANNELS, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(channel),
    });

    if (!response.ok) throw new Error("Failed to create channel");

    return response.json();
};

// Update a channel
export const updateChannel = async (id: string, channel: Channel): Promise<Channel> => {
    const response = await fetch(API_PATH.CHANNEL_BY_ID(id), {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(channel),
    });

    if (!response.ok) throw new Error("Failed to update channel");

    return response.json();
};

// Delete a channel
export const deleteChannel = async (id: string): Promise<{ message: string }> => {
    const response = await fetch(API_PATH.CHANNEL_BY_ID(id), {
        method: 'DELETE',
    });

    if (!response.ok) throw new Error("Failed to delete channel");

    return response.json();
};
// api.ts
export const getChannelByUserId = async (userId: string): Promise<Channel | null> => {
    const response = await fetch(`${API_PATH.CHANNEL_BY_USER_ID(userId)}`);
    if (!response.ok) return null;
    return response.json();
};
// Upload chunk of video
export const uploadChunk = async (formData: FormData): Promise<{ message: string }> => {
    const response = await fetch("http://localhost:5000/upload-chunk", {
        method: "POST",
        body: formData,
    });

    if (!response.ok) throw new Error("Failed to upload chunk");

    return response.json();
};

// Merge chunks and upload to Cloudinary
export const mergeChunks = async (filename: string, totalChunks: number): Promise<{ message: string; videoUrl: string }> => {
    const response = await fetch("http://localhost:5000/merge-chunks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ filename, totalChunks }),
    });

    if (!response.ok) throw new Error("Failed to merge and upload video");

    return response.json();
};

export const getVideosByChannelId = async (channelId: string): Promise<Video[]> => {
    const response = await fetch(`http://localhost:5000/videos/channel/${channelId}`); // Directly using the full path
    if (!response.ok) {
        throw new Error('Failed to fetch videos');
    }
    return response.json();
};
