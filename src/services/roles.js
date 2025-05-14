import axios from "axios";

const API = axios.create({    
    baseURL: "https://elizaapi.onrender.com/roles",
    // baseURL: "http://localhost:8080/roles",
    withCredentials: true,
});

async function getRoles(){
    try {
        const response = await API.get("");
        return response.data;
    } catch (error) {
        return error.response?.data || error.message;
    }
}

export { getRoles };