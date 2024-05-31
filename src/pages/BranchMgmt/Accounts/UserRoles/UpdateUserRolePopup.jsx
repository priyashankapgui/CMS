import {useState, useEffect} from 'react';
import EditPopup from '../../../../Components/PopupsWindows/EditPopup';
import { Alert, AlertTitle } from '@mui/material';
import AddNewPopup from '../../../../Components/PopupsWindows/AddNewPopup';
import InputLabel from '../../../../Components/Label/InputLabel';
import InputField from '../../../../Components/InputField/InputField';
import BranchDropdown from '../../../../Components/InputDropdown/BranchDropdown';
import PermissionMap from '../../../../Components/PermissionMap/PermissionMap';



function UpdateUserRolePopup({userRoleId}) {
    const [permissionArray, setPermissionArray] = useState([]);
    const [checkedPages, setCheckedPages] = useState();
    const [roleName, setRoleName] = useState();
    const [selectedBranch, setSelectedBranch] = useState("None");
    const [showAlert, setShowAlert] = useState(false);

    const handleBranchChange = (branch) => {
        setSelectedBranch(branch);
        // console.log("Selected branch:", selectedBranch);
        }

    useEffect(() => {
        const getPermissions = async () => {
            try {
                const response = await fetch('http://localhost:8080/getPages');
                const data = await response.json();
                setPermissionArray(data);
                setCheckedPages(new Map(data.map((page) => [page.pageId, false])));
            } catch (error) {
                console.error('Error fetching permissions:', error);
            }
        }
        getPermissions();
    }
    ,[]);
    return (
        <>
            <EditPopup topTitle="Update User Role Details" buttonId="update-btn" buttonText="Update" onClick={""}>
            <div className='first-row'>
                    <div className='roleNameInput'>
                        <InputLabel colour="#0377A8">Role Name</InputLabel>
                        <InputField
                            type="text"
                            id="roleName"
                            name="roleName"
                            value={roleName}
                            onChange={(e) => setRoleName(e.target.value)}
                            editable={true}
                        />
                    </div>
                    <div>
                        <InputLabel colour="#0377A8">Branch</InputLabel>
                        <BranchDropdown id="branchName" name="branchName" editable={true} onChange={(e) => handleBranchChange(e)} addOptions={["None"]} />
                    </div>
                </div>
                <div className='second-row'>
                    <InputLabel colour="#0377A8">Permission Mapping</InputLabel>
                    <div className='permissions'>
                        <PermissionMap checkedPages={checkedPages} permissionArray={permissionArray}/>
                    </div>
                    {showAlert &&
                    <Alert
                        severity={"error"} // Ensure severity matches one of the predefined values
                        sx={{
                            position: "fixed",
                            top: "80px",
                            right: "10px",
                            marginBottom: "30px",
                            color: "#eb1313",
                            width: "fit-content",
                            borderRadius: "18px 0 ",
                            padding: "0 15px 0 15px",
                            marginTop: "0",
                            boxShadow:
                            "0 6px 8px -1px rgba(3, 119, 168, 0.1)," +
                            " 0 4px 7px -1px rgba(3, 119, 168, 0.5)",
                            transition: "top 0.3s ease-in-out, right 0.3s ease-in-out",
                        }}
                        onClose={() => setShowAlert(false)}
                        >
                        <AlertTitle>Error</AlertTitle>
                        {showAlert}
                    </Alert>
                    }
                </div>
            </EditPopup>
        </>
    );
}

export default UpdateUserRolePopup