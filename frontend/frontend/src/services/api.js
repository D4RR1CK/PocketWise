 import axios from 'axios';

 const BASE_URL = 'http://192.168.43.67:8081';

 const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
 });

 api.interceptors.request.use((config) => {
    const token = global.authToken;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
 });

 export default api;