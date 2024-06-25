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
        minQty: '',
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
        minQty: Joi.number().optional().label('Min Qty'),
        image: Joi.any().optional().label('Image')
    });

    useEffect(() => {
        if (productId) {
            axios.get(`${productsApiUrl}/${productId}`)
                .then(res => {
                    const { productName, description, categoryName, barcode, minQty, image } = res.data.data;
                    setPost({
                        productName,
                        description,
                        categoryName,
                        barcode,
                        minQty,
                        image
                    });
                })
                .catch(err => console.error('Error fetching product:', err));
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

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            TransformFile(file);
        }
    };

    const TransformFile = (file) => {
        const reader = new FileReader();

        reader.onloadend = () => {
            setPost({ ...post, image: reader.result });
        };

        reader.onerror = (error) => {
            console.error("Error reading file:", error);
            setPost({ ...post, image: null });
        };

        if (file) {
            reader.readAsDataURL(file);
        }
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

        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('productName', post.productName);
            formData.append('description', post.description);
            formData.append('categoryName', post.categoryName);
            formData.append('barcode', post.barcode);
            formData.append('minQty', post.minQty);
            if (post.image) {
                formData.append('image', post.image);
            }

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
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCategorySuggestions = async (query) => {
        try {
            const response = await axios.get(`http://localhost:8080/categories?search=${query}`);
            if (response.data && response.data.data) {
                return response.data.data.map(category => ({
                    id: category.categoryId,
                    displayText: `${category.categoryId} ${category.categoryName}`
                }));
            }
            return [];
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
                    <div style={{ display: 'block', width: '100%' }}>
                        <div>
                            <InputLabel htmlFor="image" color="#0377A8">Image</InputLabel>
                            <input type="file" id="image" name="image" onChange={handleFileChange} />
                        </div>
                        <div>
                            <InputLabel htmlFor="productName" color="#0377A8">Product Name</InputLabel>
                            <InputField type="text" id="productName" name="productName" value={post.productName} onChange={handleUpdate} editable={true} style={{ width: '100%' }} />
                        </div>
                        <div>
                            <InputLabel htmlFor="barcode" color="#0377A8">Barcode</InputLabel>
                            <InputField type="text" id="barcode" name="barcode" value={post.barcode} onChange={handleUpdate} editable={true} style={{ width: '100%' }} />
                        </div>
                        <div>
                            <InputLabel htmlFor="categoryName" color="#0377A8">Category Name</InputLabel>
                            <SearchBar
                                searchTerm={post.categoryName}
                                setSearchTerm={(value) => setPost({ ...post, categoryName: value })}
                                onSelectSuggestion={(suggestion) => setPost({ ...post, categoryName: suggestion.displayText.split(' ')[1] })}
                                fetchSuggestions={fetchCategorySuggestions}
                            />
                        </div>
                        <div>
                            <InputLabel htmlFor="description" color="#0377A8">Description</InputLabel>
                            <InputField type="text" id="description" name="description" value={post.description} onChange={handleUpdate} editable={true} style={{ width: '100%' }} />
                        </div>
                        <div>
                            <InputLabel htmlFor="minQty" color="#0377A8">Min Qty</InputLabel>
                            <InputField type="text" id="minQty" name="minQty" value={post.minQty} onChange={handleUpdate} editable={true} style={{ width: '100%' }} />
                        </div>
                    </div>
                    <button type="submit" style={{ display: 'none' }}>Submit</button>
                </form>
            </EditPopup>
        </>
    );
}

UpdateProductPopup.propTypes = {
    productId: PropTypes.string.isRequired
};

export default UpdateProductPopup;
