import React, { useState, useEffect } from 'react';
import Joi from 'joi';
import InputLabel from '../../../Components/Label/InputLabel';
import InputField from '../../../Components/InputField/InputField';
import InputFile from '../../../Components/InputFile/InputFile';
import EditPopup from '../../../Components/PopupsWindows/EditPopup';
import SearchBar from '../../../Components/SearchBar/SearchBar';
import CustomAlert from '../../../Components/Alerts/CustomAlert/CustomAlert';
import PropTypes from 'prop-types';
import { getProductById, updateProduct } from '../../../Api/Inventory/Product/ProductAPI';
import { getCategories } from '../../../Api/Inventory/Category/CategoryAPI';


function UpdateProductPopup({ productId }) {
    const [post, setPost] = useState({
        productName: '',
        description: '',
        categoryName: '',
        barcode: '',
        minQty: '',
        image: null
    });
    const [originalPost, setOriginalPost] = useState({});
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
            getProductById(productId)
                .then(res => {
                    const { productName, description, categoryName, barcode, minQty, image } = res.data;
                    const productData = {
                        productName,
                        description,
                        categoryName,
                        barcode,
                        minQty,
                        image
                    };
                    setPost(productData);
                    setOriginalPost(productData);

                })
                .catch(err => console.error('Error fetching product:', err));
        }
    }, [productId]);


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
        if (name === 'minQty') {
            // Validate minQty as a number
            if (isNaN(value)) {
                setAlertConfig({
                    severity: 'error',
                    title: 'Invalid Min Qty',
                    message: 'Minimum Quantity must be a valid number.',
                    duration: 4000
                });
                setAlertVisible(true);
                return;
            }
        }
        setPost({ ...post, [name]: value });
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.match('image.*')) {
                setAlertConfig({
                    severity: 'error',
                    title: 'Invalid File Type',
                    message: 'Please upload a valid image file (JPEG, PNG, GIF, etc.).',
                    duration: 4000
                });
                setAlertVisible(true);
                return;
            }
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
                duration: 4000
            });
            setAlertVisible(true);
            return;
        }
        if (JSON.stringify(post) === JSON.stringify(originalPost)) {
            setAlertConfig({
                severity: 'info',
                title: 'No Changes',
                message: 'No changes detected in the product details.',
                duration: 3000
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

            await updateProduct(productId, formData);

            setAlertConfig({
                severity: 'success',
                title: 'Successfully Updated!',
                message: 'Product updated successfully!',
                duration: 3000
            });
            setAlertVisible(true);
        } catch (error) {
            console.error('Error updating product:', error);
            setAlertConfig({
                severity: 'error',
                title: 'Error',
                message: 'Failed to update product.',
                duration: 3000
            });
            setAlertVisible(true);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCategorySuggestions = async (query) => {
        try {
            const response = await getCategories();
            if (response.data && response.data) {
                return response.data.map(category => ({
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
                            <InputLabel htmlFor="image" color="#0377A8">Image</InputLabel>
                            <InputFile id="image" name="image" onChange={handleFileChange} />
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
