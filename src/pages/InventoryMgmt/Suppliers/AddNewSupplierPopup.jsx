import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputLabel from '../../../Components/Label/InputLabel';
import InputField from '../../../Components/InputField/InputField';
import AddNewPopup from '../../../Components/PopupsWindows/AddNewPopup';
import axios from 'axios';

const url = 'http://localhost:8080/suppliers';

function AddNewSupplierPopup() {
    const navigate = useNavigate();
    const [supplierName, setSupplierName] = useState('');
    const [regNo, setRegNo] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [contactNo, setContactNo] = useState('');

    const resetFields = () => {
        setSupplierName('');
        setRegNo('');
        setAddress('');
        setEmail('');
        setContactNo('');
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const resp = await axios.post(url, {
                supplierName: supplierName,
                regNo: regNo,
                address: address,
                email: email,
                contactNo: contactNo
            });
            console.log("Response:", resp.data);

            // If the POST request is successful, reset the input fields
            resetFields();

            console.log("Navigating to /suppliers");

            // Navigate to the specified page
            navigate('/Suppliers');
        } catch (error) {
            console.error("Error:", error);
            // You might want to handle the error gracefully, e.g., display an error message to the user
        }
    };

    return (
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
    );
}

export default AddNewSupplierPopup;
