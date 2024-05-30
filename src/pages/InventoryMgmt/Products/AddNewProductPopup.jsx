import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InputLabel from '../../../Components/Label/InputLabel';
import InputDropdown from "../../../Components/InputDropdown/InputDropdown";
import InputField from '../../../Components/InputField/InputField';
import AddNewPopup from '../../../Components/PopupsWindows/AddNewPopup';
import CreatableBar from '../../../Components/CreatableBar/CreatableBar';

export const AddNewProductPopup = ({ onClose, onSave }) => {
    const [productName, setProductName] = useState('');
    const [branch, setBranch] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [barcode, setBarcode] = useState('');
    const [image, setImage] = useState('');
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [branches, setBranches] = useState([]);

    const baseURL = "http://localhost:8080/products";

    const addProductHandler = async (e) => {
        e.preventDefault();

        // Logging form data before submission
        console.log('Form Data Before Submission:', {
            productName,
            branch: selectedBranch,
            description,
            category,
            barcode
        });

        if (!category) {
            console.error('Category name is required');
            return;
        }

        const formData = new FormData();
        formData.append('image', image);
        formData.append('productName', productName);
        formData.append('branchName', selectedBranch);
        formData.append('description', description);
        formData.append('categoryName', category);
        formData.append('barcode', barcode);

        try {
            await axios.post(baseURL, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            clearForm(); // Clear the form after successfully posting data
            onSave(); // Close the popup and refresh products list
        } catch (error) {
            console.error('Error posting data:', error);
        }
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

    const fetchCategoryOptions = async () => {
        try {
            const response = await axios.get('http://localhost:8080/categories');
            const options = response.data.map(item => ({
                label: `${item.categoryId} ${item.categoryName}`, 
                value: item.categoryName
            }));
            setCategoryOptions(options);
        } catch (error) {
            console.error('Error fetching category options:', error);
        }
    };

    const handleBranchDropdownChange = (value) => {
        console.log('Selected Branch Dropdown Value:', value);
        setSelectedBranch(value);
    };

    const handleCategorySelect = (selectedCategory) => {
        console.log('Selected Category:', selectedCategory);
        setCategory(selectedCategory ? selectedCategory.split(' ').slice(1).join(' ') : '');
    };

    const clearForm = () => {
        setProductName('');
        setBranch('');
        setDescription('');
        setCategory('');
        setBarcode('');
        setImage('');
        setSelectedBranch('');
    };

    useEffect(() => {
        fetchCategoryOptions();
        fetchBranchesData(); 
    }, []);

    return (
        <>
            <AddNewPopup
                topTitle="Create New Product"
                buttonId="save-btn"
                buttonText="Save"
                onClick={addProductHandler}
                onClose={onClose} // Ensure onClose is passed to handle closing the popup
            >
                <form onSubmit={addProductHandler} method="POST" encType='multipart/form-data'>
                    <div style={{ display: 'flex', gap: '20px', width: '100%' }}>
                        <div style={{ flex: '1' }} className="mb-3">
                            <InputLabel htmlFor="uploadImage" color="#0377A8">Upload Image</InputLabel>
                            <input type="file" id="uploadImage" name="image" style={{ width: '100%' }} onChange={(e) => setImage(e.target.files[0])} />
                        </div>
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
                    </div>
                    <div style={{ display: 'flex', gap: '20px', width: '100%' }}>
                        <div style={{ flex: '1' }}>
                            <InputLabel htmlFor="productName" color="#0377A8">Product Name</InputLabel>
                            <InputField type="text" id="productName" name="productName" value={productName} onChange={(e) => setProductName(e.target.value)} editable={true} style={{ width: '100%' }} />
                        </div>
                        <div style={{ flex: '1' }}>
                            <InputLabel htmlFor="categoryName" color="#0377A8">Category Name</InputLabel>
                            <CreatableBar
                                options={categoryOptions}
                                value={category}
                                onChange={handleCategorySelect}
                            />
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '20px', width: '100%', marginTop: '10px' }}>
                        <div style={{ flex: '1' }}>
                            <InputLabel htmlFor="barcode" color="#0377A8">Bar Code</InputLabel>
                            <InputField type="text" id="barcode" name="barcode" value={barcode} onChange={(e) => setBarcode(e.target.value)} editable={true} style={{ width: '100%' }} />
                        </div>
                        <div style={{ flex: '1' }}>
                            <InputLabel htmlFor="description" color="#0377A8">Description</InputLabel>
                            <InputField type="text" id="description" name="description" value={description} onChange={(e) => setDescription(e.target.value)} editable={true} style={{ width: '100%' }} />
                        </div>
                    </div>
                    
                </form>
            </AddNewPopup>
        </>
    );
};

export default AddNewProductPopup;
