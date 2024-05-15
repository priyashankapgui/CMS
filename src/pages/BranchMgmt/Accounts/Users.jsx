import Layout from "../../../Layout/Layout";
import { Link } from "react-router-dom";
import "./Users.css";
import Label from "../../../Components/Label/InputLabel";
import dropdownOptions from "../../../Components/Data.json";
import InputDropdown from "../../../Components/InputDropdown/InputDropdown";
import Buttons from "../../../Components/Buttons/Buttons";
import InputField from "../../../Components/InputField/InputField";
import TableWithPagi from "../../../Components/Tables/TableWithPagi";
import { useEffect, useState } from "react";
//import { Telegram } from "@mui/icons-material";

export const Users = () => {
  const [employeeData, setEmployeeData] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("All");
  const [selectedRole, setSelectedRole] = useState("All");
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  // const filteredEmployees = selectedBranch
  // ? employeeData.filter((employee) => employee.branchName === selectedBranch)
  // : employeeData;

  // Filtered employees based on selected branch and role

  useEffect(() => {
    const getEmployeeData = async () => {
      const token = sessionStorage.getItem("accessToken");
      const response = await fetch("http://localhost:8080/api/employees", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }).catch((error) => console.error("Error:", error));
      if (response.ok) {
        const data = await response.json();
        setEmployeeData(data);
      }
    };
    getEmployeeData();
  }, []);

  useEffect(() => {
    const filterEmployees = () => {
      const data = employeeData.filter((employee) => {
        if (selectedBranch === 'All' && selectedRole === 'All') {
          return true; // If both filters are empty, return all employees
        } else if (selectedBranch && selectedRole === 'All') {
          return employee.branchName === selectedBranch;
        } else if (selectedRole && selectedBranch === 'All') {
          return employee.role === selectedRole;
        } else if (selectedBranch && selectedRole) {
          return (
            employee.branchName === selectedBranch && employee.role === selectedRole
          );
        } else {
          // This shouldn't be reached, but added for completeness
          return false;
        }
      });
      console.log(data);
      console.log(selectedBranch);
      console.log(employeeData)
      setFilteredEmployees(data);
    };
    filterEmployees();
  }, [selectedBranch, selectedRole, employeeData]);

  return (
    <>
      <div className="accounts">
        <h4>Accounts</h4>
      </div>
      <Layout>
        <div className="linkDiv">
          <Link className="link" to="/Users">
            Users
          </Link>
          <Link className="link" to="/UserRoleMgmt">
            User Role Mgmt
          </Link>
        </div>
        <div className="account">
          <div className="ContainerTop">
            <div className="BranchField">
              <Label color="#0377A8">Branch</Label>
              <InputDropdown
                id="branchName"
                name="branchName"
                editable={true}
                options={dropdownOptions.dropDownOptions.branchName}
                onChange={(selectedOption) => setSelectedBranch(selectedOption)}
              />
            </div>
            <div className="UserRoleField">
              <Label color="#0377A8">Role</Label>
              <InputDropdown
                id="role"
                name="role"
                editable={true}
                options={dropdownOptions.dropDownOptions.role}
                onChange={(selectedOption) => setSelectedRole(selectedOption)}
              />
            </div>
            <div className="EmpidField">
              <Label color="#0377A8">Emp ID</Label>
              <InputField
                id="empID"
                name="empID"
                width="15.625em"
                borderRadius="0.625em"
                style={{ border: "1px solid #8D9093" }}
              ></InputField>
            </div>
          </div>
          <hr className="line" />
          <div className="Button">
            <Buttons
              type="submit"
              id="save-btn"
              style={{ backgroundColor: "#23A3DA", color: "white" }}
            >
              {" "}
              Save{" "}
            </Buttons>
            <Buttons
              type="clear"
              id="clear-btn"
              style={{ backgroundColor: "#FFFFFF", color: "red" }}
            >
              Clear
            </Buttons>
            <Buttons
              type="submit"
              id="new-btn"
              style={{ backgroundColor: "white", color: "#23A3DA" }}
            >
              New +
            </Buttons>
          </div>
          <hr className="line" />
          <TableWithPagi
            columns={[
              "Branch Name",
              "Emp ID",
              "Emp Name",
              "Email",
              "Telephone",
              "Role",
            ]}
            rows={filteredEmployees.map((employee) => ({
              branch: employee.branchName,
              empId: employee.employeeId,
              empName: employee.employeeName,
              email: employee.email,
              Telephone: employee.phone,
              role: employee.role,
            }))}
          />
        </div>
      </Layout>
    </>
  );
};
