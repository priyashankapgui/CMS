import {useState, useEffect, forwardRef, useImperativeHandle} from 'react';
import InputLabel from '../../../../Components/Label/InputLabel';
import InputField from '../../../../Components/InputField/InputField';
import BranchDropdown from '../../../../Components/InputDropdown/BranchDropdown';
import PermissionMap from '../../../../Components/PermissionMap/PermissionMap';
import CustomAlert from '../../../../Components/Alerts/CustomAlert/CustomAlert';
import secureLocalStorage from 'react-secure-storage';
import SubSpinner from '../../../../Components/Spinner/SubSpinner/SubSpinner';
import { getUserRoleById, getUserRolePermissionsById, getUserRolePermissionsByToken, updateUserRole } from '../../../../Api/BranchMgmt/UserRoleAPI';



const UpdateUserRolePopup = forwardRef(function UpdateUserRolePopup({userRoleId, refresh, handleClose, displaySuccess}, ref) {
    const [permissionArray, setPermissionArray] = useState([]);
    const [checkedPages, setCheckedPages] = useState(new Map());
    const [roleName, setRoleName] = useState();
    const [selectedBranch, setSelectedBranch] = useState();
    const [showAlert, setShowAlert] = useState(false);
    const [loading, setLoading] = useState(true);
    const token = secureLocalStorage.getItem('accessToken');

    const handleBranchChange = (branch) => {
        setSelectedBranch(branch);
        // console.log("Selected branch:", selectedBranch);
        }

    useEffect(() => {
      // setLoading(true);
        const getPermissions = async () => {
            try {
              const response = await getUserRolePermissionsByToken(token);
                const data = await response.data;
                setPermissionArray(data);
            } catch (error) {
                console.error('Error fetching permissions:', error);
            }
        }
        getPermissions();
    }
    ,[token]);

    useEffect(() => {
      //blue checkmark for permissions that are already assigned to the user role
      const getUserPermission = async () => {
        setLoading(true);
            try {
                const response = await getUserRolePermissionsById(userRoleId, token);
                const data = await response.data;
                const tempCheckedPages = new Map(permissionArray.map((page) => [page.pageId, false]));
                data.permissions.forEach(page => {
                  tempCheckedPages.set(page.pageAccessId, true);
                });
                setCheckedPages(tempCheckedPages);
            } catch (error) {
                console.error('Error fetching permissions:', error);
            }
            console.log(userRoleId)
            setLoading(false);
        }
        const getUserRole = async () => {
            try {
                const response = await getUserRoleById(userRoleId, token);
                const data = await response.data;
                setRoleName(data.userRoleName);
                setSelectedBranch(data.branchName);
            } catch (error) {
                console.error('Error fetching user role:', error);
            }
        }
        getUserRole();
        getUserPermission();
    }
    ,[permissionArray, token, userRoleId]);

    const handleUpdate = async() => {
      try {
        const selectedPages = Array.from(checkedPages.entries())
            .filter(([pageId, isChecked]) => isChecked)
            .map(([pageId, isChecked]) => pageId);
        // console.log(selectedPages, selectedBranch, roleName);
        if (!roleName || !selectedBranch || selectedPages.length === 0) {
            throw new Error('Please fill all the fields');
        }
        let tempBranch = selectedBranch;
        if (selectedBranch === 'None') {
            tempBranch = null;
        }
        const response = await updateUserRole(userRoleId, roleName, tempBranch, selectedPages, token);
        if (!response){
            throw new Error('Server Error');
        }
        if (response.status !== 200) {
            const data = await response.data;
            throw new Error(data.error);
        }
        displaySuccess(`User Role '${roleName}' Updated successfully`);
        refresh();
        handleClose();
        return null;
      } catch (error) {
          setShowAlert(error.message);
          console.error('Error:', error);
      }
    }

    useImperativeHandle(ref, () => ({
      handleUpdate: handleUpdate,
    }));

    return (
      <>
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
                loading={loading}
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
              {loading ? (
                <div className="loading-container">
                  <p>
                    <SubSpinner />
                  </p>
                </div>
              ) : (
              <PermissionMap
                checkedPages={checkedPages}
                permissionArray={permissionArray}
              />
              )}
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
          </div>
      </>
    );
})

export default UpdateUserRolePopup