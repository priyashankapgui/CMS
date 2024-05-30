import React from 'react';
import './AddNewUserRolePopup.css';
import AddNewPopup from '../../../../Components/PopupsWindows/AddNewPopup';
import InputLabel from '../../../../Components/Label/InputLabel';
import InputField from '../../../../Components/InputField/InputField';
import BranchDropdown from '../../../../Components/InputDropdown/BranchDropdown';
import { FormControlLabel, FormGroup, FormControl, Checkbox } from '@mui/material';

// import InputLabel from '../../../../Components/Label/InputLabel';
// import InputField from '../../../../Components/InputField/InputField';

function AddNewUserRolePopup() {
    return (
        <>
            <AddNewPopup topTitle="Add New User Role " buttonId="save-btn" buttonText="Save" onClick={""}>
                <div className='first-row'>
                    <div className='roleNameInput'>
                        <InputLabel colour="#0377A8">Role Name</InputLabel>
                        <InputField
                            type="text"
                            id="roleName"
                            name="roleName"
                            editable={true}
                        />
                    </div>
                    <div>
                        <InputLabel colour="#0377A8">Branch</InputLabel>
                        <BranchDropdown id="branchName" name="branchName" editable={true} addOptions={["None"]} />
                    </div>
                </div>
                <div className='second-row'>
                    <InputLabel colour="#0377A8">Permission Mapping</InputLabel>
                    <div className='permissions'>
                        <div className='permission-col-1'>
                        <FormGroup>
                        <FormControlLabel control={<Checkbox defaultChecked />} label="Label" />
                        <FormControlLabel required control={<Checkbox />} label="Required" />
                        <FormControlLabel disabled control={<Checkbox />} label="Disabled" />
                        </FormGroup>
                        </div>
                    </div>
                </div>

            </AddNewPopup>


        </>
    );
}

export default AddNewUserRolePopup;