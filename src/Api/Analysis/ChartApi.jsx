// import axios from 'axios';

// const api = axios.create({
//     baseURL: process.env.REACT_APP_API_BASE_URL,
//     headers: {
//         'Content-Type': 'application/json'
//     }
// });

// export const getOnlineSaleChartData = async (branchName, year, month) => {
//     try {
//         const response = await api.get('/daily-online-sales-data', {
//             params: { branchName, year, month }
//         });
//         return response.data.data.onlineSalesData;
//     } catch (error) {
//         console.error('Error fetching online sales chart data:', error);
//         throw error;
//     }
// };

// export const getPhysicalSaleChartData = async (branchName, year, month) => {
//     try {
//         const response = await api.get('/daily-sales-data-chart', {  // Correct the URL here
//             params: { branchName, year, month }
//         });
//         return response.data.data.salesData;
//     } catch (error) {
//         console.error('Error fetching physical sales chart data:', error);
//         throw error;
//     }
// };

// export default api;


import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const getOnlineSaleChartData = async (branchName, year, month) => {
    try {
        const response = await api.get('/daily-online-sales-data', {
            params: { branchName, year, month }
        });
        return response.data.data.onlineSalesData;
    } catch (error) {
        console.error('Error fetching online sales chart data:', error);
        throw error;
    }
};

export const getPhysicalSaleChartData = async (branchName, year, month) => {
    try {
        const response = await api.get('/daily-sales-data-chart', {  // Correct the URL here
            params: { branchName, year, month }
        });
        
        console.log('Physical Sale Response:', response.data.data.salesData);  // Log response for debugging
        
        if (!response.data.data.salesData || response.data.data.salesData.length === 0) {
            console.warn('No sales data found for the specified parameters.');
        }
        
        return response.data.data.salesData;
    } catch (error) {
        console.error('Error fetching physical sales chart data:', error);
        throw error;
    }
};

export default api;
