import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InputLabel from '../../../Components/Label/InputLabel';
import InputDropdown from "../../../Components/InputDropdown/InputDropdown";
import InputField from '../../../Components/InputField/InputField';
import AddNewPopup from '../../../Components/PopupsWindows/AddNewPopup';
import axios from 'axios';

const url = 'http://localhost:8080/suppliers';

function AddNewSupplierPopup({ onClose, onSave }) {
    const navigate = useNavigate();
    const [branches, setBranches] = useState([]);
    const [supplierName, setSupplierName] = useState('');
    const [regNo, setRegNo] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [contactNo, setContactNo] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('');

    const clearForm = () => {
        setSupplierName('');
        setRegNo('');
        setAddress('');
        setEmail('');
        setContactNo('');
        setSelectedBranch('');
    };

    const fetchBranchesData = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/branches`);
            const branchNames = response.data.map(branch => branch.branchName);
            setBranches(branchNames);
        } catch (error) {
            console.error('Error fetching branches:', error);
            setBranches([]);
        }
    };

    const handleBranchDropdownChange = (value) => {
        console.log('Selected Branch Dropdown Value:', value);
        setSelectedBranch(value);
    };

    useEffect(() => {
        fetchBranchesData(); 
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const resp = await axios.post(url, {
                supplierName,
                branchName: selectedBranch,
                regNo,
                address,
                email,
                contactNumber: contactNo
            });
            console.log("Response:", resp.data);

            clearForm(); // Clear the form after successfully posting data
            onSave();

            // If the POST request is successful, navigate to the specified page
            navigate('/adjust-supplier');
        } catch (error) {
            console.error("Error:", error);
            // You might want to handle the error gracefully, e.g., display an error message to the user
        }
    };

    return (
        <AddNewPopup topTitle="Add New Supplier" buttonId="save-btn" buttonText="Save" onClick={handleSave} onClose={onClose}>
            <div style={{ display: 'flex', gap: '20px', width: '100%' }}>
                <div style={{ flex: '1' }}>
                    <InputLabel htmlFor="branchName" color="#0377A8">Branch Name</InputLabel>
                    <InputDropdown
                        id="branchName"
                        name="branchName"
                        editable={true}
                        options={branches}
                        onChange={handleBranchDropdownChange}
                    />
                </div>
                <div style={{ flex: '1' }}>
                    <InputLabel htmlFor="supplierName" color="#0377A8">Supplier Name</InputLabel>
                    <InputField type="text" id="supplierName" name="supplierName" editable={true} value={supplierName} onChange={(e) => setSupplierName(e.target.value)} style={{ width: '100%' }} />
                </div>
            </div>
            <div style={{ display: 'flex', gap: '20px', width: '100%', marginTop: '10px' }}>
                <div style={{ flex: '1' }}>
                    <InputLabel htmlFor="regNo" color="#0377A8">Reg No</InputLabel>
                    <InputField type="text" id="regNo" name="regNo" editable={true} value={regNo} onChange={(e) => setRegNo(e.target.value)} style={{ width: '100%' }} />
                </div>
                <div style={{ flex: '1' }}>
                    <InputLabel htmlFor="address" color="#0377A8">Address</InputLabel>
                    <InputField type="text" id="address" name="address" editable={true} value={address} onChange={(e) => setAddress(e.target.value)} style={{ width: '100%' }} />
                </div>
            </div>
            <div style={{ display: 'flex', gap: '20px', width: '100%', marginTop: '10px' }}>
                <div style={{ flex: '1' }}>
                    <InputLabel htmlFor="email" color="#0377A8">Email</InputLabel>
                    <InputField type="text" id="email" name="email" editable={true} value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%' }} />
                </div>
                <div style={{ flex: '1' }}>
                    <InputLabel htmlFor="contactNo" color="#0377A8">Contact No</InputLabel>
                    <InputField type="text" id="contactNo" name="contactNo" editable={true} value={contactNo} onChange={(e) => setContactNo(e.target.value)} style={{ width: '100%' }} />
                </div>
            </div>
        </AddNewPopup>
    );
}

export default AddNewSupplierPopup;
