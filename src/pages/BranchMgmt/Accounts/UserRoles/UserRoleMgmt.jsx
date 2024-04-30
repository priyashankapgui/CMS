import Layout from "../../../../Layout/Layout";
import { Link } from "react-router-dom";
import './UserRoleMgmt.css';
import Buttons from "../../../../Components/Buttons/RoundButtons/RoundButtons";
import Label from "../../../../Components/Label/InputLabel";
import InputDropdown from "../../../../Components/InputDropdown/InputDropdown";
import dropdownOptions from "../../../../Components/Data.json";
import TableWithPagi from '../../../../Components/Tables/TableWithPagi';


export const UserRoleMgmt = () => {
    return (
        <>
            <div className="accounts">
                <h4>Accounts</h4>
            </div>
            <Layout>
            <div className="linkDiv">
                    <Link className="link" to="/users">Users</Link>
                    <Link className="link" to="/UserRoleMgmt">User Role Mgmt</Link>
                </div>
                <div className="availableRoles">
                    <div className="topContainer">
                        <h3>Available Roles</h3>
                        <Buttons type="submit" id="new-btn" style={{ backgroundColor: "white", color: "#23A3DA" }} > New + </Buttons>
                    </div>
                    <div>
                        <Label color="#0377A8">Branch</Label>
                        <InputDropdown id="branchName" name="branchName" editable={true} options={dropdownOptions.dropDownOptions.branchOptions} />
                    </div>
                    <div>
                    <TableWithPagi
                        columns={[]}
                        rows={[
                            { Role: 'Super Admin',
                            action: (
                                <div style={{ display: "flex", gap: "0.5em" }}>
                                    
                                    
                                </div>
                            )  },
                            { Role: 'Admin',
                            action: (
                                <div style={{ display: "flex", gap: "0.5em" }}>
                                    
                                    
                                </div>
                            )  },
                            
                            { Role: 'Cashier',
                            action: (
                                <div style={{ display: "flex", gap: "0.5em" }}>
                                    
                                    
                                </div>
                            )  },
                           
                                                      
                        ]}
                    />
                    </div>
                </div>
            </Layout>
        </>
    );
};