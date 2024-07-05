import axios from "axios";
import secureLocalStorage from 'react-secure-storage';

const getAccessToken = () => secureLocalStorage.getItem('accessToken');


const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL, 
    headers: {
        'Content-Type': 'application/json'
    }
});


export const createCategory = async (newCategory) => {
    try {
        const token = getAccessToken();
        const response = await api.post('/categories', newCategory, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}` 
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating category:', error);
        throw error;
    }
};

export const getCategories = async () => {
    try {
        const token = getAccessToken();
        const response = await api.get('/categories', { headers: { Authorization: `Bearer ${token}` } });
        return response.data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};


export const getCategoryById = async (categoryId) => {
    try {
        const token = getAccessToken();
        const response = await api.get(`/categories/${categoryId}`,
        { headers: { Authorization: `Bearer ${token}` } });
        return response.data;
    } catch (error) {
        console.error(`Error fetching category by ID ${categoryId}:`, error);
        throw error;
    }
};


export const updateCategory = async (categoryId, updatedCategory) => {
    try {
        const token = getAccessToken();
        const response = await api.put(`/categories/${categoryId}`, updatedCategory, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Error updating category with ID ${categoryId}:`, error);
        throw error;
    }
};



export const deleteCategoryById = async (categoryId) => {
    try {
        const token = getAccessToken();
        const response = await api.delete(`/categories/${categoryId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error(`Error deleting category with ID ${categoryId}:`, error);
        throw error;
    }
};


export default api;