import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL, // Make sure this environment variable is set
    headers: {
        'Content-Type': 'application/json'
    }
});

export const loginEmployee = async (empID, password) => {
    try {
        let response;
        response = await api.post('/api/login',{
            employeeId: empID,
            password: password,
        });

        return response;
    } catch (error) {
        console.error('Error fetching login:', error);
        return error.response ? error.response : error;
    }
};

export const loginSuperAdmin = async (empID, password) => {
    try {
        let response;
        response = await api.post('/superadmin/login',{
            userID: empID,
            password: password,
        });

        return response;
    } catch (error) {
        console.error('Error fetching login:', error);
        return error.response ? error.response : error;
    }
};

export const forgotPwEmployee = async (empId) => {
    try {
        const response = await api.post('/api/login/fp', {
            employeeId: empId,
        });
        return response;
    } catch (error) {
        console.error('Error fetching forgot password:', error);
        return error.response ? error.response : error;
    }
};

export const forgotPwSuperAdmin = async (empId) => {
    try {
        const response = await api.post('/superAdmin/forgotPassword', {
            userID: empId,
        });
        return response;
    } catch (error) {
        console.error('Error fetching forgot password:', error);
        return error.response ? error.response : error;
    }
}

export const resetPassword = async (token, password, confirmPassword) => {
    try {
        const response = await api.post('/api/login/resetpw', {
          resetToken: token,
          newPassword: password,
          confirmPassword: confirmPassword,
        });
        return response;
    } catch (error) {
        console.error('Error fetching reset password:', error);
        return error.response ? error.response : error;
    }
}

export const logout = async (token) => {
    try {
        const response = await api.post('/api/logout', {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response;
    } catch (error) {
        console.error('Error fetching logout:', error);
        return error.response ? error.response : error;
    }
};