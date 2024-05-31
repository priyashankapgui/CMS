import { useState, useEffect } from "react";
import InputDropdown from "./InputDropdown";

const UserRoleDropdown = ({ id, name, height, width, onChange, editable, borderRadius, marginTop, addOptions }) => {
    const [roles, setUserRoles] = useState([]);

    useEffect(() => {
        const getUserRoles = async () => {
            try {
                const response = await fetch("http://localhost:8080/userRoles", {
                    method: "GET", 
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                const data = await response.json();
                console.log(data);
                const formattedRoles = data.map((role) => ({
                    value: role.userRoleId,
                    label: role.userRoleName,
                }));
                console.log(formattedRoles);

                const roles = formattedRoles.map((role) => role.label);
                if (addOptions) {
                    roles.unshift(...addOptions);
                }
                setUserRoles(roles);
            } catch (error) {
                console.error("Error:", error);
            }
        };
        getUserRoles();
    }, []);


    return (
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
    );
}

export default UserRoleDropdown;