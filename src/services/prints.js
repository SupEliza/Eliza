import axios from "axios";

const API = axios.create({    
    baseURL: "https://elizaapi.onrender.com/prints",
    // baseURL: "http://localhost:8080/roles",
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

async function getPrints(limit){
    try {
        const response = await API.get(`/false/${limit}`);
        return response.data;
    } catch (error) {
        return error.response?.data || error.message;
    }
}

export { getPrints };