import { React, useCallback, useState} from 'react'
import { useDropzone } from 'react-dropzone';
import { useNavigate } from "react-router-dom";
import Layout from "../../../../Layout/Layout";
import './CreateNewAccounts.css';
import { Icon } from "@iconify/react";
import { AiOutlineClose } from "react-icons/ai";
import { IoChevronBackCircleOutline } from "react-icons/io5";
import PasswordStrengthBar from 'react-password-strength-bar';
import RoundButtons from '../../../../Components/Buttons/RoundButtons/RoundButtons';
import Buttons from '../../../../Components/Buttons/SquareButtons/Buttons';
import InputLabel from '../../../../Components/Label/InputLabel';
import InputField from '../../../../Components/InputField/InputField';
import { Link } from 'react-router-dom';
import CustomAlert from "../../../../Components/Alerts/CustomAlert/CustomAlert";
import BranchDropdown from '../../../../Components/InputDropdown/BranchDropdown';
import UserRoleDropdown from '../../../../Components/InputDropdown/UserRoleDropdown';
import SubSpinner from '../../../../Components/Spinner/SubSpinner/SubSpinner';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import secureLocalStorage from 'react-secure-storage';
import { createEmployee } from '../../../../Api/BranchMgmt/UserAccountsAPI';


export function CreateNewAccounts() {
    const [employeeData, setEmployeeData] = useState({
        employeeId:"",
        employeeName:"",
        email: "",
        password: "",
        userRoleName: "",
        branchName: "",
        phone: "",
        address: ""
    }); // State for storing employee data
    const [imageUrl, setImageUrl] = useState(null);
    const [file, setFile] = useState(null); // State for storing the image file
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showAlertSuccess, setShowAlertSuccess] = useState(false);
    const [showAlertError, setShowAlertError] = useState("");
    const [loading, setLoading] = useState(false); // State for showing spinner
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const currentUser = JSON.parse(secureLocalStorage.getItem('user'));
    const navigate = useNavigate();

    
    const handleBranchChange = useCallback((branch) => {   
        setEmployeeData(e => ({
          ...e,
          branchName: branch
        })
        );
    }, []);

    const handleUserRoleChange = useCallback((role) => {
      setEmployeeData(e => ({
        ...e,
        userRoleName: role
      })
      );
    }, []);

    const toggleShowPassword = () => {
      setShowPassword(!showPassword);
    };
  
    const toggleShowConfirmPassword = () => {
      setShowConfirmPassword(!showConfirmPassword);
    };

    const handleCreateAccount = async () => {
      setLoading(true);
      //console.log("Employee data:", employeeData);
      try {
      if (!employeeData.employeeId || !employeeData.employeeName || !employeeData.password || !employeeData.userRoleName || !employeeData.branchName) {
          throw new Error("Please fill in required fields");
        }
        if (employeeData.password !== confirmPassword) {
          throw new Error("Passwords do not match");
        };
        const token = secureLocalStorage.getItem("accessToken");
        const formData = new FormData();
        // Append the employee data as a string
        formData.append('employee', JSON.stringify(employeeData));
        // Append the image file
        if(file){
          formData.append('image', file);
        }
        const response = await createEmployee(formData, token);
        if (response.status !== 201) {
          const data = await response.data;
          console.log("Error:", data.error);
          setShowAlertError(data.error);
        } else{
          setShowAlertSuccess(true);
        }
        setLoading(false);
      }
      catch(error) {
          setShowAlertError(error.message);
          console.error("Error:", error);
          setLoading(false);
      }
    }


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
        accept: '',
        multiple: false,
        onDrop: handleDrop
    });



    return (
      <>
        <div className="top-nav-blue-text">
          <div className="new-account-top-link">
            <Link to="/accounts">
              <IoChevronBackCircleOutline
                style={{ fontSize: "22px", color: "#0377A8" }}
              />
            </Link>
            <h4>New Account</h4>
          </div>
        </div>
        <Layout>
          <div className="new-account-form-background">
            <div className="new-account-form-title">
              <h3>New Account</h3>
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
                onChange={(branch) => handleBranchChange(branch)}
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
                  onChange={(role) => handleUserRoleChange(role)}
                  removeOptions={["superadmin",currentUser.role]}
                  filterByBranch={employeeData.branchName}
                />
              </div>
              <div className="add-dp-NA" {...getRootProps()}>
                <label className="upload-label" htmlFor="profilePicture">
                  <Icon
                    icon="fluent:camera-add-20-regular"
                    style={{ fontSize: "0.813em" }}
                  />
                {imageUrl && (
                  <img className="preview-image" src={imageUrl} alt="Preview" />
                )}
                </label>
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p>Drop the image here...</p>
                ) : (
                  null
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
                editable={true}
                value={employeeData.employeeId}
                onChange={(e) =>
                  setEmployeeData({
                    ...employeeData,
                    employeeId: e.target.value,
                  })
                }
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
                editable={true}
                value={employeeData.employeeName}
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
                placeholder="abc@greenleaf.com"
                editable={true}
                value={employeeData.email}
                onChange={(e) =>
                  setEmployeeData({ ...employeeData, email: e.target.value })
                }
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
                onChange={(e) =>
                  setEmployeeData({ ...employeeData, phone: e.target.value })
                }
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
                onChange={(e) =>
                  setEmployeeData({ ...employeeData, address: e.target.value })
                }
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
                editable={true}
                value={employeeData.password}
                onChange={(e) =>
                  setEmployeeData({ ...employeeData, password: e.target.value })
                }
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
              {showPassword ? <FaEye /> : < FaEyeSlash />}
            </button>
            </InputField>

              {employeeData.password && (
                <PasswordStrengthBar
                  password={employeeData.password}
                  minLength={8}
                  scoreWordStyle={{
                    fontSize: "14px",
                    fontFamily: "Poppins",
                  }}
                  scoreWords={['very weak', 'weak', 'good', 'strong', 'very strong']}
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
                editable={true}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                    {showConfirmPassword ? <FaEye /> : < FaEyeSlash />}
                </button>
            </InputField>
            </div>
            {loading ? (
              <SubSpinner spinnerText='Creating' />
            ) : (
              <Buttons
                type="submit"
                id="create-btn"
                style={{ backgroundColor: "#23A3DA", color: "white" }}
                btnWidth="22em"
                onClick={handleCreateAccount}
              >
                {" "}
                Create{" "}
              </Buttons>
            )}
          </div>

          {showAlertSuccess && (
            <CustomAlert
              severity="success"
              title="Success"
              message="Employee updated successfully"
              duration={1500}
              onClose={() => {
                // window.location.href = "/accounts";
                navigate("/accounts", { state: { reload: true } });
              }}
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


