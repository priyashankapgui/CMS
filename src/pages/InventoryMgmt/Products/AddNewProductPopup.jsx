import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import InputLabel from '../../../Components/Label/InputLabel';
import InputField from '../../../Components/InputField/InputField';
import AddNewPopup from '../../../Components/PopupsWindows/AddNewPopup';
import CreatableBar from '../../../Components/CreatableBar/CreatableBar';

export const AddNewProductPopup = ({ onClose, onSave }) => {
    const navigate = useNavigate();
    const [productName, setProductName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [image, setImage] = useState('');
    const [categoryOptions, setCategoryOptions] = useState([]);

    const baseURL = "http://localhost:8080/products";

    const resetFields = () => {
        setProductName('');
        setDescription('');
        setCategory('');
        setImage('');
    };

    const addProductHandler = async (e) => {
        e.preventDefault();
    
        const formData = new FormData();
        formData.append('image', image);
        formData.append('productName', productName);
        formData.append('description', description);
        formData.append('categoryName', category);

        try {
            await axios.post(baseURL, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            resetFields();
            navigate('/Products');
            onSave(); 
        } catch (error) {
            console.error('Error posting data:', error);
        }
    };

    const fetchCategoryOptions = async () => {
        try {
            const response = await axios.get('http://localhost:8080/categories');
            const options = response.data.map(item => ({
                id: item.categoryId,
                displayText:`${item.categoryId} ${item.categoryName}`
                // label: item.categoryName, 
                // value: item.categoryName
            }));
            setCategoryOptions(options);
        } catch (error) {
            console.error('Error fetching category options:', error);
        }
    };

    useEffect(() => {
        fetchCategoryOptions();
    }, []);

    return (
        <AddNewPopup
            topTitle="Create New Product"
            buttonId="save-btn"
            buttonText="Save"
            onClick={addProductHandler}
        >
            <form onSubmit={addProductHandler} method="POST" encType='multipart/form-data'>
                <div style={{ display: 'flex', gap: '20px', width: '100%' }}>
                    <div style={{ flex: '1' }} className="mb-3">
                        <InputLabel htmlFor="uploadImage" color="#0377A8">Upload Image</InputLabel>
                        <input type="file" id="uploadImage" name="image" style={{ width: '100%' }} onChange={(e) => setImage(e.target.files[0])} />
                    </div>
                    <div style={{ flex: '1' }}>
                        <InputLabel htmlFor="productName" color="#0377A8">Product Name</InputLabel>
                        <InputField type="text" id="productName" name="productName" value={productName} onChange={(e) => setProductName(e.target.value)} editable={true} style={{ width: '100%' }} />
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '20px', width: '100%' }}>
                    <div style={{ flex: '1' }}>
                        <InputLabel htmlFor="categoryName" color="#0377A8">Category Name</InputLabel>
                        <CreatableBar
                            options={categoryOptions}
                            value={category ? { label: category, value: category } : null}
                            onChange={(selectedOption) => setCategory(selectedOption ? selectedOption.value : '')}
                        />
                    </div>
                    <div style={{ flex: '1' }}>
                        <InputLabel htmlFor="description" color="#0377A8">Description</InputLabel>
                        <InputField type="text" id="description" name="description" value={description} onChange={(e) => setDescription(e.target.value)} editable={true} style={{ width: '100%' }} />
                    </div>
                </div>
            </form>
        </AddNewPopup>
    );
};

export default AddNewProductPopup;
