import axios from "axios";

const API = axios.create({    
    baseURL: "https://elizaapi.onrender.com/permissions",
    // baseURL: "http://localhost:8080/roles",
    withCredentials: true,
});

async function getPerms(){
    try {
        const response = await API.get("");
        return response.data;
    } catch (error) {
        return error.response?.data || error.message;
    }
}

export { getPerms };