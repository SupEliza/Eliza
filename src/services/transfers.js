import axios from "axios";

const API = axios.create({    
    baseURL: "https://elizaapi.onrender.com/transfers",
    // baseURL: "http://localhost:8080/transfers",
    withCredentials: true,
});

async function getTransfers(limit){
    try {
        const response = await API.get(`/${limit}`);
        return response.data;
    } catch (error) {
        return error.response?.data || error.message;
    }
}

async function getTransfersById(id){
    try {
        const response = await API.get(`/by-id/${id}`);
        return response.data;
    } catch (error) {
        return error.response?.data || error.message;
    }
}

async function getDeletedTransfers(limit){
    try {
        const response = await API.get(`/deleted/${limit}`);
        return response.data;
    } catch (error) {
        return error.response?.data || error.message;
    }
}

async function moveTransferToBin(id){
    try {
        const response = await API.get(`/bin/add/${id}`);
        return response.data;
    } catch (error) {
        return error.response?.data || error.message;
    }
}

async function remTransferFromBin(id){
    try {
        const response = await API.get(`/bin/remove/${id}`);
        return response.data;
    } catch (error) {
        return error.response?.data || error.message;
    }
}

async function deleteTransfer(id){
    try {
        const response = await API.post(`/bin/delete/${id}`);
        return response.data;
    } catch (error) {
        return error.response?.data || error.message;
    }
}

export { getTransfers, getDeletedTransfers, getTransfersById, moveTransferToBin, remTransferFromBin, deleteTransfer };