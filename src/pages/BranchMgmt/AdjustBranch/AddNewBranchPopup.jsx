import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InputLabel from '../../../Components/Label/InputLabel';
import InputField from '../../../Components/InputField/InputField';
import AddNewPopup from '../../../Components/PopupsWindows/AddNewPopup';
import axios from 'axios';
import CustomAlert from '../../../Components/Alerts/CustomAlert/CustomAlert';

const url = process.env.REACT_APP_BRANCHES_API;

function AddNewBranchPopup() {
    const navigate = useNavigate();
    const [branchName, setBranchName] = useState('');
    const [address, setAddress] = useState('');
    const [branchEmail, setBranchEmail] = useState('');
    const [contactNo, setContactNo] = useState('');
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertConfig, setAlertConfig] = useState({});

    useEffect(() => {
        const storedAlertConfig = localStorage.getItem('alertConfig');
        if (storedAlertConfig) {
            setAlertConfig(JSON.parse(storedAlertConfig));
            setAlertVisible(true);
            localStorage.removeItem('alertConfig');
        }
    }, []);

    const handleSave = async (e) => {
        try {
            await axios.post(url, {
                branchName: branchName,
                address: address,
                email: branchEmail,
                contactNumber: contactNo
            });
            console.log("Branch added successfully");
            const alertData = {
                severity: 'success',
                title: 'Added',
                message: 'Branch added successfully!',
                duration: 3000
            };
            localStorage.setItem('alertConfig', JSON.stringify(alertData));
            navigate('/adjust-branch');
            window.location.reload();
        } catch (error) {
            console.error("Error:", error);
            const alertData = {
                severity: 'error',
                title: 'Error',
                message: 'Failed to add branch.',
                duration: 3000
            };
            localStorage.setItem('alertConfig', JSON.stringify(alertData));
            navigate('/adjust-branch');
            window.location.reload();
        }
    };

    return (
        <>
            {alertVisible && (
                <CustomAlert
                    severity={alertConfig.severity}
                    title={alertConfig.title}
                    message={alertConfig.message}
                    duration={alertConfig.duration}
                    onClose={() => setAlertVisible(false)}
                />
            )}
            <AddNewPopup topTitle="Add New Branch" buttonId="save-btn" buttonText="Save" onClick={handleSave}>
                <div style={{ display: 'flex', gap: '20px', width: '100%' }}>
                    <div style={{ flex: '1' }}>
                        <InputLabel htmlFor="branchName" color="#0377A8">Branch Name</InputLabel>
                        <InputField type="text" id="branchName" name="branchName" editable={true} value={branchName} onChange={(e) => setBranchName(e.target.value)} style={{ width: '100%' }} />
                    </div>
                    <div style={{ flex: '1' }}>
                        <InputLabel htmlFor="address" color="#0377A8">Address</InputLabel>
                        <InputField type="text" id="address" name="address" editable={true} value={address} onChange={(e) => setAddress(e.target.value)} style={{ width: '100%' }} />
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '20px', width: '100%', marginTop: '10px' }}>
                    <div style={{ flex: '1' }}>
                        <InputLabel htmlFor="branchEmail" color="#0377A8">Email</InputLabel>
                        <InputField type="text" id="branchEmail" name="branchEmail" editable={true} value={branchEmail} onChange={(e) => setBranchEmail(e.target.value)} style={{ width: '100%' }} />
                    </div>
                    <div style={{ flex: '1' }}>
                        <InputLabel htmlFor="contactNo" color="#0377A8">Contact No</InputLabel>
                        <InputField type="text" id="contactNo" name="contactNo" editable={true} value={contactNo} onChange={(e) => setContactNo(e.target.value)} style={{ width: '100%' }} />
                    </div>
                </div>
            </AddNewPopup>
        </>
    );
}

export default AddNewBranchPopup;
