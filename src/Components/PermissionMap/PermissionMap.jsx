import * as React from "react";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

export default function PermissionMap({ checkedPages, permissionArray }) {
  const BranchManagement = ["accounts", "accounts/user-roles", "adjust-branch"];
  const InventoryManagement = [
    "products",
    "suppliers",
    "good-receive",
    "stock-balance",
    "stock-transfer",
    "check-price",
  ];
  const Billing = ["sales", "work-list"];
  const Reporting = ["reporting/reports", "reporting/analysis"];

  const BranchManagementPages = permissionArray.filter((page) =>
    BranchManagement.includes(page.pageId)
  );
  const InventoryManagementPages = permissionArray.filter((page) =>
    InventoryManagement.includes(page.pageId)
  );
  const BillingPages = permissionArray.filter((page) =>
    Billing.includes(page.pageId)
  );
  const ReportingPages = permissionArray.filter((page) =>
    Reporting.includes(page.pageId)
  );
  // console.log(BranchManagementPages);

  const handleCheck = (event, pageId) => {
    checkedPages.set(pageId, event.target.checked);
    console.log(checkedPages);
  };

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "305px",
          fontFamily: 'Poppins',
        }}
      >
        <PermissionGroup
          checkedPages={checkedPages}
          parentName="Branch Management"
          pages={BranchManagementPages}
        />
        <PermissionGroup
          checkedPages={checkedPages}
          parentName="Inventory Management"
          pages={InventoryManagementPages}
        />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "305px",
          marginLeft: "20px",
        }}
      >
        <PermissionSingle
          pageId="web-mgmt"
          pageName="Web Mgmt"
          checkedPages={checkedPages}
          handleCheck={handleCheck}
        />
        <PermissionSingle
          pageId="online-orders"
          pageName="Online Orders"
          checkedPages={checkedPages}
          handleCheck={handleCheck}
        />
        <PermissionGroup
          checkedPages={checkedPages}
          parentName="Billing"
          pages={BillingPages}
        />
        <PermissionGroup
          checkedPages={checkedPages}
          parentName="Reporting"
          pages={ReportingPages}
        />
      </div>
    </div>
  );
}
const PermissionSingle = ({ pageId, pageName, checkedPages, handleCheck }) => {
    const [checked, setChecked] = React.useState(checkedPages.get(pageId));

    const handleChange = (event) => {
        setChecked(event.target.checked);
        handleCheck(event, pageId);
    };
  return (
    <FormControlLabel
    sx={{
        height: "30px",
        mt: 1,
        "& .MuiFormControlLabel-label": { fontFamily: 'Poppins', fontSize: "16px" },
      }}
      label={pageName}
      control={
        <Checkbox
          size="medium"
          checked={checked}
          onChange={handleChange}
        />
      }
    />
  );
};
const PermissionGroup = ({ parentName, pages, checkedPages }) => {
const [checked, setChecked] = React.useState(Array(pages.length).fill(false));

React.useEffect(() => {
    const initialChecked = pages.map((page) => !!checkedPages.get(page.pageId));
    setChecked(initialChecked);
}, [checkedPages, pages]);

  const handleChangeParent = (event) => {
    setChecked(Array(pages.length).fill(event.target.checked));
    pages.map((page) => checkedPages.set(page.pageId, event.target.checked));
    console.log(checkedPages);
  };

  const handleChangeChild = (event, index, pageId) => {
    setChecked((prev) => {
      const newChecked = [...prev];
      newChecked[index] = event.target.checked;
      return newChecked;
    });
    checkedPages.set(pageId, event.target.checked);
    console.log(checkedPages);
    // console.log(checked);
  };

  const children = (
    <Box sx={{ display: "flex", flexDirection: "column", ml: 3 }}>
      {pages.map((page, index) => (
        <FormControlLabel
          sx={{
            height: "30px",
            "& .MuiFormControlLabel-label": { fontFamily: 'Poppins', fontSize: "14px" },
          }}
          key={index}
          label={page.pageName}
          control={
            <Checkbox
              size="small"
              checked={checked[index]}
              onChange={(event) => handleChangeChild(event, index, page.pageId)}
            />
          }
        />
      ))}
    </Box>
  );

  return (
    <div>
      <FormControlLabel
        sx={{ height: "30px", mt: 1, "& .MuiFormControlLabel-label": { fontFamily: 'Poppins', fontSize: "16px" }, }}
        label={parentName}
        control={
          <Checkbox
            checked={checked.every((value) => value)}
            indeterminate={
              checked.some((value) => value) && !checked.every((value) => value)
            }
            onChange={handleChangeParent}
          />
        }
      />
      {children}
    </div>
  );
};
