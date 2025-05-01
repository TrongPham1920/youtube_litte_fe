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