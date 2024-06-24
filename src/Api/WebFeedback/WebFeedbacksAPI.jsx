import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL, 
    headers: {
        'Content-Type': 'application/json'
    }
});

export const getWebFeedbacks = async () => {
    try {
        const response = await api.get('/feedback');
        return response.data;
    } catch (error) {
        console.error('Error fetching feedbacks:', error);
        throw error;
    }
};

export const putWebFeedback = async (feedbackId, updatedFeedback) => {
    try {
        const response = await api.put(`/feedback/${feedbackId}`, updatedFeedback);
        return response.data;
    } catch (error) {
        console.error(`Error updating feedback with ID ${feedbackId}:`, error);
        throw error;
    }
};

export default api;
