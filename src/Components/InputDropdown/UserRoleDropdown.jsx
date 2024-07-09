import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import InputDropdown from "./InputDropdown";
import secureLocalStorage from "react-secure-storage";
import { getAllUserRoles } from "../../Api/BranchMgmt/UserRoleAPI";

const UserRoleDropdown = forwardRef(
  (
    {
      id,
      name,
      height,
      width,
      onChange,
      editable,
      borderRadius,
      marginTop,
      addOptions,
      removeOptions,
      displayValue,
      filterByBranch,
    },
    ref
  ) => {
    const [userRoles, setUserRoles] = useState([]);
    const [roleData, setRoleData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const getUserRoles = async () => {
        try {
          const token = secureLocalStorage.getItem("accessToken");
          const response = await getAllUserRoles(token);
          if (response.status !== 200) {
            throw new Error("Failed to fetch data");
          }
          let data = await response.data;
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
        setLoading(true);
        let userRoles = roleData;
        if (filterByBranch) {
          userRoles = userRoles.filter((role) => role.branchName === filterByBranch);
        }
        userRoles = userRoles.map((role) => {
          return role.userRoleName;
        });
        if (addOptions) {
          userRoles = [...addOptions, ...userRoles];
        }
        if (removeOptions) {
          userRoles = userRoles.filter((role) => !removeOptions.includes(role));
        }
        onChange(userRoles[0]);
        console.log("User Roles:", userRoles);
        setUserRoles(userRoles);
        setLoading(false);
      }
    }, [filterByBranch, roleData]);

    useImperativeHandle(ref, () => ({
      reset: () => {
        if (roleData) {
          let userRoles = roleData;
          if (filterByBranch) {
            userRoles = userRoles.filter((role) => role.branchName === filterByBranch);
          }
          userRoles = userRoles.map((role) => {
            return role.userRoleName;
          });
          if (addOptions) {
            userRoles = [...addOptions, ...userRoles];
          }
          if (removeOptions) {
            userRoles = userRoles.filter((role) => !removeOptions.includes(role));
          }
          onChange(userRoles[0]);
          console.log("User Roles:", userRoles);
          setUserRoles(userRoles);
        }
      },
    }));

    return (
      <div>
        <InputDropdown
          id={id}
          name={name}
          height={height}
          width={width}
          onChange={onChange}
          editable={editable}
          borderRadius={borderRadius}
          marginTop={marginTop}
          options={userRoles}
          loading={loading}
        />
      </div>
    );
  }
);

export default UserRoleDropdown;
