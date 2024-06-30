import axios from "axios";


export const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL, 
    headers: {
        'Content-Type': 'application/json'
    }
});


export const createGRN = async (grnData) => {
    try {
        const response = await api.post('/grn', grnData);
        return response.data; 
    } catch (error) {
        console.error('Error creating GRN:', error);
        throw error;
    }
};



export const getAllGRN = async () => {
    try {
        const response = await api.get('/grn');
        return response.data;
    } catch (error) {
        console.error('Error fetching feedbacks:', error);
        throw error;
    }
};


export const getGRNByGRN_NO = async ( GRN_NO) => {
    try {
        const response = await api.get('/grn-all', {
            params: {
                GRN_NO
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching GRN by GRN_NO:', error);
        throw error;
    }
};



export default api;