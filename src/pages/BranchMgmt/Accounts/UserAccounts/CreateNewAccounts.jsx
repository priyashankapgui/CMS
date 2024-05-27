import { React, useState ,useEffect} from 'react'
import { useDropzone } from 'react-dropzone';
import Layout from "../../../../Layout/Layout";
import './CreateNewAccounts.css';
import { Icon } from "@iconify/react";
import { AiOutlineClose } from "react-icons/ai";
import { IoChevronBackCircleOutline } from "react-icons/io5";
import RoundButtons from '../../../../Components/Buttons/RoundButtons/RoundButtons';
import Buttons from '../../../../Components/Buttons/SquareButtons/Buttons';
import InputLabel from '../../../../Components/Label/InputLabel';
import InputField from '../../../../Components/InputField/InputField';
import InputDropdown from '../../../../Components/InputDropdown/InputDropdown';
import dropdownOptions from '../../../../Components/Data.json';
import { Link } from 'react-router-dom';
import CustomAlert from "../../../../Components/Alerts/CustomAlert/CustomAlert";


export function CreateNewAccounts() {
    const [employeeData, setEmployeeData] = useState({
        employeeId: "",
        employeeName:"",
        email: "",
        password: "",
        role: "",
        branchId: "",
        phone: "",
        address: ""
    }); // State for storing employee data
    const [imageUrl, setImageUrl] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showAlertSuccess, setShowAlertSuccess] = useState(false);
    const [showAlertError, setShowAlertError] = useState("");
    // const [selectedBranch, setSelectedBranch] = useState();
    const [branches, setBranches] = useState([]);
    const [displayBracnhes, setDisplayBranches] = useState([]);
    

    // Fetch branches when component mounts
    useEffect(() => {
        getBranches();
    }, []);


    const getBranches = async () => {
        try {
            const token = sessionStorage.getItem("accessToken");
            const response = await fetch("http://localhost:8080/branches", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch data");
            }
            let data = await response.json();
            data = data.map((branch) => {
                return {
                    value: branch.branchId,
                    label: branch.branchName,
                };
            });
            const displayBranches = data.map((branch) => branch.label);
            setDisplayBranches(displayBranches);
            console.log("Branches data:", data);
            setBranches(data);
            setEmployeeData({...employeeData, branchId: data[0].value});
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleCreateAccount = async () => {
        console.log("Employee data:", employeeData);
        if (!employeeData.employeeName || !employeeData.email || !employeeData.password || !employeeData.role || !employeeData.branchId || !employeeData.phone || !employeeData.address) {
            setShowAlertError("Please fill in all fields")
            return;
          }
          if (employeeData.password !== confirmPassword) {
            setShowAlertError("Passwords do not match");
            return;
          }

        try {
            const token = sessionStorage.getItem("accessToken");
            const response = await fetch("http://localhost:8080/employees", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(employeeData),
            });

            if (!response.ok) {
                const data = await response.json();
                console.log("Error:", data.error);
                setShowAlertError(data.error);
            } else{
                setShowAlertSuccess(true);
            }
        }
        catch(error) {
            setShowAlertError(true);
            console.error("Error:", error);
        }
    }


    const handleDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
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


    const handleBranchChange = (branch) => {
        const selectedBranch = branches.find(
            (b) => b.label === branch
        );
        setEmployeeData({
            ...employeeData,
            branchId: selectedBranch.value,
        });
        // console.log("Selected branch:", selectedBranch);
        }


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
              <InputDropdown
                id="branchName"
                name="branchName"
                editable={true}
                options={displayBracnhes}
                onChange={(branch) => handleBranchChange(branch)}
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
                  editable={true}
                  options={dropdownOptions.dropDownOptions.userRoleOptions}
                  onChange={(role) => setEmployeeData({ ...employeeData, role })}
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
                editable={true}
                value={employeeData.employeeId}
                onChange={(e) =>
                    setEmployeeData({ ...employeeData, employeeId: e.target.value })
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
                    setEmployeeData({ ...employeeData, employeeName: e.target.value })
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
                Telephone 
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
                type="password"
                id="tempPassword"
                name="tempPassword"
                editable={true}
                value={employeeData.password}
                onChange={(e) =>
                    setEmployeeData({ ...employeeData, password: e.target.value })
                }
              />
              <InputLabel for="tempConPassword" color="#0377A8">
                Confirm Password
              </InputLabel>
              <InputField
                type="password"
                id="tempConPassword"
                name="tempPassword"
                editable={true}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                
              />
            </div>
            <Buttons
              type="submit"
              id="create-btn"
              style={{ backgroundColor: "#23A3DA", color: "white" }}
              onClick={handleCreateAccount}
            >
              {" "}
              Create{" "}
            </Buttons>
          </div>

          {showAlertSuccess && (
          <CustomAlert
            severity="success"
            title="Success"
            message="Employee updated successfully"
            duration={3000}
            onClose={() => {window.location.href = "/accounts"}}
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

        </Layout>
      </>
    );
}


