import axios from "axios";

const API = axios.create({
    baseURL: "https://elizaapi.onrender.com/codes",
});

// Interceptor para adicionar o token Bearer automaticamente
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

async function getCodes(limit){
    try {
        const response = await API.get(`/get/${limit}`);
        return response.data;
    } catch (error) {
        return error.response?.data || error.message;
    }
}

async function getDeletedCodes(limit){
    try {
        const response = await API.get(`/deleted/${limit}`);
        return response.data;
    } catch (error) {
        return error.response?.data || error.message;
    }
}

async function addCode(params){
    try {
        const response = await API.post("/add", params);
        return response.data;
    } catch (error) {
        return error.response?.data || error.message;
    }
}

async function moveCodeToBin(id){
    try {
        const response = await API.post(`/bin/add/${id}`);
        return response.data;
    } catch (error) {
        return error.response?.data || error.message;
    }
}

async function remCodeFromBin(id){
    try {
        const response = await API.post(`/bin/remove/${id}`);
        return response.data;
    } catch (error) {
        return error.response?.data || error.message;
    }
}

async function deleteCode(id){
    try {
        const response = await API.post(`/bin/delete/${id}`);
        return response.data;
    } catch (error) {
        return error.response?.data || error.message;
    }
}

async function cleanCodes(){
    try {
        const response = await API.post(`/clean`);
        return response.data;
    } catch (error) {
        return error.response?.data || error.message;
    }
}

export { getCodes, moveCodeToBin, deleteCode, remCodeFromBin, addCode, cleanCodes, getDeletedCodes };