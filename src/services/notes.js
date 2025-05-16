import axios from "axios";

const API = axios.create({    
    // baseURL: "https://elizaapi.onrender.com/notes",
    baseURL: "http://localhost:8080/notes",
    withCredentials: true,
});

async function getNotes(notesLimit){
    try {
        const response = await API.get(`/${notesLimit}`);
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

async function moveNoteToBin(id){
    try {
        const response = await API.post(`/bin/add/${id}`);
        return response.data;
    } catch (error) {
        return error.response?.data || error.message;
    }
}

async function remNoteFromBin(id){
    try {
        const response = await API.post(`/bin/remove/${id}`);
        return response.data;
    } catch (error) {
        return error.response?.data || error.message;
    }
}

async function deleteNote(id){
    try {
        const response = await API.post(`/bin/delete/${id}`);
        return response.data;
    } catch (error) {
        return error.response?.data || error.message;
    }
}


export { getNotes, getNoteById, moveNoteToBin, deleteNote, remNoteFromBin };