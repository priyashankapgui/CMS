import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InputLabel from '../../../Components/Label/InputLabel';
import InputField from '../../../Components/InputField/InputField';
import AddNewPopup from '../../../Components/PopupsWindows/AddNewPopup';
import CustomAlert from '../../../Components/Alerts/CustomAlert/CustomAlert';
import { createBranch, getBranchOptions } from '../../../Api/BranchMgmt/BranchAPI.jsx';

function AddNewBranchPopup({ fetchData }) {
    const navigate = useNavigate();
    const [branchName, setBranchName] = useState('');
    const [address, setAddress] = useState('');
    const [branchEmail, setBranchEmail] = useState('');
    const [contactNo, setContactNo] = useState('');
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertConfig, setAlertConfig] = useState({});
    const [isSaveDisabled, setIsSaveDisabled] = useState(true);

    useEffect(() => {
        const storedAlertConfig = localStorage.getItem('alertConfig');
        if (storedAlertConfig) {
            setAlertConfig(JSON.parse(storedAlertConfig));
            setAlertVisible(true);
            localStorage.removeItem('alertConfig');
        }
    }, []);

    useEffect(() => {
        setIsSaveDisabled(!(branchName && address && branchEmail && contactNo));
    }, [branchName, address, branchEmail, contactNo]);

    const showAlert = (config) => {
        setAlertConfig(config);
        setAlertVisible(true);
        setTimeout(() => {
            setAlertVisible(false);
        }, config.duration || 3000);
    };

    const checkBranchExists = async (branchName) => {
        try {
            const branches = await getBranchOptions();
            return branches.some(branch => branch.branchName.toLowerCase() === branchName.toLowerCase());
        } catch (error) {
            console.error('Error checking if branch exists:', error);
            return false;
        }
    };

    const handleSave = async () => {
        try {
            const branchExists = await checkBranchExists(branchName);
            if (branchExists) {
                showAlert({
                    severity: 'warning',
                    title: 'Branch Exists',
                    message: 'Branch with this name already exists.',
                    duration: 3000
                });
                return;
            }

            await createBranch({
                branchName: branchName,
                address: address,
                email: branchEmail,
                contactNumber: contactNo
            });

            console.log("Branch added successfully");
            showAlert({
                severity: 'success',
                title: 'Branch Added',
                message: 'Branch added successfully!',
                duration: 3000
            });

            fetchData();
        } catch (error) {
            console.error("Error:", error);
            showAlert({
                severity: 'error',
                title: 'Error',
                message: 'Failed to add branch.',
                duration: 3000
            });
        }
    };

    const handleClose = () => {
        setBranchName('');
        setAddress('');
        setBranchEmail('');
        setContactNo('');
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
            <AddNewPopup
                topTitle="Add New Branch"
                buttonId="save-btn"
                buttonText="Save"
                onClick={handleSave}
                closeSubpopup={handleClose}
                disabled={isSaveDisabled}  
            >
                <div style={{ display: 'block', width: '100%' }}>
                    <div>
                        <InputLabel htmlFor="branchName" color="#0377A8">Branch Name</InputLabel>
                        <InputField
                            type="text"
                            id="branchName"
                            name="branchName"
                            editable={true}
                            value={branchName}
                            onChange={(e) => setBranchName(e.target.value)}
                            style={{ width: '100%' }}
                        />
                    </div>
                    <div>
                        <InputLabel htmlFor="address" color="#0377A8">Address</InputLabel>
                        <InputField
                            type="text"
                            id="address"
                            name="address"
                            editable={true}
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            style={{ width: '100%' }}
                        />
                    </div>
                    <div>
                        <InputLabel htmlFor="branchEmail" color="#0377A8">Email</InputLabel>
                        <InputField
                            type="text"
                            id="branchEmail"
                            name="branchEmail"
                            editable={true}
                            value={branchEmail}
                            onChange={(e) => setBranchEmail(e.target.value)}
                            style={{ width: '100%' }}
                        />
                    </div>
                    <div>
                        <InputLabel htmlFor="contactNo" color="#0377A8">Contact No</InputLabel>
                        <InputField
                            type="text"
                            id="contactNo"
                            name="contactNo"
                            editable={true}
                            value={contactNo}
                            onChange={(e) => setContactNo(e.target.value)}
                            style={{ width: '100%' }}
                        />
                    </div>
                </div>
            </AddNewPopup>
        </>
    );
}

export default AddNewBranchPopup;
