import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputLabel from '../../../Components/Label/InputLabel';
import InputField from '../../../Components/InputField/InputField';
import EditPopup from '../../../Components/PopupsWindows/EditPopup';
import CustomAlert from '../../../Components/Alerts/CustomAlert/CustomAlert';
import axios from 'axios';
import PropTypes from 'prop-types';

const branchesApiUrl = process.env.REACT_APP_BRANCHES_API;

function UpdateBranchPopup({ branchId }) {
    const navigate = useNavigate();
    const [post, setPost] = useState({
        branchName: '',
        address: '',
        email: '',
        contactNumber: ''
    });
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertConfig, setAlertConfig] = useState({});

    useEffect(() => {
        if (branchId) {
            axios.get(`${branchesApiUrl}/${branchId}`)
                .then(res => setPost({
                    branchName: res.data.branchName,
                    address: res.data.address,
                    email: res.data.email,
                    contactNumber: res.data.contactNumber
                }))
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
        setPost({ ...post, [event.target.name]: event.target.value });
    };

    const handleSave = async (event) => {
        event.preventDefault();
        try {
            const resp = await axios.put(`${branchesApiUrl}/${branchId}`, {
                branchName: post.branchName,
                address: post.address,
                email: post.email, 
                contactNumber: post.contactNumber 
            });
            console.log('Branch updated successfully:', resp.data);
            const alertData = {
                severity: 'info',
                title: 'Successfully Updated!',
                message: 'Branch updated successfully!',
                duration: 3000
            };
            localStorage.setItem('alertConfig', JSON.stringify(alertData));
            navigate('/adjust-branch');
            window.location.reload();
        } catch (error) {
            console.error('Error updating branch:', error);
            const alertData = {
                severity: 'error',
                title: 'Error',
                message: 'Failed to update branch.',
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
            <EditPopup topTitle="Update Branch Details" buttonId="update-btn" buttonText="Update" onClick={handleSave}>
                <form onSubmit={handleSave}>
                    <div className="content1" style={{ display: 'flex', gap: '20px', width: '100%' }}>
                        <div className="BranchField">
                            <InputLabel htmlFor="branchName" color="#0377A8">Branch Name</InputLabel>
                            <InputField type="text" id="branchName" name="branchName" value={post.branchName} onChange={handleUpdate} editable={true} />
                        </div>
                        <div className="AddressField">
                            <InputLabel htmlFor="address" color="#0377A8">Address</InputLabel>
                            <InputField type="text" id="address" name="address" value={post.address} onChange={handleUpdate} editable={true} />
                        </div>
                    </div>
                    <div className="content2" style={{ display: 'flex', gap: '20px', width: '100%', marginTop: '10px' }}>
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
    branchId: PropTypes.string.isRequired
};

export default UpdateBranchPopup;
