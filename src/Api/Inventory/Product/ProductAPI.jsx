import axios from "axios";
import secureLocalStorage from 'react-secure-storage';

const getAccessToken = () => secureLocalStorage.getItem('accessToken');

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL, 
    headers: {
        'Content-Type': 'application/json'
    }
});


export const createProduct = async (newProduct) => {
    try {
        const token = getAccessToken();
        const response = await api.post('/products', newProduct, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}` 
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }
};

export const getProducts = async () => {
    try {
        const response = await api.get('/products');
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};


export const getProductById = async (productId) => {
    try {
        const response = await api.get(`/products/${productId}`,
        );
        return response.data;
    } catch (error) {
        console.error(`Error fetching product by ID ${productId}:`, error);
        throw error;
    }
};


export const updateProduct = async (productId, updatedProduct) => {
    try {
        const token = getAccessToken();
        const response = await api.put(`/products/${productId}`, updatedProduct, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Error updating product with ID ${productId}:`, error);
        throw error;
    }
};



export const deleteProductById = async (productId) => {
    try {
        const token = getAccessToken();
        const response = await api.delete(`/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
        return response.data;
    } catch (error) {
        console.error(`Error deleting product with ID ${productId}:`, error);
        throw error;
    }
};


export const getProductBatchDetails = async (branchName, productId) => {
    try {
        const token = getAccessToken();
        const response = await api.get('/product-batch-details', {
            params: {
                branchName,
                productId
            },
            headers: { Authorization: `Bearer ${token}` } 
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching product batch details:', error);
        throw error;
    }
};



export const getProductByCategoryId = async ( categoryId) => {
    try {
        const token = getAccessToken();
        const response = await api.get('/products-category', {
            params: {
                categoryId
            },
            headers: { Authorization: `Bearer ${token}` } 
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching product details:', error);
        throw error;
    }
};


export const updateProductDiscount = async (updates) => {
    try {
        const token = getAccessToken();
        const response = await api.put('/product-batch-sum-discount', updates, {
             headers: { Authorization: `Bearer ${token}`  } });
        return response.data;
    } catch (error) {
        console.error('Error updating product discount:', error);
        throw error;
    }
};





export default api;