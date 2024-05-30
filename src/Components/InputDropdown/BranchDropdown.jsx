import { useState, useEffect } from "react";
import InputDropdown from "./InputDropdown";

const BranchDropdown = ({ id, name, height, width, onChange, editable, borderRadius, marginTop, addOptions }) => {
    const [branches, setBranches] = useState([]);

    useEffect(() => {
        const getBranches = async () => {
            try {
                const token = sessionStorage.getItem("accessToken");
                const response = await fetch("http://localhost:8080/branches", {
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
                data = data.map((branch) => {
                    return {
                        value: branch.branchId,
                        label: branch.branchName,
                    };
                });
                const branches = data.map((branch) => branch.label);
                if (addOptions) {
                    branches.push(...addOptions);
                }
                setBranches(branches);
            } catch (error) {
                console.error("Error:", error);
            }
        };
        getBranches();
    }
    , []);
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
            options={branches}
        />
    );
}

export default BranchDropdown;