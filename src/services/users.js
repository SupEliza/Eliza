import axios from "axios";

const API = axios.create({    
    baseURL: "https://elizaapi.onrender.com/users",
    // baseURL: "http://localhost:8080/users",
    withCredentials: true,
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

async function setPerms(params){
    try {
        const response = await API.post("/set-perm", params);
        return response.data;
    } catch (error) {
        return error.response?.data || error.message;
    }
}

async function userLogout(uuid) {
    try {
        const response = await API.post(`/logout/${uuid}`);
        return response.data;
    } catch (error) {
        return error.response?.data || error.message;
    }
}

async function userAuth() {
    try {
        const response = await API.get("/auth");
        return response.data;
    } catch (error) {
        return error.response?.data || error.message;
    }
}

async function refreshToken(uuid) {
    try {
        const response = await API.post(`/refresh-token/${uuid}`);
        return response.data;
    } catch (error) {
        return error.response?.data || error.message;
    }
}

export { login, userAuth, refreshToken, userLogout, getUsers, setPerms, register, deleteUser };