import axios from 'axios';
import secureLocalStorage from 'react-secure-storage';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

const getAccessToken = () => secureLocalStorage.getItem('accessToken');

const createAuthInstance = () => {
    const token = getAccessToken();
    return axios.create({
        baseURL: process.env.REACT_APP_API_BASE_URL,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
};

export const createOnlineBill = async (onlineBillData) => {
    try {
        const authApi = createAuthInstance();
        const response = await authApi.post('/onlineBills', onlineBillData);
        return response.data;
    } catch (error) {
        console.error('Error creating online bill:', error);
        throw error;
    }
};

export const getAllOnlineBills = async () => {
    try {
        const authApi = createAuthInstance();
        const response = await authApi.get('/onlineBills');
        return response.data;
    } catch (error) {
        console.error('Error fetching online bills:', error);
        throw error;
    }
};

export const getOnlineBillByNumber = async (onlineBillNo) => {
    try {
        const authApi = createAuthInstance();
        const response = await authApi.get(`/onlineBills/${onlineBillNo}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching online bill with number ${onlineBillNo}:`, error);
        throw error;
    }
};

export const updateOnlineBill = async (onlineBillNo, onlineBillData) => {
    try {
        const authApi = createAuthInstance();
        const response = await authApi.put(`/onlineBills/${onlineBillNo}`, onlineBillData);
        return response.data;
    } catch (error) {
        console.error(`Error updating online bill with number ${onlineBillNo}:`, error);
        throw error;
    }
};

export const deleteOnlineBill = async (onlineBillNo) => {
    try {
        const authApi = createAuthInstance();
        const response = await authApi.delete(`/onlineBills/${onlineBillNo}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting online bill with number ${onlineBillNo}:`, error);
        throw error;
    }
};
