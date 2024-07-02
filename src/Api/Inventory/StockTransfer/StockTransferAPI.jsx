import axios from "axios";


export const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL, 
    headers: {
        'Content-Type': 'application/json'
    }
});


export const createstockTransferOUT = async (stockTransferData) => {
    try {
        const response = await api.post('/stockTransferOUT', stockTransferData);
        return response.data; 
    } catch (error) {
        console.error('Error creating stockTransferOUT:', error);
        throw error;
    }
};


export const createstockTransferIN = async (stockTransferData) => {
    try {
        const response = await api.post('/stockTransferIN', stockTransferData);
        return response.data; 
    } catch (error) {
        console.error('Error creating stockTransferIN:', error);
        throw error;
    }
};


export const getAllTransfers = async () => {
    try {
        const response = await api.get('/allTransfers');
        console.log("grn data ",response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching transfer details:', error);
        throw error;
    }
};


export const getStockTransferBySTN_NO = async ( STN_NO) => {
    console.log("called with STN_NO:", STN_NO);
    try {
        const response = await api.get('/stock-transferAllDetails', {
            params: { STN_NO }
        });
        console.log("API response:", response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching transfer data by STN_NO:', error.response ? error.response : error.message);
        throw error;
    }
};


export const getBatchNo = async ( productId, branchName) => {
    try {
        const response = await api.get('/batchNumbers', {
            params: {
                productId,
                branchName
               
            }
        });
        console.log(" response:", response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching  batch details:', error);
        throw error;
    }
};


export const updateTransferQty = async (updates) => {
    console.log("received data for save",updates);
    try {
        const response = await api.put('/update-product-batch-sum', { updates });
        return response.data;
    } catch (error) {
        console.error('Error updating transfer stock details:', error);
        throw error;
    }
};


export const cancelStockRequest = async (data) => {
    try {
        const response = await api.put('/stock-transfer/cancel', data);
        console.log("Cancellation response:", response.data);
        return response.data;
    } catch (error) {
        console.error('Error cancelling stock request:', error);
        throw error;
    }
};





export default api;