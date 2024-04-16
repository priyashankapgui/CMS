import React from 'react';
import InputLabel from '../../../Components/Label/InputLabel';
import InputField from '../../../Components/InputField/InputField';
import EditPopup from '../../../Components/PopupsWindows/EditPopup';

function UpdateBranchPopup() {
    return (
        <>
            <EditPopup topTitle="Update Branch Details" buttonId="update-btn" buttonText="Update" onClick={() => console.log('clicked')}>

                <div className="content1" style={{ display: 'flex', gap: '20px', width: '100%' }}>
                    <div className="BranchField">
                        <InputLabel for="branchName" color="#0377A8">Branch Name</InputLabel>
                        <InputField type="text" id="branchName" name="branchName" editable={true} />
                    </div>
                    <div className="AddressField">
                        <InputLabel for="address" color="#0377A8" fontsize="">Address</InputLabel>
                        <InputField type="text" id="address" name="address" editable={true} />
                    </div>
                </div>
                <div className="content2" style={{ display: 'flex', gap: '20px', width: '100%', marginTop: '10px' }}>
                    <div className="EmailField">
                        <InputLabel for="branchEmail" color="#0377A8">Email</InputLabel>
                        <InputField type="text" id="branchEmail" name="branchEmail" editable={true} />
                    </div>

                    <div className="ContactNoField">
                        <InputLabel for="contactNo" color="#0377A8">Contact No</InputLabel>
                        <InputField type="text" id="contactNo" name="contactNo" editable={true} />
                    </div>
                </div>

            </EditPopup>
        </>
    );
}

export default UpdateBranchPopup;
