import { useState, useEffect } from "react";
import InputDropdown from "./InputDropdown";
import SubSpinner from "../Spinner/SubSpinner/SubSpinner";

const BranchDropdown = ({ id, name, height, width, onChange, editable, borderRadius, marginTop, addOptions, displayValue }) => {
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
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
                    branches.unshift(...addOptions);
                }
                if (displayValue) {
                    branches.splice(branches.indexOf(displayValue), 1);
                    branches.unshift(displayValue);
                }
                console.log(branches, displayValue);
                setBranches(branches);
                setLoading(false);
            } catch (error) {
                console.error("Error:", error);
            }
        };
        getBranches();
        if(branches.length > 0){
            onChange(branches[0]);
        }
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
            editable={editable}
            borderRadius={borderRadius}
            marginTop={marginTop}
            options={branches}
        />
        }
        </div>
    );
}

export default BranchDropdown;