import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import SubPopup from "../../PopupsWindows/SubPopup";
import Buttons from "../../Buttons/SquareButtons/Buttons";
import InputLabel from "../../Label/InputLabel";
import InputField from "../../InputField/InputField";
import { useDropzone } from "react-dropzone";
import CustomAlert from "../../Alerts/CustomAlert/CustomAlert";
import "./MyAccountDetails.css";
import PasswordStrengthBar from "react-password-strength-bar";
import accountCircle from "../../../Assets/account_circle_24dp.svg";

function MyAccountDetails() {
  const [showSubPopup, setShowSubPopup] = useState(false);
  const [employeeData, setEmployeeData] = useState({
    employeeName: "",
    employeeId: "",
    branchName: "",
    userRoleName: "",
    email: "",
  });
  const [editable, setEditable] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [file, setFile] = useState(null); // State for storing the image file
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showAlertSuccess, setShowAlertSuccess] = useState(false);
  const [showAlertError, setShowAlertError] = useState("");
  const [profilePicExists, setProfilePicExists] = useState(true);
  let user = JSON.parse(sessionStorage.getItem("user"));

  const toggleEditable = () => {
    setEditable(!editable);
  };

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

  const handleCloseSubPopup = () => {
    setShowSubPopup(false);
  };

  useEffect(() => {
    setEmployeeData({
      employeeName: user?.userName || "",
      employeeId: user?.userID || user?.employeeId || "",
      branchName: user?.branchName || "",
      userRoleName: user?.role || "",
      email: user?.email || "",
    });
  }, []);

  const handleUpdate = async () => {
    if (!employeeData.employeeName || !employeeData.email) {
      setShowAlertError("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      setShowAlertError("Passwords do not match");
      return;
    }
    try {
      let body = {};
      const token = sessionStorage.getItem("accessToken");
      let response;
      if (password === "") {
        body = {
          employeeName: employeeData.employeeName,
          branchName: employeeData.branchName,
          userRoleName: employeeData.userRoleName,
          email: employeeData.email,
        };
      } else {
        body = {
          employeeName: employeeData.employeeName,
          branchName: employeeData.branchName,
          userRoleName: employeeData.userRoleName,
          email: employeeData.email,
          password: password,
        };
      }
      const formData = new FormData();
      formData.append("data", JSON.stringify(body));
      if (file) {
        formData.append("image", file);
      }
      response = await fetch(`http://localhost:8080/employees/selfUpdate`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (!response.ok) {
        const data = await response.json();
        console.log("Error:", data.error);
        setShowAlertError(data.error);
      } else {
        const updatedUser = {
          userName: body.employeeName || body.superAdminName,
          userID: employeeData.employeeId,
          branchName: (body.branchName === "None" ? "" : body.branchName) || "",
          role: employeeData.userRoleName,
          email: body.email,
        };
        sessionStorage.setItem("user", JSON.stringify(updatedUser));
        setShowAlertSuccess(true);
      }
    } catch (error) {
      setShowAlertError(true);
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <SubPopup
        triggerComponent={
          <div className="userProfile">
            <div className="profile-dp">
              <img
                className="preview-image"
                src={`https://flexflowstorage01.blob.core.windows.net/cms-data/${user.userID}.png`}
                color="black"
                alt="Profile"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = accountCircle;
                  setProfilePicExists(false);
                }}
              />
            </div>
            <div className="userName">
              <h4>{user.userName || user.employeeName}</h4>
            </div>
          </div>
        }
        popupPosition="0%"
        headBG="none"
        title={
          <>
            My Profile{" "}
            <button>
              <Icon
                icon="tabler:edit"
                style={{ fontSize: "1em", cursor: "pointer" }}
                onClick={toggleEditable}
              />
            </button>
          </>
        }
        headTextColor="black"
        closeIconColor="red"
        show={showSubPopup}
        onClose={handleCloseSubPopup}
        bodyContent={
          <div className="view-profile-form-background">
            <div className="branch-field">
              <InputLabel for="branchName" color="#0377A8">
                Branch
              </InputLabel>
              <InputField
                type="text"
                id="branchName"
                name="branchName"
                value={employeeData.branchName}
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
                  value={employeeData.userRoleName}
                  width="250px"
                />
              </div>
              <div className={editable ? "change-dp" : "change-dp-no-hover"}  {...(editable ? getRootProps() : {})}>
                {editable && (
                  <label className="upload-label" htmlFor="profilePicture">
                    <Icon icon="fluent:camera-add-20-regular" />
                  </label>
                )}
                {imageUrl && (
                  <img className={"preview-image"} src={imageUrl} alt="Preview" />
                )}
                {profilePicExists && !imageUrl ? (
                  <img
                    className="preview-image"
                    src={`https://flexflowstorage01.blob.core.windows.net/cms-data/${user.userID}.png`}
                    alt="Profile"
                  />
                ) : (
                  <img
                    className="preview-image"
                    src={accountCircle}
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
              <InputField
                type="text"
                id="empID"
                name="empID"
                value={employeeData.employeeId}
              />
            </div>
            <div className="emp-name-field">
              <InputLabel for="empName" color="#0377A8">
                Emp Name
              </InputLabel>
              <InputField
                type="text"
                id="empName"
                name="empName"
                value={employeeData.employeeName}
                editable={editable}
                onChange={(e) =>
                  setEmployeeData({
                    ...employeeData,
                    employeeName: e.target.value,
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
                onChange={(e) =>
                  setEmployeeData({ ...employeeData, email: e.target.value })
                }
              />
            </div>
            {editable && (
              <div>
                <div className="password-field">
                  <InputLabel for="userPassword" color="#0377A8">
                    Do you want to change your password?
                  </InputLabel>
                  <InputField
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    placeholder="New Password"
                    value={password}
                    editable={editable}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {password && (
                    <PasswordStrengthBar
                      password={password}
                      minLength={8}
                      scoreWordStyle={{
                        fontSize: "14px",
                        fontFamily: "Poppins",
                      }}
                      scoreWords={[
                        "very weak",
                        "weak",
                        "good",
                        "strong",
                        "very strong",
                      ]}
                      shortScoreWord="should be atlest 8 characters long"
                    />
                  )}
                  <InputField
                    type="password"
                    id="conf_newPassword"
                    name="conf_newPassword"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    editable={editable}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <Buttons
                  type="submit"
                  id="save-btn"
                  btnWidth="22em"
                  style={{ backgroundColor: "#23A3DA", color: "white" }}
                  onClick={handleUpdate}
                >
                  Save
                </Buttons>
              </div>
            )}

            {showAlertSuccess && (
              <CustomAlert
                severity="success"
                title="Success"
                message="Employee updated successfully"
                duration={3000}
                onClose={() => window.location.reload()}
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
        }
      />
    </div>
  );
}

export default MyAccountDetails;
