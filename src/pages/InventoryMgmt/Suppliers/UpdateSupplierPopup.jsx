import React, { useEffect, useState } from 'react';
import InputLabel from '../../../Components/Label/InputLabel';
import InputField from '../../../Components/InputField/InputField';
import EditPopup from '../../../Components/PopupsWindows/EditPopup';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const suppliersApiUrl = process.env.REACT_APP_SUPPLIERS_API || "http://localhost:8080/suppliers";

function UpdateSupplierPopup() {
    const { id } = useParams();
    const [post, setPost] = useState({
        supplierName: '',
        regNo: '',
        address: '',
        email: '',
        contactNo: ''
    });

    useEffect(() => {
        if (id) {
            axios.get(`${suppliersApiUrl}/${id}`)
                .then(res => setPost(res.data))
                .catch(err => console.log(err));
        }
    }, [id]);

    const handleUpdate = (event) => {
        const { name, value } = event.target;
        setPost(prevPost => ({
            ...prevPost,
            [name]: value
        }));
    };

    const handleSave = (event) => {
        event.preventDefault();
        axios.put(`${suppliersApiUrl}/${id}`, post)
            .then(response => {
                console.log(response.data);
                window.alert('Supplier updated successfully!');
                // Optional: navigate to a different page or refresh the data
            })
            .catch(error => {
                console.error('Error updating supplier:', error);
                window.alert('Failed to update supplier.');
            });
    };

    return (
        <EditPopup topTitle="Update Supplier Details" buttonId="update-btn" buttonText="Update" onClick={handleSave}>
            <div className="content1" style={{ display: 'flex', gap: '20px', width: '100%' }}>
                <div className="supplierNameField">
                    <InputLabel htmlFor="supplierName" color="#0377A8">Supplier Name</InputLabel>
                    <InputField type="text" id="supplierName" name="supplierName" value={post.supplierName} onChange={handleUpdate} editable={true} />
                </div>
                <div className="RegNoField">
                    <InputLabel htmlFor="regNo" color="#0377A8">Reg No</InputLabel>
                    <InputField type="text" id="regNo" name="regNo" value={post.regNo} onChange={handleUpdate} editable={true} />
                </div>
            </div>
            <div className="content2" style={{ display: 'flex', gap: '20px', width: '100%', marginTop: '10px' }}>
                <div className="AddressField">
                    <InputLabel htmlFor="address" color="#0377A8">Address</InputLabel>
                    <InputField type="text" id="address" name="address" value={post.address} onChange={handleUpdate} editable={true} />
                </div>
                <div className="EmailField">
                    <InputLabel htmlFor="email" color="#0377A8">Email</InputLabel>
                    <InputField type="text" id="email" name="email" value={post.email} onChange={handleUpdate} editable={true} />
                </div>
            </div>
            <div className="content3" style={{ display: 'flex', gap: '20px', width: '100%', marginTop: '10px' }}>
                <div className="ContactNoField">
                    <InputLabel htmlFor="contactNo" color="#0377A8">Contact No</InputLabel>
                    <InputField type="text" id="contactNo" name="contactNo" value={post.contactNo} onChange={handleUpdate} editable={true} />
                </div>
            </div>
        </EditPopup>
    );
}

export default UpdateSupplierPopup;
