import { React, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import Layout from "../../../../Layout/Layout";
import "./UpdateUser.css";
import { Icon } from "@iconify/react";
import { AiOutlineClose } from "react-icons/ai";
import { IoChevronBackCircleOutline } from "react-icons/io5";
import RoundButtons from "../../../../Components/Buttons/RoundButtons/RoundButtons";
import Buttons from "../../../../Components/Buttons/SquareButtons/Buttons";
import InputLabel from "../../../../Components/Label/InputLabel";
import InputField from "../../../../Components/InputField/InputField";
import CustomAlert from "../../../../Components/Alerts/CustomAlert/CustomAlert";
import { Link } from "react-router-dom";
import BranchDropdown from "../../../../Components/InputDropdown/BranchDropdown";
import UserRoleDropdown from "../../../../Components/InputDropdown/UserRoleDropdown";
import PasswordStrengthBar from "react-password-strength-bar";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import secureLocalStorage from "react-secure-storage";
import { getEmployeeById, updateEmployee } from "../../../../Api/BranchMgmt/UserAccountsAPI";
import SubSpinner from "../../../../Components/Spinner/SubSpinner/SubSpinner";

export function UpdateUser() {
  const [employeeData, setEmployeeData] = useState({}); // State for storing employee data
  const [imageUrl, setImageUrl] = useState(null);
  const [file, setFile] = useState(null); // State for storing the image file
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showAlertSuccess, setShowAlertSuccess] = useState(false);
  const [showAlertError, setShowAlertError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [initialBranch, setInitialBranch] = useState("");
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const currentUser = JSON.parse(secureLocalStorage.getItem("user"));
  const navigate = useNavigate();

  const urlParams = new URLSearchParams(window.location.search);
  const employeeId = urlParams.get("employeeId");

  useEffect(() => {
    const getEmployeeData = async () => {
      try {
        setLoading(true);
        const token = secureLocalStorage.getItem("accessToken");
        const response = await getEmployeeById(employeeId, token);
        if (response.status !== 200) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.data;
        console.log("Employee data:", data);
        setEmployeeData(data);
        setInitialBranch(data.branchName);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    getEmployeeData();
  }, [employeeId]);

  const handleBranchChange = (branch) => {
    setEmployeeData({
      ...employeeData,
      branchName: branch,
    });
  };

  const handleUserRoleChange = (role) => {
    setEmployeeData({
      ...employeeData,
      userRoleName: role,
    });
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleUpdate = async () => {
    setButtonLoading(true);
    if (!employeeData.employeeName || !employeeData.email) {
      setShowAlertError("Please fill the rquired fields");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(employeeData.email)) {
      setShowAlertError("Invalid email format");
      return;
    }
    if (password !== confirmPassword) {
      setShowAlertError("Passwords do not match");
      return;
    }
    let body = {};
    if (password === "") {
      body = {
        employeeName: employeeData.employeeName,
        branchName: employeeData.branchName,
        email: employeeData.email,
        phone: employeeData.phone,
        address: employeeData.address,
        userRoleName: employeeData.userRoleName,
      };
    } else {
      body = {
        employeeName: employeeData.employeeName,
        branchName: employeeData.branchName,
        email: employeeData.email,
        phone: employeeData.phone,
        address: employeeData.address,
        password: password,
        userRoleName: employeeData.userRoleName,
      };
    }
    try {
      const token = secureLocalStorage.getItem("accessToken");
      const formData = new FormData();
      formData.append("data", JSON.stringify(body));
      if (file) {
        formData.append("image", file);
      }
      const response = await updateEmployee(employeeId, formData, token);
      if (response.status !== 200) {
        const data = await response.data;
        console.log("Error:", data.error);
        setShowAlertError(data.error);
      } else {
        setShowAlertSuccess(true);
      }
    } catch (error) {
      setShowAlertError(error.message);
      console.error("Error:", error);
    }
    setButtonLoading(false);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    setFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setImageUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/webp": [],
    },
    multiple: false,
    onDrop: handleDrop,
  });

  return (
    <>
      <div className="top-nav-blue-text">
        <div className="new-account-top-link">
          <Link to="/accounts">
            <IoChevronBackCircleOutline style={{ fontSize: "22px", color: "#0377A8" }} />
          </Link>
          <h4>Update Account</h4>
        </div>
      </div>
      <Layout>
        {loading ? (
          <SubSpinner />
        ) : (
          <div className="new-account-form-background">
            <div className="new-account-form-title">
              <h3>Update Account</h3>
              <Link to="/accounts">
                <RoundButtons
                  id="cancelBillBtn"
                  type="submit"
                  name="cancelBillBtn"
                  icon={
                    <AiOutlineClose
                      style={{ color: "red" }}
                      onClick={() => console.log("Close Button clicked")}
                    />
                  }
                />
              </Link>
            </div>
            <div className="branch-field">
              <InputLabel for="branchName" color="#0377A8">
                Branch
              </InputLabel>
              <BranchDropdown
                id="branchName"
                name="branchName"
                editable={true}
                onChange={(e) => handleBranchChange(e)}
                displayValue={initialBranch}
              />
            </div>
            <div className="flex-content-NA">
              <div className="user-role-field">
                <InputLabel for="userRole" color="#0377A8">
                  User Role
                </InputLabel>
                <UserRoleDropdown
                  id="userRole"
                  name="userRole"
                  editable={true}
                  onChange={(e) => handleUserRoleChange(e)}
                  filterByBranch={employeeData.branchName}
                  displayValue={employeeData.userRoleName}
                  removeOptions={[currentUser.role]}
                />
              </div>
              <div className="add-dp-NA" {...getRootProps()}>
                <label className="upload-label" htmlFor="profilePicture">
                  <Icon icon="fluent:camera-add-20-regular" style={{ fontSize: "0.813em" }} />
                </label>
                {imageUrl && <img className="preview-image" src={imageUrl} alt="Preview" />}
                {!imageUrl && (
                  <img
                    className="preview-image"
                    src={`https://flexflowstorage01.blob.core.windows.net/cms-data/${employeeId}.png`}
                    alt="Profile"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `${process.env.PUBLIC_URL}/Images/account_circle.svg`;
                    }}
                  />
                )}
                <input {...getInputProps()} />
                {isDragActive ? <p>Drop the image here...</p> : null}
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
                editable={false}
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
                onChange={(e) =>
                  setEmployeeData({
                    ...employeeData,
                    employeeName: e.target.value,
                  })
                }
                editable={true}
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
                onChange={(e) => setEmployeeData({ ...employeeData, email: e.target.value })}
                editable={true}
              />
            </div>
            <div className="phone-field">
              <InputLabel for="empPhone" color="#0377A8">
                Telephone (Optional)
              </InputLabel>
              <InputField
                type="text"
                id="empPhone"
                name="empPhone"
                editable={true}
                value={employeeData.phone}
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
                editable={true}
                value={employeeData.address}
                onChange={(e) => setEmployeeData({ ...employeeData, address: e.target.value })}
              />
            </div>
            <div className="password-field">
              <InputLabel for="tempPassword" color="#0377A8">
                Password
              </InputLabel>
              <InputField
                type={showPassword ? "text" : "password"}
                id="tempPassword"
                name="tempPassword"
                value={password}
                onChange={handlePasswordChange}
                editable={true}
              >
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  className="toggle-password-button"
                  style={{
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </button>
              </InputField>
              {password && (
                <PasswordStrengthBar
                  password={password}
                  minLength={8}
                  scoreWordStyle={{
                    fontSize: "14px",
                    fontFamily: "Poppins",
                  }}
                  scoreWords={["very weak", "weak", "good", "strong", "very strong"]}
                  shortScoreWord="should be atlest 8 characters long"
                />
              )}
              <InputLabel for="tempConPassword" color="#0377A8">
                Confirm Password
              </InputLabel>
              <InputField
                type={showConfirmPassword ? "text" : "password"}
                id="tempConPassword"
                name="tempPassword"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                editable={true}
              >
                <button
                  type="button"
                  onClick={toggleShowConfirmPassword}
                  className="toggle-password-button"
                  style={{
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                </button>
              </InputField>
            </div>
            {buttonLoading ? (
              <SubSpinner spinnerText="Updating" />
            ) : (
              <Buttons
                type="submit"
                id="create-btn"
                style={{ backgroundColor: "#23A3DA", color: "white" }}
                btnWidth="22em"
                onClick={handleUpdate}
              >
                Save
              </Buttons>
            )}
          </div>
        )}
        {showAlertSuccess && (
          <CustomAlert
            severity="success"
            title="Success"
            message="Employee updated successfully"
            duration={3000}
            onClose={() =>
              // window.history.back()
              navigate("/accounts")
            }
          />
        )}

        {showAlertError && (
          <CustomAlert
            severity="error"
            title="Error"
            message={showAlertError}
            duration={3000}
            onClose={() => setShowAlertError("")}
          />
        )}
      </Layout>
    </>
  );
}
