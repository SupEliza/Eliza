import axios from "axios";

const API = axios.create({    
    baseURL: "https://elizaapi.onrender.com/roles",
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

async function getRoles(){
    try {
        const response = await API.get("");
        return response.data;
    } catch (error) {
        return error.response?.data || error.message;
    }
}

async function addRole(newRoleName, permissions){
    try {
        const response = await API.post("/add", { newRoleName, permissions });
        return response.data;
    } catch (error) {
        return error.response?.data || error.message;
    }
}

async function editRole(roleName, newPermissions){
    try {
        const response = await API.post("/edit", { roleName, newPermissions });
        return response.data;
    } catch (error) {
        return error.response?.data || error.message;
    }
}

async function deleteRole(id){
    try {
        const response = await API.post(`/delete/${id}`);
        return response.data;
    } catch (error) {
        return error.response?.data || error.message;
    }
}

async function getPermissions(){
    try {
        const response = await API.get(`/permissions`);
        return response.data;
    } catch (error) {
        return error.response?.data || error.message;
    }
}

export { getRoles, deleteRole, getPermissions, addRole, editRole };