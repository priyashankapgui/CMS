import React, { useState } from 'react';
import Layout from '../../../../Layout/Layout';
import './Accounts.css';
import { Link } from 'react-router-dom';
import InputLabel from '../../../../Components/Label/InputLabel';
import jsonData from '../../../../Components/Data.json';
import InputDropdown from '../../../../Components/InputDropdown/InputDropdown';
import Buttons from '../../../../Components/Buttons/SquareButtons/Buttons';
import InputField from '../../../../Components/InputField/InputField';
import TableWithPagi from '../../../../Components/Tables/TableWithPagi';
import DeletePopup from '../../../../Components/PopupsWindows/DeletePopup';
import { Icon } from '@iconify/react';

export function Accounts() {
    const [clickedLink, setClickedLink] = useState('Users');

    const handleLinkClick = (linkText) => {
        setClickedLink(linkText);
    };

    const handleDelete = () => {
        console.log('deleted');
    };

    return (
        <>
            <div className="accounts">
                <h4>Accounts - {clickedLink}</h4>
            </div>
            <Layout>
                <div className="linkActions-account-users">
                    <div className={clickedLink === 'Users' ? 'clicked' : ''}>
                        <Link to="" onClick={() => handleLinkClick('Users')}>
                            Users
                        </Link>
                    </div>
                    <div className={clickedLink === 'User Role Mgmt' ? 'clicked' : ''}>
                        <Link to="/accounts/user-roles" onClick={() => handleLinkClick('User Role Mgmt')}>
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
                                <InputDropdown id="branchName" name="branchName" editable options={jsonData.dropDownOptions.branchOptions} />
                            </div>
                            <div className="UserRoleField">
                                <InputLabel color="#0377A8">Role</InputLabel>
                                <InputDropdown id="role" name="role" editable options={jsonData.dropDownOptions.userRoleOptions} />
                            </div>
                            <div className="EmpidField">
                                <InputLabel color="#0377A8">Emp ID</InputLabel>
                                <InputField id="empID" name="empID" width="15.625em" editable borderRadius="0.625em" style={{ border: '1px solid #8D9093' }} />
                            </div>
                        </div>
                        <hr className="line" />
                        <div className="Button-Section">
                            <Buttons type="submit" id="save-btn" style={{ backgroundColor: '#23A3DA', color: 'white' }}> Save </Buttons>
                            <Buttons type="clear" id="clear-btn" style={{ backgroundColor: '#FFFFFF', color: 'red' }}>Clear</Buttons>
                            <Buttons type="submit" id="new-btn" style={{ backgroundColor: 'white', color: '#23A3DA' }}>New +</Buttons>
                        </div>
                    </div>
                    <div className="account-users-middle">
                        <TableWithPagi
                            columns={['Branch Name', 'Emp ID', 'Emp Name', 'Gender', 'Role', '']}
                            rows={jsonData.registerdUsersData.map((employee) => ({
                                branch: employee.branch,
                                empId: employee.empId,
                                empName: employee.empName,
                                gender: employee.gender,
                                role: employee.role,
                                action: (
                                    <div style={{ display: 'flex', gap: '0.7em' }}>
                                        <Icon icon="bitcoin-icons:edit-outline" style={{ fontSize: '24px' }} />
                                        <DeletePopup handleDelete={handleDelete} />
                                    </div>
                                ),
                            }))}
                        />
                    </div>
                </div>
            </Layout>
        </>
    );
}
