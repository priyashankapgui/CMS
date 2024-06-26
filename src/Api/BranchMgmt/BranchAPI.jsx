import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL, // Make sure this environment variable is set
    headers: {
        'Content-Type': 'application/json'
    }
});

export const getBranchOptions = async (token) => {
    try {
        const response = await api.get('/branches',{
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response;
    } catch (error) {
        console.error('Error fetching braches:', error);
        throw error;
    }
};