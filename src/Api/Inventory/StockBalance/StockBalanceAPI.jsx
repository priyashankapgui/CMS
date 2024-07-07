import axios from "axios";
import secureLocalStorage from 'react-secure-storage';

const getAccessToken = () => secureLocalStorage.getItem('accessToken');


const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL, 
    headers: {
        'Content-Type': 'application/json'
    }
});

export const getActiveStock = async (branchName, productId) => {
    try {
        const token = getAccessToken();
        const response = await api.get('/active-stock', {
            params: {
                branchName,
                productId
            },
            headers: { Authorization: `Bearer ${token}` } 
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching actiive stock details:', error);
        throw error;
    }
};



export const getProductMinQty = async (branchName, productId) => {
    try {
        const token = getAccessToken();
        const response = await api.get('/product-quantities', {
            params: {
                branchName,
                productId
            },
            headers: { Authorization: `Bearer ${token}` } 
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching product MinQty details:', error);
        throw error;
    }
};



export const getAdjustStockDetails = async (branchName, productId) => {
    try {
        const token = getAccessToken();
        const response = await api.get('/adjust-stock', {
            params: {
                branchName,
                productId
            },
            headers: { Authorization: `Bearer ${token}` } 
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching adjust stock details:', error);
        throw error;
    }
};


export const updateAdjustStock = async (updates) => {
    try {
        const token = getAccessToken();
        const response = await api.put('/adjust-stock-quantity',  updates, {
            headers: { Authorization: `Bearer ${token}`  } 
         });
        return response.data;
    } catch (error) {
        console.error('Error updating adjust stock details:', error);
        throw error;
    }
};






export default api;