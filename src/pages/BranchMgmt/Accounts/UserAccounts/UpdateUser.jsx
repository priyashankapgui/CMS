import { React, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import Layout from "../../../../Layout/Layout";
import "./UpdateUser.css";
import { Icon } from "@iconify/react";
import { AiOutlineClose } from "react-icons/ai";
import { IoChevronBackCircleOutline } from "react-icons/io5";
import RoundButtons from "../../../../Components/Buttons/RoundButtons/RoundButtons";
import Buttons from "../../../../Components/Buttons/SquareButtons/Buttons";
import InputLabel from "../../../../Components/Label/InputLabel";
import InputField from "../../../../Components/InputField/InputField";
import InputDropdown from "../../../../Components/InputDropdown/InputDropdown";
import datafile from "../../../../Components/Data.json";
import CustomAlert from "../../../../Components/Alerts/CustomAlert/CustomAlert";
import { Link } from "react-router-dom";

export function UpdateUser() {
  const [employeeData, setEmployeeData] = useState({}); // State for storing employee data
  const [imageUrl, setImageUrl] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState();
  const [branches, setBranches] = useState([]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showAlertSuccess, setShowAlertSuccess] = useState(false);
  const [showAlertError, setShowAlertError] = useState("");

  useEffect(() => {
    let tempBranches = datafile.dropDownOptions.branchOptions;
    tempBranches = tempBranches.filter((branch) => branch !== 'All' && branch !== employeeData.branchName);
    tempBranches = employeeData.branchName ? [employeeData.branchName].concat(tempBranches) : tempBranches;
    setBranches(tempBranches);
  }, [employeeData.branchName]);


  const urlParams = new URLSearchParams(window.location.search);
  const employeeId = urlParams.get("employeeId");

  useEffect(() => {
    const getEmployeeData = async () => {
      try {
        const token = sessionStorage.getItem("accessToken");
        const response = await fetch(`http://localhost:8080/employees/${employeeId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        console.log("Employee data:", data);
        setEmployeeData(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    getEmployeeData();
  }, [employeeId]);


  const handleUpdate = async () => {
    if (!employeeData.employeeName || !employeeData.email) {
      setShowAlertError("Please fill in all fields")
      return;
    }
    if (password !== confirmPassword) {
      setShowAlertError("Passwords do not match");
      return;
    }
      try {
        const token = sessionStorage.getItem("accessToken");
        const response = await fetch(`http://localhost:8080/employees/${employeeId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              employeeName: employeeData.employeeName,
              branchName: selectedBranch,
              email: employeeData.email,
              password: password,
            })
          }
        )
        if (!response.ok) {
          const data = await response.json();
          console.log("Error:", data.error);
          setShowAlertError(data.error);
        }else{
          setShowAlertSuccess(true);
        }
      }
        catch(error)
        {
          setShowAlertError(true);
          console.error("Error:", error);
        }
    
}



  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };


  const handleDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = () => {
      setImageUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: "",
    multiple: false,
    onDrop: handleDrop,
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
          <h4>Update Account</h4>
        </div>
      </div>
      <Layout>
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
            <InputDropdown
              id="branchName"
              name="branchName"
              editable={true}
              onChange={(selectedOption) =>
                setSelectedBranch(selectedOption)
              }
              options={branches}
            />
          </div>
          <div className="flex-content-NA">
            <div className="user-role-field">
              <InputLabel for="userRole" color="#0377A8">
                User Role
              </InputLabel>
              <InputDropdown
                id="userRole"
                name="userRole"
                editable={false}
                options={employeeData.role ? [employeeData.role] : []}
              />
            </div>
            <div className="add-dp-NA" {...getRootProps()}>
              {imageUrl && (
                <img className="preview-image" src={imageUrl} alt="Preview" />
              )}
              <label className="upload-label" htmlFor="profilePicture">
                <Icon
                  icon="fluent:camera-add-20-regular"
                  style={{ fontSize: "0.813em" }}
                />
              </label>
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop the image here...</p>
              ) : (
                <p>Drag 'n' drop or click to select an image</p>
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
            editable={false} />
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
                setEmployeeData({ ...employeeData, employeeName: e.target.value })
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
              onChange={(e) =>
                setEmployeeData({ ...employeeData, email: e.target.value })
              }
              editable={true}
            />
          </div>
          <div className="password-field">
            <InputLabel for="tempPassword" color="#0377A8">
              Password
            </InputLabel>
            <InputField
              type="password"
              id="tempPassword"
              name="tempPassword"
              value={password}
              onChange={handlePasswordChange}
              editable={true}
            />
            <InputLabel for="tempConPassword" color="#0377A8">
              Confirm Password
            </InputLabel>
            <InputField
              type="password"
              id="tempConPassword"
              name="tempPassword"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              editable={true}

            />
          </div>
          <Buttons
            type="submit"
            id="create-btn"
            style={{ backgroundColor: "#23A3DA", color: "white" }}
            onClick={handleUpdate}
          >
            Save
          </Buttons>
        </div>

        {showAlertSuccess && (
          <CustomAlert
            severity="success"
            title="Success"
            message="Employee updated successfully"
            duration={3000}
          />
        )}

        {showAlertError && (
          <CustomAlert
            severity="error"
            title="Error"
            message={showAlertError}
            duration={10000}
          />
        )}


      </Layout>
    </>
  );
}
