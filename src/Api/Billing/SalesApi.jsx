import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const getProductByBranch = async (searchTerm, branchName) => {
    try {
        const response = await api.get(`/products-by-branch?searchTerm=${searchTerm}&branchName=${branchName}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching ProductByBranch:', error);
        throw error;
    }
};


export const getProductByBarcode = async (barcode, branchName) => {
    try {
        const response = await api.get(`/products-by-barcode?barcode=${barcode}&branchName=${branchName}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching ProductByBarcode:', error);
        throw error;
    }
};

export const postBillData = async (data) => {
    try {
        const response = await api.post('/bills', data);
        return response.data;
    } catch (error) {
        console.error('Error posting bill data:', error);
        throw error;
    }
};

export const getBilledData = async (billNo) => {
    try {
        const response = await api.get(`/bills-all?billNo=${billNo}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching billed data:', error);
        throw error;
    }
};

export const getAllBills = async () => {
    try {
        const response = await api.get('/bills');
        return response.data;
    } catch (error) {
        console.error('Error fetching all bills:', error);
        throw error;
    }
};




export const postRefundBillData = async (payload) => {
    try {
        const response = await api.post('/refund', payload);
        return response.data;
    } catch (error) {
        console.error('Error posting refund bill data:', error);
        throw error;
    }
};

export const getRefundedBillData = async (RTBNo) => {
    try {
        const response = await api.get(`/refund-all?RTBNo=${RTBNo}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching refunded bill data:', error);
        throw error;
    }
};
export const getAllRefundBills = async ({ startDate, endDate } = {}) => {
    const params = {};

    if (startDate) {
        params.startDate = startDate;
    }

    if (endDate) {
        params.endDate = endDate;
    }

    try {
        const response = await api.get('/refund', { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching all refund bills:', error);
        throw error;
    }
};

export const postCancelBill = async (payload) => {
    try {
        const response = await api.post('/bills/cancel', payload);
        return response.data;
    } catch (error) {
        console.error('Error fetching cancel bills:', error);
        throw error;
    }
};

export default api;

// export const putCancelBill = async (payload) => {
//     console.log("Thank youuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu")
//     try {
//         const response = await axios.put('/api/cancel-bill', payload);
//         return response.data;
//     } catch (error) {
//         console.error('Error in putCancelBill:', error);
//         throw error;
//     }
// };
// export default api;