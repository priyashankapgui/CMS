import {useState, useEffect} from 'react';
import EditPopup from '../../../../Components/PopupsWindows/EditPopup';
import InputLabel from '../../../../Components/Label/InputLabel';
import InputField from '../../../../Components/InputField/InputField';
import BranchDropdown from '../../../../Components/InputDropdown/BranchDropdown';
import PermissionMap from '../../../../Components/PermissionMap/PermissionMap';
import CustomAlert from '../../../../Components/Alerts/CustomAlert/CustomAlert';



function UpdateUserRolePopup({userRoleId}) {
    const [permissionArray, setPermissionArray] = useState([]);
    const [checkedPages, setCheckedPages] = useState();
    const [roleName, setRoleName] = useState();
    const [selectedBranch, setSelectedBranch] = useState();
    const [showAlert, setShowAlert] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

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
                setPermissionArray(data);
                setCheckedPages(new Map(data.map((page) => [page.pageId, false])));
            } catch (error) {
                console.error('Error fetching permissions:', error);
            }
        }
        getPermissions();
    }
    ,[]);

    useEffect(() => {
        const getUserPermission = async () => {
            try {
                const response = await fetch(`http://localhost:8080/getUserRolePermissions/${userRoleId}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                data.permissions.forEach(page => {
                  checkedPages.set(page.pageAccessId, true);
                });
            } catch (error) {
                console.error('Error fetching permissions:', error);
            }
        }
        const getUserRole = async () => {
            try {
                const response = await fetch(`http://localhost:8080/userRole/${userRoleId}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                console.log(data);
                setRoleName(data.userRoleName);
                setSelectedBranch(data.branchName);
            } catch (error) {
                console.error('Error fetching user role:', error);
            }
        }
        getUserRole();
        getUserPermission();
    }
    ,[checkedPages, userRoleId]);

    const handleUpdate = async() => {
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
        const response = await fetch(`http://localhost:8080/userRoleWithPermissions/${userRoleId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + sessionStorage.getItem('accessToken') || '',
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
        setShowSuccess(`User Role '${roleName}' Updated successfully`);
        return null;
      } catch (error) {
          setShowAlert(error.message);
          console.error('Error:', error);
      }
    }

    return (
      <>
        <EditPopup
          topTitle="Update User Role Details"
          buttonId="update-btn"
          buttonText="Update"
          onClick={handleUpdate}
        >
          <div className="first-row">
            <div className="roleNameInput">
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
              <BranchDropdown
                id="branchName"
                name="branchName"
                editable={false}
                onChange={(e) => handleBranchChange(e)}
                addOptions={["None"]}
                displayValue={selectedBranch}
              />
            </div>
          </div>
          <div className="second-row">
          <div className='permission-title'>Permission Mapping</div>
            <div className="permissions">
              <PermissionMap
                checkedPages={checkedPages}
                permissionArray={permissionArray}
              />
            </div>
            {showAlert && (
              <CustomAlert
                severity="error"
                title="Error"
                message={showAlert}
                duration={3000}
                onClose={() => setShowAlert(false)}
              />
            )}
            {showSuccess && (
              <CustomAlert
                severity="success"
                title="Success"
                message={showSuccess}
                duration={1500}
                onClose={() => window.location.reload()}
              />
            )}
          </div>
        </EditPopup>
      </>
    );
}

export default UpdateUserRolePopup