import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL, // Make sure this environment variable is set
  headers: {
    "Content-Type": "application/json",
  },
});

export const getAllEmployees = async (token) => {
  try {
    const response = await api.get("/employees", { headers: { Authorization: `Bearer ${token}` } });
    return response;
  } catch (error) {
    console.error("Error fetching employees:", error);
    return error.response ? error.response : error;
  }
};

export const getEmployeeById = async (employeeId, token) => {
    try {
        const response = await api.get(`/employees/${employeeId}`, 
            { headers: { Authorization: `Bearer ${token}` } });
        return response;
    }
    catch (error) {
        console.error("Error fetching employee by ID:", error);
        return error.response ? error.response : error;
    }
};

export const createEmployee = async (formData, token) => {
  try {
    const response = await api.post(
      "/employees",
      formData,
      {
        headers: {
            "Content-Type": "multipart/form-data", 
            Authorization: `Bearer ${token}` 
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error creating employee:", error);
    return error.response ? error.response : error;
  }
};

export const updateEmployee = async (employeeId, formData, token) => {
    try {
        const response = await api.put(`/employees/${employeeId}`,
             formData, 
            {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            },
        });
        return response;
    } catch (error) {
        console.error("Error updating employee:", error);
        return error.response ? error.response : error;
    }
};

export const updatePersonalAccount = async (formData, token) => {
    try {
        const response = await api.post(`/employees/selfUpdate`,
             formData, 
            {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            },
        });
        return response;
    } catch (error) {
        console.error("Error updating personal account:", error);
        return error.response ? error.response : error;
    }
};

export const deleteEmployee = async (employeeId, token) => {
  try {
    const response = await api.delete(`/employees/${employeeId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    console.error("Error deleting employee:", error);
    return error.response ? error.response : error;
  }
};
