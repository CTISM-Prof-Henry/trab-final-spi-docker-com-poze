import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:9079",
    withCredentials: true
});

// Flag para evitar loops múltiplos
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status !== 401 || originalRequest._retry) {
            return Promise.reject(error);
        }

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            }).then(() => {
                return api(originalRequest);
            }).catch(err => {
                return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            await api.post("/auth/refresh");
            processQueue(null);
            
            return api(originalRequest);
        } catch (refreshError) {
            processQueue(refreshError, null);
            
            if (typeof window !== "undefined") {
                document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                document.cookie = 'refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                
                const currentPath = window.location.pathname + window.location.search;
                if (currentPath !== '/login') {
                    window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
                } else {
                    window.location.href = '/login';
                }
            }
            
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);

export default api;