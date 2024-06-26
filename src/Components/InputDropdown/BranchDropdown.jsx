import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import InputDropdown from "./InputDropdown";
import { getBranchesForDropdown } from "../../Api/BranchMgmt/BranchAPI";

const BranchDropdown = forwardRef(
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
      displayValue,
      selectedBranch,
    },
    ref
  ) => {
    const [branches, setBranches] = useState([]);
    const [branchData, setBranchData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);

    useEffect(() => {
      const getBranches = async () => {
        try {
          // const token = secureLocalStorage.getItem("accessToken");
          const response = await getBranchesForDropdown();
          if (response.status !== 200) {
            throw new Error("Failed to fetch data");
          }
          const data = await response.data;
          let branches = data.branchesList;
          setIsSuperAdmin(data.isSuperAdmin);
          branches = branches.map((branch) => {
            return {
              value: branch.branchId,
              label: branch.branchName,
            };
          });
          const tempBranches = branches.map((branch) => branch.label);
          if (data.isSuperAdmin) {
            if (displayValue) {
              tempBranches.splice(tempBranches.indexOf(displayValue), 1);
              tempBranches.unshift(displayValue);
            }
          }
          onChange(tempBranches[0]);
          console.log(tempBranches, displayValue);
          setBranchData(tempBranches);
          console.log(0)
        } catch (error) {
          console.error("Error:", error);
        }
      };
      getBranches();
    }, []);

    useEffect(() => {
      if (branchData) {
        setLoading(true);
        let branches = branchData;
        if (addOptions && isSuperAdmin) {
          branches = [...addOptions, ...branches];
        }
        if (isSuperAdmin) {
          if (displayValue) {
            branches.splice(branches.indexOf(displayValue), 1);
            branches.unshift(displayValue);
          }
        }
        setBranches(branches);
        onChange(branches[0]);
        setLoading(false);
        console.log(1)
      }
    }, [branchData]);

    useImperativeHandle(ref, () => ({
      reset: () => {
        if (branchData) {
          let branches = branchData;
          if (addOptions && isSuperAdmin) {
            branches = [...addOptions, ...branches];
          }
          setBranches(branches);
          onChange(branches[0]);
          console.log("Branches:", branches);
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
            editable={editable && isSuperAdmin}
            borderRadius={borderRadius}
            marginTop={marginTop}
            options={branches}
            loading={loading}
          />
      </div>
    );
  }
);

export default BranchDropdown;
