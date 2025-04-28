// apiConfig.ts

export const API_PATH = {
    LOGIN: getPath("login"),
    REGISTER: getPath("register"),
};

function getPath(path: string): string {
    return `http://localhost:5000/api/v1/${path}`;
}

export default API_PATH;
