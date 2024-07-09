import { useState, useEffect } from "react";
import "./AddNewUserRolePopup.css";
import { useNavigate } from "react-router-dom";
import CustomAlert from "../../../../Components/Alerts/CustomAlert/CustomAlert";
import AddNewPopup from "../../../../Components/PopupsWindows/AddNewPopup";
import InputLabel from "../../../../Components/Label/InputLabel";
import InputField from "../../../../Components/InputField/InputField";
import BranchDropdown from "../../../../Components/InputDropdown/BranchDropdown";
import PermissionMap from "../../../../Components/PermissionMap/PermissionMap";
import SubSpinner from "../../../../Components/Spinner/SubSpinner/SubSpinner";
import secureLocalStorage from "react-secure-storage";
import {
  createUserRole,
  getUserRolePermissionsByToken,
} from "../../../../Api/BranchMgmt/UserRoleAPI";

function AddNewUserRolePopup({ refresh }) {
  const token = secureLocalStorage.getItem("accessToken");
  const [permissionArray, setPermissionArray] = useState(["None"]);
  const [checkedPages, setCheckedPages] = useState(new Map());
  const [roleName, setRoleName] = useState();
  const [selectedBranch, setSelectedBranch] = useState("None");
  const [showAlert, setShowAlert] = useState(false);
  const [success, setSuccess] = useState(false);
  const [subLoading, setSubLoading] = useState(true);

  const handleBranchChange = (branch) => {
    setSelectedBranch(branch);
    // console.log("Selected branch:", selectedBranch);
  };

  useEffect(() => {
    const getPermissions = async () => {
      try {
        setSubLoading(true);
        const response = await getUserRolePermissionsByToken(token);
        const data = await response.data;
        console.log(data);
        setPermissionArray(data);
        setCheckedPages(new Map(data.map((page) => [page.pageId, false])));
      } catch (error) {
        console.error("Error fetching permissions:", error);
      } finally {
        setSubLoading(false);
      }
    };
    getPermissions();
  }, [token]);

  const handleSave = async () => {
    try {
      const selectedPages = Array.from(checkedPages.entries())
        .filter(([pageId, isChecked]) => isChecked)
        .map(([pageId, isChecked]) => pageId);
      console.log(selectedPages, selectedBranch, roleName);
      if (!roleName || !selectedBranch || selectedPages.length === 0) {
        throw new Error("Please fill all the fields");
      }
      let tempBranch = selectedBranch;
      if (selectedBranch === "None") {
        tempBranch = null;
      }
      const token = secureLocalStorage.getItem("accessToken");
      console.log(token);
      const response = await createUserRole(roleName, tempBranch, selectedPages, token);
      if (!response) {
        throw new Error("Server Error");
      }
      if (response.status !== 201) {
        const data = await response.data;
        throw new Error(data.error);
      }
      const data = await response.data;
      console.log(data);
      refresh();
      setSuccess(`User Role '${roleName}' created successfully`);
      setCheckedPages(new Map(permissionArray.map((page) => [page.pageId, false])));
      setRoleName("");
      return null;
    } catch (error) {
      setShowAlert(error.message);
      console.error("Error:", error);
    }
  };
  return (
    <>
      <AddNewPopup
        topTitle="Add New User Role "
        buttonId="save-btn"
        buttonText="Create"
        onClick={handleSave}
        forceClose={success}
      >
        {subLoading ? (
          <SubSpinner />
        ) : (
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
                />
              </div>
              <div>
                <InputLabel colour="#0377A8">Branch</InputLabel>
                <BranchDropdown
                  id="branchName"
                  name="branchName"
                  editable={true}
                  onChange={(e) => handleBranchChange(e)}
                />
              </div>
            </div>
            <div className="second-row">
              <div className="permission-title">Permission Mapping</div>
              <div className="permissions">
                <PermissionMap checkedPages={checkedPages} permissionArray={permissionArray} />
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
        )}
      </AddNewPopup>
      {success && (
        <CustomAlert
          severity="success"
          title="Success"
          message={success}
          duration={1500}
          onClose={() => {
            setSuccess(false);
          }}
        />
      )}
    </>
  );
}

export default AddNewUserRolePopup;
