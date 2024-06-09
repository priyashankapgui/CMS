import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Joi from 'joi';
import { useNavigate } from 'react-router-dom';
import InputLabel from '../../../Components/Label/InputLabel';
import InputField from '../../../Components/InputField/InputField';
import AddNewPopup from '../../../Components/PopupsWindows/AddNewPopup';
import SearchBar from '../../../Components/SearchBar/SearchBar';
import CustomAlert from '../../../Components/Alerts/CustomAlert/CustomAlert';

export const AddNewProductPopup = ({ onClose, onSave }) => {
    const navigate = useNavigate();
    const [productName, setProductName] = useState('');
    const [description, setDescription] = useState('');
    const [categoryName, setCategoryName] = useState('');
    const [barcode, setBarcode] = useState('');
    const [image, setImage] = useState(null);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertConfig, setAlertConfig] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const baseURL = "http://localhost:8080/products";

    const productSchema = Joi.object({
        productName: Joi.string().required().label('Product Name'),
        description: Joi.string().optional().label('Description'),
        image: Joi.any().optional().label('Image'),
        categoryName: Joi.string().required().label('Category Name'),
        barcode: Joi.string().required().label('Barcode'),
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
        const result = productSchema.validate({ productName, description, image, categoryName, barcode }, { abortEarly: false });
        if (!result.error) return null;

        const errorMessages = {};
        result.error.details.forEach(detail => {
            errorMessages[detail.path[0]] = detail.message;
        });
        return errorMessages;
    };

    const resetFields = () => {
        setProductName('');
        setDescription('');
        setCategoryName('');
        setImage(null);
        setBarcode('');
    };

    const addProductHandler = async (e) => {
        if (e) {
            e.preventDefault();
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

        const formData = new FormData();
        formData.append('image', image);
        formData.append('productName', productName);
        formData.append('description', description);
        formData.append('categoryName', categoryName);
        formData.append('barcode', barcode);

        setIsLoading(true);
        try {
            await axios.post(baseURL, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            const alertData = {
                severity: 'success',
                title: 'Added',
                message: 'Product added successfully!',
                duration: 5000
            };
            localStorage.setItem('alertConfig', JSON.stringify(alertData));
            navigate('/Products');
            window.location.reload();
        } catch (error) {
            console.error('Error posting data:', error);
            const alertData = {
                severity: 'error',
                title: 'Error',
                message: 'Failed to add product.',
                duration: 5000
            };
            localStorage.setItem('alertConfig', JSON.stringify(alertData));
            navigate('/Products');
            window.location.reload();
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCategorySuggestions = async (query) => {
        try {
            const response = await axios.get(`http://localhost:8080/categories?search=${query}`);
            const formattedData = response.data.data.map(category => ({
                id: category.categoryId,
                displayText: `${category.categoryId} ${category.categoryName}`
            }));
            return formattedData;
        } catch (error) {
            console.error('Error fetching category:', error);
            return [];
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
            <AddNewPopup
                topTitle="Create New Product"
                buttonId="save-btn"
                buttonText="Save"
                onClick={addProductHandler}
                isLoading={isLoading}
            >
                <form onSubmit={addProductHandler} encType='multipart/form-data'>
                    <div style={{ display: 'flex', gap: '20px', width: '100%' }}>
                        <div style={{ flex: '1' }} className="mb-3">
                            <InputLabel htmlFor="uploadImage" color="#0377A8">Upload Image</InputLabel>
                            <input type="file" id="uploadImage" name="image" style={{ width: '100%' }} onChange={(e) => setImage(e.target.files[0])} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '20px', width: '100%' }}>
                        <div style={{ flex: '1' }}>
                            <InputLabel htmlFor="productName" color="#0377A8">Product Name</InputLabel>
                            <InputField type="text" id="productName" name="productName" value={productName} onChange={(e) => setProductName(e.target.value)} editable={true} style={{ width: '100%' }} />
                        </div>
                        
                        <div style={{ flex: '1' }}>
                            <InputLabel htmlFor="categoryName" color="#0377A8">Category Name</InputLabel>
                            <SearchBar
                                searchTerm={categoryName}
                                setSearchTerm={setCategoryName}
                                onSelectSuggestion={(suggestion) => setCategoryName(suggestion.displayText.split(' ').slice(1).join(' '))}
                                fetchSuggestions={fetchCategorySuggestions}
                            />

                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '20px', width: '100%' }}>
                    <div style={{ flex: '1' }}>
                            <InputLabel htmlFor="barcode" color="#0377A8">Barcode</InputLabel>
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