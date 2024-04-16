import React from 'react';
import InputLabel from '../../../Components/Label/InputLabel';
import InputField from '../../../Components/InputField/InputField';
import AddNewPopup from '../../../Components/PopupsWindows/AddNewPopup';

function AddNewBranchPopup() {
    return (
        <>
            <AddNewPopup topTitle="Add New Branch " buttonId="save-btn" buttonText="Save" onClick={() => alert('Saved')}>

                <div className="content1" style={{ display: 'flex', gap: '20px', width: '100%',}}>
                    <div className="BranchField" style={{ flex: '1' }}>
                        <InputLabel for="branchName" color="#0377A8">Branch Name</InputLabel>
                        <InputField type="text" id="branchName" name="branchName" editable={true} style={{ width: '100%' }} />
                    </div>
                    <div className="AddressField" style={{ flex: '1' }}>
                        <InputLabel for="address" color="#0377A8" fontsize="">Address</InputLabel>
                        <InputField type="text" id="address" name="address" editable={true} style={{ width: '100%' }} />
                    </div>
                </div>
                <div className="content2" style={{ display: 'flex', gap: '20px', width: '100%', marginTop: '10px' }}>
                    <div className="EmailField" style={{ flex: '1' }}>
                        <InputLabel for="branchEmail" color="#0377A8">Email</InputLabel>
                        <InputField type="text" id="branchEmail" name="branchEmail" editable={true} style={{ width: '100%' }} />
                    </div>

                    <div className="ContactNoField" style={{ flex: '1' }}>
                        <InputLabel for="contactNo" color="#0377A8">Contact No</InputLabel>
                        <InputField type="text" id="contactNo" name="contactNo" editable={true} style={{ width: '100%' }} />
                    </div>
                </div>

            </AddNewPopup>
        </>
    );
}

export default AddNewBranchPopup;
