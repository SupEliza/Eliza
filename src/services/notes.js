import axios from "axios";

const API = axios.create({    
    baseURL: "https://elizaapi.onrender.com/notes",
    // baseURL: "http://localhost:8080/notes",
    withCredentials: true,
});

async function getNotes(){
    try {
        const response = await API.get("");
        return response.data;
    } catch (error) {
        return error.response?.data || error.message;
    }
}

async function getNoteById(id){
    try {
        const response = await API.get(`/by-id/${id}`);
        return response.data;
    } catch (error) {
        return error.response?.data || error.message;
    }
}


export { getNotes, getNoteById };