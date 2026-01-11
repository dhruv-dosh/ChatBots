import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authApi = {
    login: (email: string, password: string) => api.post('/auth/login', { email, password }),
    register: (email: string, password: string) => api.post('/auth/register', { email, password }),
};

export const documentApi = {
    upload: (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/documents/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
    list: () => api.get('/documents'),
};

export const chatbotApi = {
    create: (data: { name: string; document_id: string }) => api.post('/chatbots', data),
    list: () => api.get('/chatbots'),
};

export const chatApi = {
    sendMessage: (chatbotId: string, message: string) => api.post(`/chat/${chatbotId}`, { message }),
    getHistory: (chatbotId: string) => api.get(`/chat/${chatbotId}/history`),
};

export default api;
