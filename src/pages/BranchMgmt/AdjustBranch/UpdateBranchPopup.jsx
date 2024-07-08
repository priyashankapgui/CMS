import React, { useState, useEffect } from 'react';
import Joi from 'joi';
import InputLabel from '../../../Components/Label/InputLabel';
import InputField from '../../../Components/InputField/InputField';
import EditPopup from '../../../Components/PopupsWindows/EditPopup';
import CustomAlert from '../../../Components/Alerts/CustomAlert/CustomAlert';
import PropTypes from 'prop-types';
import { getBranchById, updateBranch } from '../../../Api/BranchMgmt/BranchAPI.jsx'; 

function UpdateBranchPopup({ branchId, onClose }) {
    const [initialPost, setInitialPost] = useState({
        branchName: '',
        address: '',
        email: '',
        contactNumber: '',
        image: null
    });
    const [post, setPost] = useState({
        branchName: '',
        address: '',
        email: '',
        contactNumber: '',
        image: null
    });

    const [alertVisible, setAlertVisible] = useState(false);
    const [alertConfig, setAlertConfig] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const schema = Joi.object({
        branchName: Joi.string().required().label('Branch Name'),
        address: Joi.string().required().label('Address'),
        email: Joi.string().email({ tlds: { allow: false } }).required().label('Email'),
        contactNumber: Joi.string().length(10).pattern(/^[0-9]+$/).required().label('Contact Number'),
    });    

    useEffect(() => {
        const fetchBranch = async () => {
            try {
                const branchData = await getBranchById(branchId);
                const initialData = {
                    branchName: branchData.branchName,
                    address: branchData.address,
                    email: branchData.email,
                    contactNumber: branchData.contactNumber,
                    image: null
                };
                setInitialPost(initialData);
                setPost(initialData);
            } catch (error) {
                console.error('Error fetching branch:', error);
            }
        };

        if (branchId) {
            fetchBranch();
        }
    }, [branchId]);

    const validate = () => {
        const result = schema.validate(post, { abortEarly: false });
        if (!result.error) return null;

        const errorMessages = {};
        result.error.details.forEach(detail => {
            errorMessages[detail.path[0]] = detail.message;
        });
        return errorMessages;
    };

    const handleUpdate = (event) => {
        const { name, value } = event.target;
        setPost({ ...post, [name]: value });
    };


    const handleSave = async (event) => {
        if (event) {
            event.preventDefault();
        }

        const validationErrors = validate();
        if (validationErrors) {
            setAlertConfig({
                severity: 'error',
                title: 'Validation Error',
                message: 'Please fill out all required fields correctly.',
                duration: 5000
            });
            setAlertVisible(true);
            return;
        }
        if (JSON.stringify(post) === JSON.stringify(initialPost)) {
            setAlertConfig({
                severity: 'info',
                title: 'Not Updated!',
                message: 'No changes were made to the branch.',
                duration: 3000
            });
            setAlertVisible(true);
            return;
        }

        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('branchName', post.branchName);
            formData.append('address', post.address);
            formData.append('email', post.email);
            formData.append('contactNumber', post.contactNumber);
            if (post.image) {
                formData.append('image', post.image);
            }

            await updateBranch(branchId, formData);

            setAlertConfig({
                severity: 'success',
                title: 'Successfully Updated!',
                message: 'Branch updated successfully!',
                duration: 3000
            });
            setAlertVisible(true);
            setInitialPost({ ...post, image: null });
        } catch (error) {
            console.error('Error updating branch:', error);
            setAlertConfig({
                severity: 'error',
                title: 'Error',
                message: 'Failed to update branch.',
                duration: 3000
            });
            setAlertVisible(true);
        } finally {
            setIsLoading(false);
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
            <EditPopup
                topTitle="Update Branch Details"
                buttonId="update-btn"
                buttonText="Update"
                onClick={handleSave}
                isLoading={isLoading}
                open={true}
                onClose={onClose}
            >
                <form onSubmit={handleSave} encType='multipart/form-data'>
                    <div style={{ display: 'block', width: '100%' }}>
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
                    <button type="submit" style={{ display: 'none' }}>Submit</button>
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