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
        const response = await fetch(API_PATH.LOGIN, { // Cập nhật đường dẫn API cho đăng ký
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
