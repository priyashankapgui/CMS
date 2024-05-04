import React, { useState } from 'react';
import InputLabel from '../../../Components/Label/InputLabel';
import InputField from '../../../Components/InputField/InputField';
import AddNewPopup from '../../../Components/PopupsWindows/AddNewPopup';
import axios from 'axios';
const url = 'http://localhost:8080/branches';

function AddNewBranchPopup() {
    const [branchName, setBranchName] = useState('');
    const [address, setAddress] = useState('');
    const [branchEmail, setBranchEmail] = useState('');
    const [contactNo, setContactNo] = useState('');

    const handleSave = async (e) => {
        e.preventDefault();
        // console.log(branchName,address,branchEmail,contactNo);
        try {
            const resp = await axios.post(url, {
                branchName: branchName,
                address: address,
                email: branchEmail,
                contactNumber: contactNo
            });
            console.log("Response:", resp.data);
        } catch (error) {
            console.log("Error:", error.response);
        }
    }
    return (
        <>
            <AddNewPopup topTitle="Add New Branch " buttonId="save-btn" buttonText="Save" onClick={handleSave}>
                
                <div style={{ display: 'flex', gap: '20px', width: '100%' }}>
                    <div style={{ flex: '1' }}>
                        <InputLabel for="branchName" color="#0377A8">Branch Name</InputLabel>
                        <InputField type="text" id="branchName" name="branchName" editable={true} value={branchName} onChange={(e) => setBranchName(e.target.value)} style={{ width: '100%' }} />
                    </div>
                    <div style={{ flex: '1' }}>
                        <InputLabel for="address" color="#0377A8" fontsize="">Address</InputLabel>
                        <InputField type="text" id="address" name="address" editable={true} value={address} onChange={(e) => setAddress(e.target.value)} style={{ width: '100%' }} />
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '20px', width: '100%', marginTop: '10px' }}>
                    <div style={{ flex: '1' }}>
                        <InputLabel for="branchEmail" color="#0377A8">Email</InputLabel>
                        <InputField type="text" id="branchEmail" name="branchEmail" editable={true} value={branchEmail} onChange={(e) => setBranchEmail(e.target.value)} style={{ width: '100%' }} />
                    </div>
                    <div style={{ flex: '1' }}>
                        <InputLabel for="contactNo" color="#0377A8">Contact No</InputLabel>
                        <InputField type="text" id="contactNo" name="contactNo" editable={true} value={contactNo} onChange={(e) => setContactNo(e.target.value)} style={{ width: '100%' }} />
                    </div>
                </div>
            
        </AddNewPopup>
        </>
    );
}

export default AddNewBranchPopup;