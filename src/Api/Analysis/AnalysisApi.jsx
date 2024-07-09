import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const getPhysicalSaleTotal = async (branchName, date) => {
    try {
        const response = await api.get('/netBillTotalAmountForDate', {
            params: { branchName, date }
        });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching physical sale amount data:', error);
        throw error;
    }
};

export const getOnlineSaleTotal = async (branchName, date) => {
    try {
        const response = await api.get('/billTotalsForDateOnline', {
            params: { branchName, date }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching online sale amount data:', error);
        throw error;
    }
};


export default api;