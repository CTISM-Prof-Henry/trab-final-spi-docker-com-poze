import axios from "axios";

const api = axios.create({
    baseURL: process.env.BACKEND_URL,
    withCredentials: true
});

api.interceptors.response.use(
    (res) => res,
    async (err) => {
        const original = err.config;

        if (err.response.status === 401 && !original.retry) {
            original.retry = true;
            try {
                await api.post("auth/refresh");
                return api(original); // Refaz o request original.
            } catch (refreshError) {
                console.error(refreshError);
                if (typeof window !== "undefined") {
                    window.location.href = "/login";
                }
            }
        }

        return Promise.reject(err);
    }
);

export default api;