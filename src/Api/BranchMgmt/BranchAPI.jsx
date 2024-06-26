import axios from 'axios';
import secureLocalStorage from 'react-secure-storage';

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

export const getBranchOptions = async (token) => {
    try {
        const authApi = createAuthInstance();
        const response = await authApi.get('/branchesWeb');
        return response.data;
    } catch (error) {
        console.error('Error fetching branches:', error);
        throw error;
    }
};

export const getBranchById = async (branchId) => {
    try {
        const authApi = createAuthInstance();
        const response = await authApi.get(`/branches/${branchId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching branch with ID ${branchId}:`, error);
        throw error;
    }
};

export const createBranch = async (branchData) => {
    try {
        const authApi = createAuthInstance();
        const response = await authApi.post('/branches', branchData);
        return response.data;
    } catch (error) {
        console.error('Error adding branch:', error);
        throw error;
    }
};

export const updateBranch = async (branchId, branchData) => {
    try {
        const authApi = createAuthInstance();
        const response = await authApi.put(`/branches/${branchId}`, branchData);
        return response.data;
    } catch (error) {
        console.error(`Error updating branch with ID ${branchId}:`, error);
        throw error;
    }
};

export const deleteBranch = async (branchId) => {
    try {
        const authApi = createAuthInstance();
        const response = await authApi.delete(`/branches/${branchId}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting branch with ID ${branchId}:`, error);
        throw error;
    }
};
