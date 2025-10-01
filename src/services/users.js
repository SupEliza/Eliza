import axios from "axios";

const API = axios.create({    
    baseURL: "https://elizaapi.onrender.com/users",
    // baseURL: "http://localhost:8080/users",

    withCredentials: true
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    console.log("📡 Bearer token enviado:", token);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

async function getUsers() {
    try {
        const response = await API.get("");
        return response.data;
    } catch (error) {
        return error.response?.data || error.message;
    }
}

async function register(params){
    try {
        const response = await API.post("/register", params);
        return response.data;
    } catch (error) {
        return error.response?.data || error.message;
    }
}

async function login(params){
    try {
        const response = await API.post("/login", params);
        return response.data;
    } catch (error) {
        return error.response?.data || error.message;
    }
}

async function deleteUser(id){
    try {
        const response = await API.post(`/delete/${id}`);
        return response.data;
    } catch (error) {
        return error.response?.data || error.message;
    }
}

async function editUserRole(params){
    try {
        const response = await API.post("/edit-role", params);
        return response.data;
    } catch (error) {
        return error.response?.data || error.message;
    }
}

async function userAuth(token) {
    try {
        const response = await API.get("/auth", {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        return error.response?.data || error.message;
    }
}

async function refreshToken(uuid) {
    try {
        const response = await API.post('/refresh-token', uuid);
        return response.data;
    } catch (error) {
        return error.response?.data || error.message;
    }
}

export { login, userAuth, refreshToken, getUsers, editUserRole, register, deleteUser };