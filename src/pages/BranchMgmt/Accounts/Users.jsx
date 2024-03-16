import Layout from "../../../Layout/Layout";
import { Link } from "react-router-dom";
import './Users.css';
import Label from "../../../Components/Label/InputLabel";
import dropdownOptions from "../../../Components/Data.json";
import InputDropdown from "../../../Components/InputDropdown/InputDropdown";
import Buttons from "../../../Components/Buttons/Buttons";
import InputField from "../../../Components/InputField/InputField"
export const Users = () => {
    return (
        <>
            <div className="accounts">
                <h4>Accounts</h4>
            </div>
            <Layout>
            <div className="linkDiv">
                    <Link className="link" to="/Users">Users</Link>
                    <Link className="link" to="/UserRoleMgmt">User Role Mgmt</Link>
                </div>
                <div className="account">
                    
                    <div className="ContainerTop">
                        <div className="BranchField">
                            <Label color="#0377A8">Branch</Label>
                            <InputDropdown id="branchName" name="branchName" editable={true} options={dropdownOptions.dropDownOptions.branchOptions} />
                        </div>
                        <div className="UserRoleField">
                            <Label color="#0377A8">Role</Label>
                            <InputDropdown id="role" name="role" editable={true} options={dropdownOptions.dropDownOptions.userRoleOptions} />
                        </div>
                        <div className="EmpidField">
                            <Label color="#0377A8">Emp ID</Label>
                            <InputField id="empID" name="empID"  width="15.625em" borderRadius="0.625em" style={{border: "1px solid #8D9093"}}></InputField>
                        </div>
                    </div>
                    <hr className="line" />
                    <div className="Button">
                        <Buttons type="submit" id="save-btn" style={{ backgroundColor: "#23A3DA", color: "white" }} > Save </Buttons>
                        <Buttons type="clear" id="clear-btn" style={{ backgroundColor: "#FFFFFF", color: "red" }}>Clear</Buttons>
                        <Buttons type="submit" id="new-btn" style={{ backgroundColor: "white", color: "#23A3DA" }}>New +</Buttons>
                    </div>
                    <hr className="line" />
                    <div className="tableContainer">
                        
                    </div>
                </div>
            </Layout>
        </>
    );
};