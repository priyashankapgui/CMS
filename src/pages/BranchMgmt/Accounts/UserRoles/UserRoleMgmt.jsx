import React, { useEffect, useState } from 'react';
import Layout from "../../../../Layout/Layout";
import { Link } from "react-router-dom";
import './UserRoleMgmt.css';
import InputLabel from "../../../../Components/Label/InputLabel";
// import InputDropdown from "../../../../Components/InputDropdown/InputDropdown";
// import jsonData from "../../../../Components/Data.json";
import TableWithPagi from '../../../../Components/Tables/TableWithPagi';
import DeletePopup from "../../../../Components/PopupsWindows/DeletePopup";
import AddNewUserRolePopup from './AddNewUserRolePopup';
import UpdateUserRolePopup from './UpdateUserRolePopup';
import BranchDropdown from '../../../../Components/InputDropdown/BranchDropdown';
import CustomAlert from '../../../../Components/Alerts/CustomAlert/CustomAlert';


export const UserRoleMgmt = () => {
    const [selectedBranch, setSelectedBranch] = useState('All');
    const [clickedLink, setClickedLink] = useState('User Role Mgmt');
    const [userRoles, setUserRoles] = useState([]);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const getUserRoles = async () => {
            try {
                const response = await fetch("http://localhost:8080/userRoles", {
                    method: "GET", 
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                const data = await response.json();
                console.log(data);
                setUserRoles(data);
            } catch (error) {
                console.error("Error:", error);
            }
        };
        getUserRoles();
    }, []);

    const handleLinkClick = (linkText) => {
        setClickedLink(linkText);
    };
    const handleDropdownChange = (value) => {
        setSelectedBranch(value);
        // console.log(value)
    };

    const handleDelete = () => {
        console.log('deleted');
    };

    const showSuccess = (message) => {
        setSuccess(message);
    };


    return (
        <>
            <div className="top-nav-blue-text">
                <h4>Accounts - User Roles Mgmt</h4>
            </div>
            <Layout>
            

                <div className="linkActions-account-userRoles">
                    <div className={clickedLink === 'Users' ? 'clicked' : ''}>
                        <Link
                            to="/accounts"
                            onClick={() => handleLinkClick('Users')}
                        >
                            Users
                        </Link>
                    </div>
                    <div className={clickedLink === 'User Role Mgmt' ? 'clicked' : ''}>
                        <Link
                            to=""
                            onClick={() => handleLinkClick('User Role Mgmt')}
                        >
                            User Role Mgmt
                        </Link>
                    </div>
                </div>


                <div className="user-roles-middle-container">
                    <div className="user-roles-middle-top-content">
                        <h3 className='user-roles-available-title'>Available Roles</h3>
                        <AddNewUserRolePopup showSuccess={showSuccess}/>
                    </div>
                    <div className="BranchField">
                        <InputLabel color="#0377A8">Branch</InputLabel>
                        <BranchDropdown id="branchName" name="branchName" editable={true} onChange={(e) => handleDropdownChange(e)} addOptions={["All"]}/>
                    </div>

                    <div className='user-roles-middle-tablecontainer'>
                        <TableWithPagi
                            columns={['Roles', 'Branch', 'Action']}
                            rows={userRoles.filter(
                                role => selectedBranch === 'All' || role.branchName === selectedBranch
                            ).map(role => ({
                                Role: role.userRoleName,
                                Branch: role.branchName,
                                action: (
                                    <div style={{ display: "flex", gap: "0.7em", cursor:"pointer" }}>
                                        <UpdateUserRolePopup userRoleId={role.userRoleId}/>

                                        <DeletePopup handleDelete={handleDelete} />
                                    </div>
                                )
                            }))}
                        />
                    </div>
                </div>
                {success &&
                <CustomAlert
                severity="success"
                title="Success"
                message={success}
                duration={3000}
                onClose={() => {
                  window.location.reload();
                }}
              />
                }
            </Layout>
        </>
    );
};