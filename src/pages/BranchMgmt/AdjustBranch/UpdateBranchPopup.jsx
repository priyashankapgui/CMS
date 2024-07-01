import React, { useEffect, useState } from 'react';
import InputLabel from '../../../Components/Label/InputLabel';
import InputField from '../../../Components/InputField/InputField';
import EditPopup from '../../../Components/PopupsWindows/EditPopup';
import CustomAlert from '../../../Components/Alerts/CustomAlert/CustomAlert';
import PropTypes from 'prop-types';
import { getBranchById, updateBranch } from '../../../Api/BranchMgmt/BranchAPI.jsx'; 

function UpdateBranchPopup({ branchId, onClose }) {
    const [post, setPost] = useState({
        branchName: '',
        address: '',
        email: '',
        contactNumber: ''
    });
    const [originalPost, setOriginalPost] = useState({});
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertConfig, setAlertConfig] = useState({});
    const [isUpdated, setIsUpdated] = useState(false); 

    useEffect(() => {
        if (branchId) {
            getBranchById(branchId)
                .then(res => {
                    setPost({
                        branchName: res.branchName,
                        address: res.address,
                        email: res.email,
                        contactNumber: res.contactNumber
                    });
                    setOriginalPost({
                        branchName: res.branchName,
                        address: res.address,
                        email: res.email,
                        contactNumber: res.contactNumber
                    });
                })
                .catch(err => console.log(err));
        }
    }, [branchId]);

    useEffect(() => {
        const storedAlertConfig = localStorage.getItem('alertConfig');
        if (storedAlertConfig) {
            setAlertConfig(JSON.parse(storedAlertConfig));
            setAlertVisible(true);
            localStorage.removeItem('alertConfig');
        }
    }, []);

    const handleUpdate = (event) => {
        const { name, value } = event.target;
        setPost(prevPost => ({
            ...prevPost,
            [name]: value
        }));
        setIsUpdated(true); 
    };

    const handleSave = async (event) => {
        event.preventDefault();
        try {
            const resp = await updateBranch(branchId, {
                branchName: post.branchName,
                address: post.address,
                email: post.email,
                contactNumber: post.contactNumber
            });
            console.log('Branch updated successfully:', resp);
            const alertData = {
                severity: 'info',
                title: 'Successfully Updated!',
                message: 'Branch updated successfully!',
                duration: 3000
            };
            localStorage.setItem('alertConfig', JSON.stringify(alertData));
            setAlertConfig(alertData);
            setAlertVisible(true);
            setIsUpdated(false); 
            setOriginalPost({ ...post }); 
            onClose(); 
        } catch (error) {
            console.error('Error updating branch:', error);
            const alertData = {
                severity: 'error',
                title: 'Error',
                message: 'Failed to update branch.',
                duration: 3000
            };
            localStorage.setItem('alertConfig', JSON.stringify(alertData));
            setAlertConfig(alertData);
            setAlertVisible(true);
        }
    };

    const handleClose = () => {
        if (isUpdated) {
            setPost({ ...originalPost });
            setIsUpdated(false); 
        }
        setAlertVisible(false);
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
            <EditPopup topTitle="Update Branch Details" buttonId="update-btn" buttonText="Update" onClick={handleSave} disabled={!isUpdated}>
                <form onSubmit={handleSave}>
                    <div className="content1" style={{ display: 'block', width: '100%' }}>
                        <div className="BranchField">
                            <InputLabel htmlFor="branchName" color="#0377A8">Branch Name</InputLabel>
                            <InputField type="text" id="branchName" name="branchName" value={post.branchName} onChange={handleUpdate} editable={true} />
                        </div>
                        <div className="AddressField">
                            <InputLabel htmlFor="address" color="#0377A8">Address</InputLabel>
                            <InputField type="text" id="address" name="address" value={post.address} onChange={handleUpdate} editable={true} />
                        </div>
                        <div className="EmailField">
                            <InputLabel htmlFor="email" color="#0377A8">Email</InputLabel>
                            <InputField type="text" id="email" name="email" value={post.email} onChange={handleUpdate} editable={true} />
                        </div>
                        <div className="ContactNoField">
                            <InputLabel htmlFor="contactNumber" color="#0377A8">Contact No</InputLabel>
                            <InputField type="text" id="contactNumber" name="contactNumber" value={post.contactNumber} onChange={handleUpdate} editable={true} />
                        </div>
                    </div>
                </form>
            </EditPopup>
        </>
    );
}

UpdateBranchPopup.propTypes = {
    branchId: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired 
};

export default UpdateBranchPopup;
