import React, { useState } from 'react';
import Layout from "../../../../Layout/Layout";
import { Link } from "react-router-dom";
import './UserRoleMgmt.css';
import Buttons from "../../../../Components/Buttons/Buttons";
import InputLabel from "../../../../Components/Label/InputLabel";
import InputDropdown from "../../../../Components/InputDropdown/InputDropdown";
import jsonData from "../../../../Components/Data.json";
import TableWithPagi from '../../../../Components/Tables/TableWithPagi';
import DeletePopup from "../../../../Components/PopupsWindows/DeletePopup";
import { Icon } from "@iconify/react";


export const UserRoleMgmt = () => {
    const [clickedLink, setClickedLink] = useState('User Role Mgmt');

    const handleLinkClick = (linkText) => {
        setClickedLink(linkText);
    };

    return (
        <>
            <div className="userRoleMgmt">
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
                        <Buttons type="submit" id="new-btn" style={{ backgroundColor: "white", color: "#23A3DA" }} > New + </Buttons>
                    </div>
                    <div className="BranchField">
                        <InputLabel color="#0377A8">Branch</InputLabel>
                        <InputDropdown id="branchName" name="branchName" editable={true} options={jsonData.dropDownOptions.branchOptions} />
                    </div>

                    <div className='user-roles-middle-tablecontainer'>
                        <TableWithPagi
                            columns={['Roles', 'Action']}
                            rows={jsonData.registerdSystemUserRoles.map(role => ({
                                Role: role.Role,
                                action: (
                                    <div style={{ display: "flex", gap: "0.7em" }}>
                                        <Icon icon="bitcoin-icons:edit-outline"
                                            style={{ fontSize: '24px' }} />

                                        <DeletePopup />
                                    </div>
                                )
                            }))}
                        />
                    </div>
                </div>
            </Layout>
        </>
    );
};