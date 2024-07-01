import axios from "axios";


const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL, 
    headers: {
        'Content-Type': 'application/json'
    }
});


export const createCategory = async (newCategory) => {
    try {
        const response = await api.post('/categories', newCategory, {
            headers: {
                'Content-Type': 'multipart/form-data'
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
        const response = await api.get('/categories');
        return response.data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};


export const getCategoryById = async (categoryId) => {
    try {
        const response = await api.get(`/categories/${categoryId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching category by ID ${categoryId}:`, error);
        throw error;
    }
};


export const updateCategory = async (categoryId, updatedCategory) => {
    try {
        const response = await api.put(`/categories/${categoryId}`, updatedCategory, {
            headers: {
                'Content-Type': 'multipart/form-data'
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
        const response = await api.delete(`/categories/${categoryId}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting category with ID ${categoryId}:`, error);
        throw error;
    }
};


export default api;