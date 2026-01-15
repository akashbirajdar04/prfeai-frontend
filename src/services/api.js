import axios from 'axios';

const getBaseURL = () => {
    const envUrl = import.meta.env.VITE_API_URL;
    const fallback = 'https://prfeai-backend.onrender.com/api';

    if (envUrl) {
        return envUrl.endsWith('/api') ? envUrl : `${envUrl.replace(/\/$/, '')}/api`;
    }
    return fallback;
};

const baseURL = getBaseURL();
console.log('[API Config] Resolving baseURL:', {
    VITE_API_URL: import.meta.env.VITE_API_URL,
    resolvedBaseURL: baseURL,
    isProduction: import.meta.env.PROD
});

const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 second timeout
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log(`[API Request] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
        return config;
    },
    (error) => {
        console.error('[API Request Error]', error);
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        console.log(`[API Response] ${response.status} from ${response.config.url}`);
        return response;
    },
    (error) => {
        console.error('[API Response Error]', {
            url: error.config?.url,
            status: error.response?.status,
            message: error.message,
            data: error.response?.data
        });
        return Promise.reject(error);
    }
);

export default api;
