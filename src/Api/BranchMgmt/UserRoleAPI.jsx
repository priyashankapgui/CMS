import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getAllUserRoles = async (token) => {
  try {
    const response = await api.get("/userRoles", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    console.error("Error fetching user roles:", error);
    return error.response ? error.response : error;
  }
};

export const getUserRoleById = async (userRoleId) => {
  try {
    const response = await api.get(`/userRole/${userRoleId}`);
    return response;
  } catch (error) {
    console.error("Error fetching user role by ID:", error);
    return error.response ? error.response : error;
  }
};

export const createUserRole = async (roleName, tempBranch, selectedPages, token) => {
  try {
    const response = await api.post(
      "/userRoleWithPermissions",
      {
        userRoleName: roleName,
        branch: tempBranch,
        checkedPages: selectedPages,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error creating user role:", error);
    return error.response ? error.response : error;
  }
};

export const updateUserRole = async (userRoleId, roleName, tempBranch, selectedPages, token) => {
  try {
    const response = await api.put(
      `/userRoleWithPermissions/${userRoleId}`,
      {
        userRoleName: roleName,
        branch: tempBranch,
        checkedPages: selectedPages,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error updating user role:", error);
    return error.response ? error.response : error;
  }
};

export const deleteUserRole = async (userRoleId, token) => {
  try {
    const response = await api.delete(`/userRoleWithPermissions/${userRoleId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Error deleting user role:", error);
    return error.response ? error.response : error;
  }
};

export const verifyUserRolePermissions = async (token,groupName) => {
    try {
        const response = await api.post(`/verifyPermissions`,{
            token: token,
            groupName: groupName.groupName
        },{
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });
        return response;
    } catch (error) {
        console.error("Error fetching user role permissions:", error);
        return error.response ? error.response : error;
    }
    };

export const getUserRolePermissionsByToken = async (token) => {
  try {
    const response = await api.get("/getUserRolePermissionsByToken", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Error fetching user role permissions:", error);
    return error.response ? error.response : error;
  }
};

export const getUserRolePermissionsById = async (userRoleId, token) => {
  try {
    const response = await api.get(`/getUserRolePermissions/${userRoleId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Error fetching user role permissions by ID:", error);
    return error.response ? error.response : error;
  }
};
