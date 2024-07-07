import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
// import SubPopup from "../../PopupsWindows/SubPopup";
import Buttons from "../../Buttons/SquareButtons/Buttons";
import InputLabel from "../../Label/InputLabel";
import InputField from "../../InputField/InputField";
import { useDropzone } from "react-dropzone";
import CustomAlert from "../../Alerts/CustomAlert/CustomAlert";
import "./MyAccountDetails.css";
import secureLocalStorage from "react-secure-storage";
import SubSpinner from "../../Spinner/SubSpinner/SubSpinner";
import { updatePersonalAccount } from "../../../Api/BranchMgmt/UserAccountsAPI";

export default function MyAccountDetailsMain({ editable, profilePicExists, toggleEditable }) {
  const [employeeData, setEmployeeData] = useState({
    userName: "",
    userID: "",
    branchName: "",
    role: "",
    email: "",
    phone: "",
    address: "",
  });
  const [imageUrl, setImageUrl] = useState(null);
  const [file, setFile] = useState(null); // State for storing the image file
  const [showAlertSuccess, setShowAlertSuccess] = useState(false);
  const [showAlertError, setShowAlertError] = useState("");
  const [loading, setLoading] = useState(false);
  let user = JSON.parse(secureLocalStorage.getItem("user"));

  const handleDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = () => {
      setImageUrl(reader.result);
    };
    reader.readAsDataURL(file);
    setFile(file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: "",
    multiple: false,
    onDrop: handleDrop,
  });

  useEffect(() => {
    setEmployeeData({
      userName: user?.userName || "",
      userID: user?.userID || user?.employeeId || "",
      branchName: user?.branchName || "",
      role: user?.role || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
    });
  }, []);

  const handleUpdate = async () => {
    if (!employeeData.userName) {
      setShowAlertError("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      let body = {};
      const token = secureLocalStorage.getItem("accessToken");
      let response;
      body = {
        employeeName: employeeData.userName,
        branchName: employeeData.branchName,
        userRoleName: employeeData.role,
        email: employeeData.email,
        phone: employeeData.phone,
        address: employeeData.address,
      };
      const formData = new FormData();
      formData.append("data", JSON.stringify(body));
      if (file) {
        formData.append("image", file);
      }
      response = await updatePersonalAccount(formData, token);
      if (response.status !== 200) {
        const data = await response.data;
        console.log("Error:", data.error);
        setShowAlertError(data.error);
      } else {
        const updatedUser = {
          userName: body.employeeName || body.superAdminName,
          userID: employeeData.userID,
          branchName: (body.branchName === "None" ? "" : body.branchName) || "",
          role: employeeData.role,
          email: body.email || "",
          phone: body.phone || "",
          address: body.address || "",
        };
        setEmployeeData(updatedUser);
        secureLocalStorage.setItem("user", JSON.stringify(updatedUser));
        setShowAlertSuccess(true);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setShowAlertError(error.message);
      console.error("Error:", error);
    }
  };

  return (
    <div className="view-profile-form-background">
      <div className="branch-field">
        <InputLabel for="branchName" color="#0377A8">
          Branch
        </InputLabel>
        <InputField
          type="text"
          id="branchName"
          name="branchName"
          value={employeeData.branchName || 'All'}
          width="250px"
        />
      </div>
      <div className="flex-content-ViewP">
        <div className="user-role-field">
          <InputLabel for="userRole" color="#0377A8">
            User Role
          </InputLabel>
          <InputField
            type="text"
            id="role"
            name="role"
            value={employeeData.role}
            width="250px"
          />
        </div>
        <div
          className={editable ? "change-dp" : "change-dp-no-hover"}
          {...(editable ? getRootProps() : {})}
        >
          {editable && (
            <label className="upload-label" htmlFor="profilePicture">
              <Icon icon="fluent:camera-add-20-regular" />
            </label>
          )}
          {imageUrl && <img className={"preview-image"} src={imageUrl} alt="Preview" />}
          {profilePicExists && !imageUrl ? (
            <img
              className="preview-image"
              src={`https://flexflowstorage01.blob.core.windows.net/cms-data/${user.userID}.png`}
              alt="Profile"
            />
          ) : (
            <img
              className="preview-image"
              // src={accountCircle}
              src={`${process.env.PUBLIC_URL}/Images/account_circle.svg`}
              alt="Profile"
            />
          )}
          {editable && (
            <div>
              <input {...getInputProps()} />
              {isDragActive ? <p>Drop the image here...</p> : null}
            </div>
          )}
        </div>
      </div>
      <div className="emp-id-field">
        <InputLabel for="empID" color="#0377A8">
          Emp ID
        </InputLabel>
        <InputField type="text" id="empID" name="empID" value={employeeData.userID} />
      </div>
      <div className="emp-name-field">
        <InputLabel for="empName" color="#0377A8">
          Emp Name
        </InputLabel>
        <InputField
          type="text"
          id="empName"
          name="empName"
          value={employeeData.userName}
          className={editable ? "blue-border" : ""}
          editable={editable}
          onChange={(e) =>
            setEmployeeData({
              ...employeeData,
              userName: e.target.value,
            })
          }
        />
      </div>
      <div className="email-field">
        <InputLabel for="empEmail" color="#0377A8">
          Official Email (Optional)
        </InputLabel>
        <InputField
          type="email"
          id="empEmail"
          name="empEmail"
          value={employeeData.email}
          editable={editable}
          className={editable ? "blue-border" : ""}
          onChange={(e) => setEmployeeData({ ...employeeData, email: e.target.value })}
        />
      </div>
      <div className="phone-field">
        <InputLabel for="empPhone" color="#0377A8">
            Phone Number (Optional)
        </InputLabel>
        <InputField
          type="text"
          id="empPhone"
          name="empPhone"
          value={employeeData.phone}
          editable={editable}
          className={editable ? "blue-border" : ""}
          onChange={(e) => setEmployeeData({ ...employeeData, phone: e.target.value })}
        />
      </div>
      <div className="address-field">
        <InputLabel for="empAddress" color="#0377A8">
          Address (Optional)
        </InputLabel>
        <InputField
          type="text"
          id="empAddress"
          name="empAddress"
          value={employeeData.address}
          editable={editable}
          className={editable ? "blue-border" : ""}
          onChange={(e) => setEmployeeData({ ...employeeData, address: e.target.value })}
        />
      </div>
      {editable && (
        <div>
          {loading ? (
            <SubSpinner loading={loading} spinnerText="Updating" />
          ) : (
            <Buttons
              type="submit"
              id="update-btn"
              btnWidth="22em"
              style={{ backgroundColor: "#23A3DA", color: "white" }}
              onClick={handleUpdate}
            >
              Update
            </Buttons>
          )}
        </div>
      )}

      {showAlertSuccess && (
        <CustomAlert
          severity="success"
          title="Success"
          message="Your Details have been updated successfully"
          duration={3000}
          onClose={() => {toggleEditable(); setShowAlertSuccess(false);}}
        />
      )}

      {showAlertError && (
        <CustomAlert
          severity="error"
          title="Error"
          message={showAlertError}
          duration={10000}
          onClose={() => setShowAlertError("")}
        />
      )}
    </div>
  );
}
