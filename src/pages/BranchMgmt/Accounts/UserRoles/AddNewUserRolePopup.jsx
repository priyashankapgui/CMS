import {useState, useEffect} from 'react';
import './AddNewUserRolePopup.css';
import CustomAlert from '../../../../Components/Alerts/CustomAlert/CustomAlert';
import AddNewPopup from '../../../../Components/PopupsWindows/AddNewPopup';
import InputLabel from '../../../../Components/Label/InputLabel';
import InputField from '../../../../Components/InputField/InputField';
import BranchDropdown from '../../../../Components/InputDropdown/BranchDropdown';
import PermissionMap from '../../../../Components/PermissionMap/PermissionMap';

// import InputLabel from '../../../../Components/Label/InputLabel';
// import InputField from '../../../../Components/InputField/InputField';

function AddNewUserRolePopup({showSuccess}) {
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
                const response = await fetch('http://localhost:8080/getUserRolePermissionsByToken',
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + sessionStorage.getItem('accessToken') || '',
                    },
                }
                );
                const data = await response.json();
                console.log(data);
                setPermissionArray(data);
                setCheckedPages(new Map(data.map((page) => [page.pageId, false])));
            } catch (error) {
                console.error('Error fetching permissions:', error);
            }
        }
        getPermissions();
    }
    ,[]);

    const handleSave = async() => {
        try {
            const selectedPages = Array.from(checkedPages.entries())
                .filter(([pageId, isChecked]) => isChecked)
                .map(([pageId, isChecked]) => pageId);
            console.log(selectedPages, selectedBranch, roleName);
            if (!roleName || !selectedBranch || selectedPages.length === 0) {
                throw new Error('Please fill all the fields');
            }
            let tempBranch = selectedBranch;
            if (selectedBranch === 'None') {
                tempBranch = null;
            }
           const token = sessionStorage.getItem("accessToken");
           console.log(token);
            const response = await fetch('http://localhost:8080/userRoleWithPermissions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    userRoleName: roleName,
                    branch: tempBranch,
                    checkedPages: selectedPages,
                }),
            });
            if (!response){
                throw new Error('Server Error');
            }
            if (!response.ok) {
                const data = await response.json();   
                throw new Error(data.error);
            }
            const data = await response.json();
            console.log(data);
            showSuccess(`User Role '${roleName}' created successfully`);
            return null;
        } catch (error) {
            setShowAlert(error.message);
            console.error('Error:', error);
            throw new Error(error.message);
        }
    }
    return (
        <>
            <AddNewPopup topTitle="Add New User Role " buttonId="save-btn" buttonText="Create" onClick={handleSave}>
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
                            height="29px"
                        />
                    </div>
                    <div>
                        <InputLabel colour="#0377A8">Branch</InputLabel>
                        <BranchDropdown id="branchName" name="branchName" editable={true} onChange={(e) => handleBranchChange(e)} />
                    </div>
                </div>
                <div className='second-row'>
                    <div className='permission-title'>Permission Mapping</div>
                    <div className='permissions'>
                        <PermissionMap checkedPages={checkedPages} permissionArray={permissionArray}/>
                    </div>
                    {showAlert &&
                    <CustomAlert
                    severity="error"
                    title="Error"
                    message={showAlert}
                    duration={3000}
                    onClose={() => setShowAlert(false)}
                    />
                    }
                </div>

            </AddNewPopup>


        </>
    );
}

export default AddNewUserRolePopup;