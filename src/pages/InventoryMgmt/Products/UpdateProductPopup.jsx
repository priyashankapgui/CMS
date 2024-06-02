import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Joi from 'joi';
import { useNavigate } from 'react-router-dom';
import InputLabel from '../../../Components/Label/InputLabel';
import InputField from '../../../Components/InputField/InputField';
import EditPopup from '../../../Components/PopupsWindows/EditPopup';
import SearchBar from '../../../Components/SearchBar/SearchBar';
import CustomAlert from '../../../Components/Alerts/CustomAlert/CustomAlert';
import PropTypes from 'prop-types';

const productsApiUrl = process.env.REACT_APP_PRODUCTS_API;

function UpdateProductPopup({ productId }) {
    const navigate = useNavigate();
    const [post, setPost] = useState({
        productName: '',
        description: '',
        categoryName: '',
        barcode: '',
        image: null
    });
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertConfig, setAlertConfig] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const schema = Joi.object({
        productName: Joi.string().required().label('Product Name'),
        description: Joi.string().optional().label('Description'),
        categoryName: Joi.string().required().label('Category Name'),
        barcode: Joi.string().required().label('Barcode'),
        image: Joi.any().optional().label('Image')
    });

    useEffect(() => {
        if (productId) {
            axios.get(`${productsApiUrl}/${productId}`)
                .then(res => setPost({
                    productName: res.data.productName,
                    description: res.data.description,
                    categoryName: res.data.categoryName,
                    barcode: res.data.barcode,
                    image: null
                }))
                .catch(err => console.log(err));
        }
    }, [productId]);

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
        const { name, value } = event.target;
        setPost({ ...post, [name]: value });
    };

    const handleImageUpdate = (event) => {
        setPost({ ...post, image: event.target.files[0] });
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

        const formData = new FormData();
        formData.append('image', post.image);
        formData.append('productName', post.productName);
        formData.append('description', post.description);
        formData.append('categoryName', post.categoryName);
        formData.append('barcode', post.barcode);

        setIsLoading(true);
        try {
            await axios.put(`${productsApiUrl}/${productId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            const alertData = {
                severity: 'success',
                title: 'Successfully Updated!',
                message: 'Product updated successfully!',
                duration: 3000
            };
            localStorage.setItem('alertConfig', JSON.stringify(alertData));
            navigate('/Products');
            window.location.reload();
        } catch (error) {
            console.error('Error updating product:', error);
            const alertData = {
                severity: 'error',
                title: 'Error',
                message: 'Failed to update product.',
                duration: 3000
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
            return response.data.map(category => ({
                id: category.categoryId,
                displayText: `${category.categoryId} ${category.categoryName}`
            }));
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
            <EditPopup
                topTitle="Update Product Details"
                buttonId="update-btn"
                buttonText="Update"
                onClick={handleSave}
                isLoading={isLoading}
            >
                <form onSubmit={handleSave} encType='multipart/form-data'>
                    <div style={{ display: 'flex', gap: '20px', width: '100%' }}>
                        <div style={{ flex: '1' }} className="mb-3">
                            <InputLabel htmlFor="uploadImage" color="#0377A8">Upload Image</InputLabel>
                            <input type="file" id="uploadImage" name="image" style={{ width: '100%' }} onChange={handleImageUpdate} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '20px', width: '100%' }}>
                        <div style={{ flex: '1' }}>
                            <InputLabel htmlFor="barcode" color="#0377A8">Barcode</InputLabel>
                            <InputField type="text" id="barcode" name="barcode" value={post.barcode} onChange={handleUpdate} editable={true} style={{ width: '100%' }} />
                        </div>
                        <div style={{ flex: '1' }}>
                            <InputLabel htmlFor="categoryName" color="#0377A8">Category Name</InputLabel>
                            <SearchBar
                                searchTerm={post.categoryName}
                                setSearchTerm={(value) => setPost({ ...post, categoryName: value })}
                                onSelectSuggestion={(suggestion) => setPost({ ...post, categoryName: suggestion.displayText.split(' ')[1] })}
                                fetchSuggestions={fetchCategorySuggestions}
                            />
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '20px', width: '100%' }}>
                        <div style={{ flex: '1' }}>
                            <InputLabel htmlFor="productName" color="#0377A8">Product Name</InputLabel>
                            <InputField type="text" id="productName" name="productName" value={post.productName} onChange={handleUpdate} editable={true} style={{ width: '100%' }} />
                        </div>
                        <div style={{ flex: '1' }}>
                            <InputLabel htmlFor="description" color="#0377A8">Description</InputLabel>
                            <InputField type="text" id="description" name="description" value={post.description} onChange={handleUpdate} editable={true} style={{ width: '100%' }} />
                        </div>
                    </div>
                </form>
            </EditPopup>
        </>
    );
}

UpdateProductPopup.propTypes = {
    productId: PropTypes.string.isRequired
};

export default UpdateProductPopup;
