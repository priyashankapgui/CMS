import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputLabel from '../../../Components/Label/InputLabel';
import InputField from '../../../Components/InputField/InputField';
import EditPopup from '../../../Components/PopupsWindows/EditPopup';
import CustomAlert from '../../../Components/Alerts/CustomAlert/CustomAlert';
import axios from 'axios';
import PropTypes from 'prop-types';
import Joi from 'joi';

const suppliersApiUrl = process.env.REACT_APP_SUPPLIERS_API;

function UpdateSupplierPopup({ supplierId }) {
    const navigate = useNavigate();
    const [post, setPost] = useState({
        supplierName: '',
        regNo: '',
        address: '',
        email: '',
        contactNo: ''
    });
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertConfig, setAlertConfig] = useState({});

    const schema = Joi.object({
        supplierName: Joi.string().required().label('Supplier Name'),
        regNo: Joi.string().required().label('Reg No'),
        email: Joi.string().email({ tlds: { allow: false } }).required().label('Email'),
        address: Joi.string().required().label('Address'),
        contactNo: Joi.string().pattern(/^\d{10}$/).required().label('Contact No'),
    });

    useEffect(() => {
        if (supplierId) {
            axios.get(`${suppliersApiUrl}/${supplierId}`)
                .then(res => {
                    const { supplierName, regNo, address, email, contactNo } = res.data.data;
                    setPost({
                        supplierName,
                        regNo,
                        address,
                        email,
                        contactNo
                    });
                })
                .catch(err => console.log(err));
        }
    }, [supplierId]);

    useEffect(() => {
        const storedAlertConfig = localStorage.getItem('alertConfig');
        if (storedAlertConfig) {
            setAlertConfig(JSON.parse(storedAlertConfig));
            setAlertVisible(true);
            localStorage.removeItem('alertConfig');
        }
    }, []);

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
        setPost({ ...post, [event.target.name]: event.target.value });
    };

    const handleSave = async (event) => {
        event.preventDefault();
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

        try {
            const resp = await axios.put(`${suppliersApiUrl}/${supplierId}`, post);
            console.log('Supplier updated successfully:', resp.data);
            const alertData = {
                severity: 'info',
                title: 'Successfully Updated!',
                message: 'Supplier updated successfully!',
                duration: 3000
            };
            localStorage.setItem('alertConfig', JSON.stringify(alertData));
            navigate('/Suppliers');
            window.location.reload();
        } catch (error) {
            console.error('Error updating supplier:', error);
            const alertData = {
                severity: 'error',
                title: 'Error',
                message: 'Failed to update supplier.',
                duration: 3000
            };
            localStorage.setItem('alertConfig', JSON.stringify(alertData));
            navigate('/Suppliers');
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
            <EditPopup topTitle="Update Supplier Details" buttonId="update-btn" buttonText="Update" onClick={handleSave}>
                <form onSubmit={handleSave}>
                    <div className="content1" style={{ display: 'block', width: '100%' }}>
                        <div className="supplierNameField">
                            <InputLabel htmlFor="supplierName" color="#0377A8">Supplier Name</InputLabel>
                            <InputField type="text" id="supplierName" name="supplierName" value={post.supplierName} onChange={handleUpdate} editable={true} />
                        </div>
                        <div className="RegNoField">
                            <InputLabel htmlFor="regNo" color="#0377A8">Reg No</InputLabel>
                            <InputField type="text" id="regNo" name="regNo" value={post.regNo} onChange={handleUpdate} editable={true} />
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
                            <InputLabel htmlFor="contactNo" color="#0377A8">Contact No</InputLabel>
                            <InputField type="text" id="contactNo" name="contactNo" value={post.contactNo} onChange={handleUpdate} editable={true} />
                        </div>
                    </div>
                </form>
            </EditPopup>
        </>
    );
}

UpdateSupplierPopup.propTypes = {
    supplierId: PropTypes.string.isRequired
};

export default UpdateSupplierPopup;
