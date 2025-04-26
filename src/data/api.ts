
const BASE_URL = 'http://localhost:5000/api/v1';

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
    data?: { token: string };
}

export const login = async (credentials: LoginCredentials): Promise<ApiResponse> => {
    try {
        const response = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        const data = await response.json();
        if (!response.ok) {
            return {
                success: false,
                message: data.message || 'Login failed',
            };
        }

        return {
            success: true,
            data,
        };
    } catch {
        return {
            success: false,
            message: 'An error occurred while logging in',
        };
    }
};

export const register = async (credentials: RegisterCredentials): Promise<ApiResponse> => {
    try {
        const response = await fetch(`${BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        const data = await response.json();
        if (!response.ok) {
            return {
                success: false,
                message: data.message || 'Registration failed',
            };
        }

        return {
            success: true,
            data,
        };
    } catch {
        return {
            success: false,
            message: 'An error occurred while registering',
        };
    }
};