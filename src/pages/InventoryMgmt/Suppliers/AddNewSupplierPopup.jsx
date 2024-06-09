import React, { useState, useEffect } from 'react';
import Joi from 'joi';
import { useNavigate } from 'react-router-dom';
import InputLabel from '../../../Components/Label/InputLabel';
import InputField from '../../../Components/InputField/InputField';
import AddNewPopup from '../../../Components/PopupsWindows/AddNewPopup';
import axios from 'axios';
import CustomAlert from '../../../Components/Alerts/CustomAlert/CustomAlert';

const suppliersApiUrl = process.env.REACT_APP_SUPPLIERS_API;

function AddNewSupplierPopup() {
    const navigate = useNavigate();
    const [supplierName, setSupplierName] = useState('');
    const [regNo, setRegNo] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [contactNo, setContactNo] = useState('');
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
        const storedAlertConfig = localStorage.getItem('alertConfig');
        if (storedAlertConfig) {
            setAlertConfig(JSON.parse(storedAlertConfig));
            setAlertVisible(true);
            localStorage.removeItem('alertConfig');
        }
    }, []);

    const validate = () => {
        const result = schema.validate({ supplierName, regNo, address, email, contactNo }, { abortEarly: false });
        if (!result.error) return null;

        const errorMessages = {};
        result.error.details.forEach(detail => {
            errorMessages[detail.path[0]] = detail.message;
        });
        return errorMessages;
    };

    const handleSave = async (e) => {
        if (e) {
            e.preventDefault();
        }
         
        const validationErrors = validate();
        if (validationErrors) {
            setAlertConfig({
                severity: 'error',
                title: 'Validation Error',
                message: 'Please fill out all required fields correctly.',
                duration: 3000
            });
            setAlertVisible(true);
            return;
        }
    
        try {
            const resp = await axios.post(suppliersApiUrl, {
                supplierName,
                regNo,
                address,
                email,
                contactNo
            });
            console.log("Response:", resp.data);
            const alertData = {
                severity: 'success',
                title: 'Added',
                message: 'Supplier added successfully!',
                duration: 5000
            };
            localStorage.setItem('alertConfig', JSON.stringify(alertData));
            navigate('/Suppliers');
            window.location.reload();
        } catch (error) {
            console.error("Error:", error);
            const alertData = {
                severity: 'error',
                title: 'Error',
                message: 'Failed to add supplier.',
                duration: 5000
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
            <AddNewPopup topTitle="Add New Supplier" buttonId="save-btn" buttonText="Save" onClick={handleSave} >
                <div style={{ display: 'flex', gap: '20px', width: '100%' }}>
                    <div style={{ flex: '1' }}>
                        <InputLabel htmlFor="supplierName" color="#0377A8">Supplier Name</InputLabel>
                        <InputField type="text" id="supplierName" name="supplierName" editable={true} value={supplierName} onChange={(e) => setSupplierName(e.target.value)} style={{ width: '100%' }} />
                    </div>
                    <div style={{ flex: '1' }}>
                        <InputLabel htmlFor="regNo" color="#0377A8">Reg No</InputLabel>
                        <InputField type="text" id="regNo" name="regNo" editable={true} value={regNo} onChange={(e) => setRegNo(e.target.value)} style={{ width: '100%' }} />
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '20px', width: '100%', marginTop: '10px' }}>
                    <div style={{ flex: '1' }}>
                        <InputLabel htmlFor="email" color="#0377A8">Email</InputLabel>
                        <InputField type="text" id="email" name="email" editable={true} value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%' }} />
                    </div>
                    <div style={{ flex: '1' }}>
                        <InputLabel htmlFor="address" color="#0377A8">Address</InputLabel>
                        <InputField type="text" id="address" name="address" editable={true} value={address} onChange={(e) => setAddress(e.target.value)} style={{ width: '100%' }} />
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '20px', width: '100%', marginTop: '10px' }}>
                    <div style={{ flex: '1' }}>
                        <InputLabel htmlFor="contactNo" color="#0377A8">Contact No</InputLabel>
                        <InputField type="text" id="contactNo" name="contactNo" editable={true} value={contactNo} onChange={(e) => setContactNo(e.target.value)} style={{ width: '100%' }} />
                    </div>
                </div>
            </AddNewPopup>
        </>
    );
}

export default AddNewSupplierPopup;