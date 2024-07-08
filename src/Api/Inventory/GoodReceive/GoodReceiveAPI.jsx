import axios from "axios";
import secureLocalStorage from 'react-secure-storage';

const getAccessToken = () => secureLocalStorage.getItem('accessToken');


export const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL, 
    headers: {
        'Content-Type': 'application/json'
    }
});


export const createGRN = async (grnData) => {
    try {
        const token = getAccessToken();
        const response = await api.post('/grn', grnData, {
            headers: { Authorization: `Bearer ${token}` } 
        });
        return response.data; 
    } catch (error) {
        console.error('Error creating GRN:', error);
        throw error;
    }
};



export const getAllGRN = async () => {
    try {
        const token = getAccessToken();
        const response = await api.get('/grn', {
            headers: { Authorization: `Bearer ${token}` } 
        });
        console.log("grn data ",response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching grn data:', error);
        throw error;
    }
};


export const getGRNByGRN_NO = async ( GRN_NO) => {
    try {
        const token = getAccessToken();
        const response = await api.get('/grn-all', {
            params: {
                GRN_NO
            },
            headers: { Authorization: `Bearer ${token}` } 
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching GRN by GRN_NO:', error);
        throw error;
    }
};



export default api;