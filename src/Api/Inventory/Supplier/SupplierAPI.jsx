import axios from "axios";


export const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL, 
    headers: {
        'Content-Type': 'application/json'
    }
});


export const createSupplier = async (supplierData) => {
    try {
        const response = await api.post('/suppliers', supplierData);
        return response.data; 
    } catch (error) {
        console.error('Error creating supplier:', error);
        throw error;
    }
};



export const getSuppliers = async () => {
    try {
        const response = await api.get('/suppliers');
        return response.data;
    } catch (error) {
        console.error('Error fetching feedbacks:', error);
        throw error;
    }
};


export const getSupplierById = async (supplierId) => {
    try {
        const response = await api.get(`/suppliers/${supplierId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching supplier by ID ${supplierId}:`, error);
        throw error;
    }
};


export const deleteSupplierById = async (supplierId) => {
    try {
        const response = await api.delete(`/suppliers/${supplierId}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting supplier with ID ${supplierId}:`, error);
        throw error;
    }
};


export const updateSupplier = async (supplierId, updatedSupplier) => {
    try {
        const response = await api.put(`/suppliers/${supplierId}`, updatedSupplier);
        return response.data;
    } catch (error) {
        console.error(`Error updating supplier with ID ${supplierId}:`, error);
        throw error;
    }
};




export default api;