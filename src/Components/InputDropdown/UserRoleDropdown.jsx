import { useState, useEffect } from "react";
import InputDropdown from "./InputDropdown";

const UserRoleDropdown = ({ id, name, height, width, onChange, editable, borderRadius, marginTop, addOptions, removeOptions, displayValue, filterByBranch }) => {
    const [roles, setUserRoles] = useState([]);
    const [roleData, setRoleData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const getUserRoles = async () => {
            try {
                const token = sessionStorage.getItem("accessToken");
                const response = await fetch("http://localhost:8080/userRoles", {
                    method: "GET", 
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                let data = await response.json();
                let sortedData = data;
                if (displayValue) {
                    const index = sortedData.findIndex((role) => role.userRoleName === displayValue);
                    if (index !== -1) {
                        const selectedRole = sortedData.splice(index, 1)[0];
                        sortedData.splice(0, 0, selectedRole);
                    }
                }
                setRoleData(sortedData);
                console.log("Data:", data);
                setRoleData(data);
                setLoading(false);
            } catch (error) {
                console.error("Error:", error);
            }
        };
        getUserRoles();
    }, []);

    useEffect(() => {
        if (roleData) {
            let userRoles = roleData;
            if (filterByBranch) {
                userRoles = userRoles.filter((role) => role.branchName === filterByBranch);
            }
            userRoles = userRoles.map((role) => {
                return role.userRoleName;
            });
            if (addOptions) {
                userRoles = [...addOptions,...userRoles];
            }
            if (removeOptions) {
                userRoles = userRoles.filter((role) => !removeOptions.includes(role));
            }
            onChange(userRoles[0]);
            console.log("User Roles:", userRoles);
            setUserRoles(userRoles);
        }
    }, [filterByBranch, roleData]);


    return (
        <div>
        {loading ?
        <InputDropdown
            id={id}
            name={name}
            height={height}
            width={width}
            onChange={onChange}
            editable={editable}
            borderRadius={borderRadius}
            marginTop={marginTop}
            options={"Loading..."}
        />
        :
        <InputDropdown
            id={id}
            name={name}
            height={height}
            width={width}
            onChange={onChange}
            editable={editable}
            borderRadius={borderRadius}
            marginTop={marginTop}
            options={roles}
        />
        }
        </div>
    );
}

export default UserRoleDropdown;