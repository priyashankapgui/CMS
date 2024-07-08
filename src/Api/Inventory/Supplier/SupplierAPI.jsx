import axios from "axios";
import secureLocalStorage from "react-secure-storage";

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


export const createSupplier = async (supplierData) => {
    try {
        const authApi = createAuthInstance();
        const response = await authApi.post('/suppliers', supplierData);
        return response.data; 
    } catch (error) {
        console.error('Error creating supplier:', error);
        throw error;
    }
};



export const getSuppliers = async () => {
    try {
        const authApi = createAuthInstance();
        const response = await authApi.get('/suppliers');
        return response.data;
    } catch (error) {
        console.error('Error fetching suppliers:', error);
        throw error;
    }
};


export const getSupplierById = async (supplierId) => {
    try {
        const authApi = createAuthInstance();
        const response = await authApi.get(`/suppliers/${supplierId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching supplier by ID ${supplierId}:`, error);
        throw error;
    }
};


export const deleteSupplierById = async (supplierId) => {
    try {
        const authApi = createAuthInstance();
        const response = await authApi.delete(`/suppliers/${supplierId}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting supplier with ID ${supplierId}:`, error);
        throw error;
    }
};


export const updateSupplier = async (supplierId, updatedSupplier) => {
    try {
        const authApi = createAuthInstance();
        const response = await authApi.put(`/suppliers/${supplierId}`, updatedSupplier);
        return response.data;
    } catch (error) {
        console.error(`Error updating supplier with ID ${supplierId}:`, error);
        throw error;
    }
};




// export default api;