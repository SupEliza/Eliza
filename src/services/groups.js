import axios from "axios";

const API = axios.create({    
    baseURL: "https://elizaapi.onrender.com/groups",
    // baseURL: "http://localhost:8080/groups",
    withCredentials: true,
});

async function getGroups(){
    try {
        const response = await API.get("");
        return response.data;
    } catch (error) {
        return error.response?.data || error.message;
    }
}

export { getGroups };