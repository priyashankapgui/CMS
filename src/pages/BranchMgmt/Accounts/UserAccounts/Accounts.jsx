import React, { useState, useEffect } from "react";
import Layout from "../../../../Layout/Layout";
import "./Accounts.css";
import { Link } from "react-router-dom";
import InputLabel from "../../../../Components/Label/InputLabel";
import Buttons from "../../../../Components/Buttons/SquareButtons/Buttons";
import InputField from "../../../../Components/InputField/InputField";
import TableWithPagi from "../../../../Components/Tables/TableWithPagi";
import DeletePopup from "../../../../Components/PopupsWindows/DeletePopup";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { Icon } from "@iconify/react";
import BranchDropdown from "../../../../Components/InputDropdown/BranchDropdown";
import UserRoleDropdown from "../../../../Components/InputDropdown/UserRoleDropdown";
import CustomAlert from "../../../../Components/Alerts/CustomAlert/CustomAlert";

export function Accounts() {
  const [clickedLink, setClickedLink] = useState("Users");
  const [employeeData, setEmployeeData] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("All");
  const [selectedRole, setSelectedRole] = useState("All");
  const [empIdSearch, setEmpIdSearch] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertSuccess, setShowAlertSuccess] = useState(false);
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  useEffect(() => {
    const getEmployeeData = async () => {
      try {
        const token = sessionStorage.getItem("accessToken");
        const response = await fetch("http://localhost:8080/api/employees", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        setEmployeeData(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    getEmployeeData();
  }, []);

  // useEffect(() => {
  //   const filterEmployees = () => {
  //     const data = employeeData.filter((employee) => {
  //       if (selectedBranch === "All" && selectedRole === "All") {
  //         return true; // If both filters are empty, return all employees
  //       } else if (selectedBranch && selectedRole === "All") {
  //         return employee.branchName === selectedBranch;
  //       } else if (selectedRole && selectedBranch === "All") {
  //         return employee.role === selectedRole;
  //       } else if (selectedBranch && selectedRole) {
  //         return (
  //           employee.branchName === selectedBranch &&
  //           employee.role === selectedRole
  //         );
  //       } else {
  //         // This shouldn't be reached, but added for completeness
  //         return false;
  //       }
  //     });
  //     setFilteredEmployees(data);
  //   };
  //   filterEmployees();
  // }, [selectedBranch, selectedRole, employeeData]);

  useEffect(() => {
    const filterEmployees = () => {
      const data = employeeData.filter((employee) => {
        const branchMatch =
          selectedBranch === "All" || employee.branchName === selectedBranch;
        const roleMatch =
          selectedRole === "All" || employee.userRoleName === selectedRole;
        return branchMatch && roleMatch;
      });
      setFilteredEmployees(data);
    };
    filterEmployees();
  }, [selectedBranch, selectedRole, employeeData]);

  const handleDropdownBranchChange = (value) => {
    setSelectedBranch(value);
    // console.log(value)
  };

  const handleDropdownRoleChange = (value) => {
    setSelectedRole(value);
    // console.log(value)
  };

  const handleCheck = (employeeId, editRole, editBranch) => {
    setShowAlert(false);
    console.log("Employee ID:", employeeId, "Branch:", editBranch);
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user.role === "superadmin" || user.branchName === editBranch) {
      window.location.href = `/accounts/update-account?employeeId=${employeeId}`;
    } else {
      console.log("User is not authorized to edit");
      setShowAlert(true);
    }
  };

  const handleLinkClick = (linkText) => {
    setClickedLink(linkText);
  };

  const handleDelete = async (employeeId) => {
    try {
      const token = sessionStorage.getItem("accessToken");
      if (!employeeId) {
        console.error("employeeId is undefined");
        return;
      }
      const response = await fetch(
        `http://localhost:8080/employees/${employeeId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        // Success response
        // Filter out the deleted employee from the state
        const updatedEmployees = filteredEmployees.filter(
          (employee) => employee.employeeId !== employeeId
        );
        setFilteredEmployees(updatedEmployees);
        setShowAlertSuccess(true);
        console.log("Employee deleted:", employeeId);
      } else {
        const data = await response.json();
        console.error("Error deleting employee:", data.error);
        setShowAlert(true);
        return;
        // Handle error (e.g., display an error message)
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
      return;
      // Handle error (e.g., display an error message)
    }
  };

  const handleSearch = () => {
    const data = employeeData.filter((employee) => {
      const matchesEmpId =
        !empIdSearch || employee.employeeId.toString().includes(empIdSearch);

      return matchesEmpId;
    });
    setFilteredEmployees(data);
  };

  const handleClear = () => {
    setSelectedBranch("All");
    setSelectedRole("All");
    setEmpIdSearch("");
    // Reset filteredEmployees to display all data
    setFilteredEmployees(employeeData);
  };

  return (
    <>
      <div className="top-nav-blue-text">
        <h4>Accounts - {clickedLink}</h4>
      </div>
      <Layout>
        <div className="linkActions-account-users">
          <div className={clickedLink === "Users" ? "clicked" : ""}>
            <Link to="" onClick={() => handleLinkClick("Users")}>
              Users
            </Link>
          </div>
          <div className={clickedLink === "User Role Mgmt" ? "clicked" : ""}>
            <Link
              to="/accounts/user-roles"
              onClick={() => handleLinkClick("User Role Mgmt")}
            >
              User Role Mgmt
            </Link>
          </div>
        </div>

        <div className="account-user-section">
          <div className="account-user-filter">
            <h3 className="account-user-title">Registered Users</h3>
            <div className="account-users-top">
              <div className="BranchField">
                <InputLabel color="#0377A8">Branch</InputLabel>
                <BranchDropdown
                  id="branchName"
                  name="branchName"
                  editable={true}
                  onChange={(e) => handleDropdownBranchChange(e)}
                  addOptions={["All"]}
                />
              </div>
              <div className="UserRoleField">
                <InputLabel color="#0377A8">Role</InputLabel>
                <UserRoleDropdown
                  id="roleName"
                  name="roleName"
                  editable={true}
                  onChange={(e) => handleDropdownRoleChange(e)}
                  addOptions={["All"]}
                  removeOptions={["superadmin"]}
                />
              </div>
              <div className="EmpidField">
                <InputLabel color="#0377A8">Emp ID</InputLabel>
                <div className="EmpidField-Section">
                  <InputField
                    id="empID"
                    name="empID"
                    width="15.625em"
                    editable={true}
                    value={empIdSearch}
                    onChange={(e) => setEmpIdSearch(e.target.value)}
                    borderRadius="0.625em"
                    style={{ border: "1px solid #8D9093" }}
                  />

                  <Buttons
                    type="submit"
                    id="search-btn"
                    marginTop="4.0715px"
                    btnHeight="1.8em"
                    style={{ backgroundColor: "#23A3DA", color: "white" }}
                    onClick={handleSearch}
                  >
                    Search
                  </Buttons>
                </div>
              </div>
            </div>
            <hr className="line" />
            <div className="Button-Section">
              <Buttons
                type="clear"
                id="clear-btn"
                style={{ backgroundColor: "#FFFFFF", color: "red" }}
                onClick={handleClear}
              >
                Clear
              </Buttons>
              <Link to="/accounts/create-new-accounts">
                <Buttons
                  type="submit"
                  id="new-btn"
                  style={{ backgroundColor: "white", color: "#23A3DA" }}
                >
                  New +
                </Buttons>
              </Link>
            </div>
          </div>
          <div className="account-users-middle">
            <TableWithPagi
              columns={[
                "Branch Name",
                "Emp ID",
                "Emp Name",
                "Gender",
                "Telephone",
                "User Role",
                "",
              ]}
              rows={filteredEmployees.map((employee) => ({
                branch: employee.branchName,
                empId: employee.employeeId,
                empName: employee.employeeName,
                email: employee.email,
                Telephone: employee.phone,
                role: employee.userRoleName,
                action: (
                  <div style={{ display: "flex", gap: "0.7em" }}>
                    <button
                      className="edit-button"
                      onClick={() =>
                        handleCheck(
                          employee.employeeId,
                          employee.role,
                          employee.branchName
                        )
                      }
                    >
                      <Icon
                        icon="bitcoin-icons:edit-outline"
                        style={{ fontSize: "24px" }}
                      />
                    </button>
                    <DeletePopup
                      handleDelete={() => handleDelete(employee.employeeId)}
                    />
                  </div>
                ),
              }))}
            />
          </div>
          {showAlert && (
            <CustomAlert
              severity="error"
              title="Error"
              message={showAlert}
              duration={3000}
              onClose={() => showAlert("")}
            />
          )}
        </div>
        {showAlertSuccess && (
          <CustomAlert
            severity="success"
            title="Success"
            message="Employee updated successfully"
            duration={3000}
            onClose={() => {
              window.location.reload();
            }}
          />
        )}
      </Layout>
    </>
  );
}
