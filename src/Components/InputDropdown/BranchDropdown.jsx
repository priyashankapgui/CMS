import { useState, useEffect } from "react";
import InputDropdown from "./InputDropdown";

const BranchDropdown = ({ id, name, height, width, onChange, editable, borderRadius, marginTop, addOptions, displayValue }) => {
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);

    useEffect(() => {
        const getBranches = async () => {
            setLoading(true);
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
                const data = await response.json();
                let branches = data.branchesList;
                setIsSuperAdmin(data.isSuperAdmin);
                branches = branches.map((branch) => {
                    return {
                        value: branch.branchId,
                        label: branch.branchName,
                    };
                });
                const tempBranches = branches.map((branch) => branch.label);
                if(data.isSuperAdmin){
                    if (addOptions) {
                        tempBranches.unshift(...addOptions);
                    }
                    if (displayValue) {
                        tempBranches.splice(tempBranches.indexOf(displayValue), 1);
                        tempBranches.unshift(displayValue);
                    }
                }
                onChange(tempBranches[0]);
                console.log(tempBranches, displayValue);
                setBranches(tempBranches);
                setLoading(false);
            } catch (error) {
                console.error("Error:", error);
            }
        };
        getBranches();
    }
    , []);
    return (
        <div>
        {loading ? 
        <InputDropdown
            id={id}
            name={name}
            height={height}
            width={width}
            onChange={onChange}
            editable={false}
            borderRadius={borderRadius}
            marginTop={marginTop}
            options={['Loading...']}
        /> 
        : 
        <InputDropdown
            id={id}
            name={name}
            height={height}
            width={width}
            onChange={onChange}
            editable={editable && isSuperAdmin}
            borderRadius={borderRadius}
            marginTop={marginTop}
            options={branches}
        />
        }
        </div>
    );
}

export default BranchDropdown;