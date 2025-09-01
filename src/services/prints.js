import axios from "axios";

const API = axios.create({    
    baseURL: "https://elizaapi.onrender.com/prints",
    // baseURL: "http://localhost:8080/prints",
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
        const response = await API.get(`/${limit}`);
        return response.data;
    } catch (error) {
        return error.response?.data || error.message;
    }
}

async function addPrint(reqBody){
    try {
        const response = await API.post(`/add-print`, reqBody);
        return response.data;
    } catch (error) {
        return error.response?.data || error.message;
    }
}

export { getPrints, addPrint };