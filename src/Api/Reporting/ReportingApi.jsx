import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});


export const getStockSummeryDocDataByBranch = async (branchName) => {
    try {
        const response = await api.get(`/product-batch-sum-stockdata-branch?branchName=${branchName}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching stock summery data:', error);
        throw error;
    }
};

export const getExpStockDocDataByBranch = async (branchName) => {
    try {
        const response = await api.get(`/product-batch-sum-upexp-stock-branch?branchName=${branchName}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching Upcoming exp stock summery data:', error);
        throw error;
    }
};


export const getAlreadyExpStockDocDataByBranch = async (branchName) => {
    try {
        const response = await api.get(`/product-batch-sum-expired-stock-branch?branchName=${branchName}`);
        return response.data;
    } catch (error) {
        console.error('Error fetchingAlready exp stock summery data:', error);
        throw error;
    }
};






export default api;