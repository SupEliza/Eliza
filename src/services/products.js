import axios from "axios";

const API = axios.create({    
    baseURL: "https://elizaapi.onrender.com/products",
    // baseURL: "http://localhost:8080/products",
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

async function getProducts(search){
    try {
        const response = await API.get(`/${search}`);
        return response.data;
    } catch (error) {
        return error.response?.data || error.message;
    }
}

async function editProduct(id, newDescription){
    try {
        const response = await API.post(`/edit`, { id, newDescription });
        return response.data;
    } catch (error) {
        return error.response?.data || error.message;
    }
}

export { getProducts, editProduct };