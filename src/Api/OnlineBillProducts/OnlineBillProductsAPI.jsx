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

// Function to add products to a bill
export const addProductsToBill = async (onlineBillNo, productsData) => {
    try {
        const authApi = createAuthInstance();
        const response = await authApi.post(`/addproductstobill`, { onlineBillNo, productsData });
        return response.data;
    } catch (error) {
        console.error('Error adding products to bill:', error);
        throw error;
    }
};

// Function to get all online bill products
export const getAllOnlineBillProducts = async () => {
    try {
        const authApi = createAuthInstance();
        const response = await authApi.get('/onlineBillProducts');
        return response.data;
    } catch (error) {
        console.error('Error fetching online bill products:', error);
        throw error;
    }
};

// Function to get online bill products by bill number
export const getOnlineBillProductsByBillNo = async (onlineBillNo) => {
    try {
        const authApi = createAuthInstance();
        const response = await authApi.get(`/onlineBillProducts/${onlineBillNo}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching online bill products for bill number ${onlineBillNo}:`, error);
        throw error;
    }
};
