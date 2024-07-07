import React, { useState } from 'react';
import Joi from 'joi';
import InputLabel from '../../../Components/Label/InputLabel';
import InputField from '../../../Components/InputField/InputField';
import InputFile from '../../../Components/InputFile/InputFile';
import AddNewPopup from '../../../Components/PopupsWindows/AddNewPopup';
import SearchBar from '../../../Components/SearchBar/SearchBar';
import CustomAlert from '../../../Components/Alerts/CustomAlert/CustomAlert';
import { createProduct } from '../../../Api/Inventory/Product/ProductAPI';
import { getCategories } from '../../../Api/Inventory/Category/CategoryAPI';

export const AddNewProductPopup = ({ onClose, onSave }) => {
    const [productName, setProductName] = useState('');
    const [description, setDescription] = useState('');
    const [categoryName, setCategoryName] = useState('');
    const [barcode, setBarcode] = useState('');
    const [image, setImage] = useState(null);
    const [minQty, setMinQty] = useState('');
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertConfig, setAlertConfig] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const productSchema = Joi.object({
        productName: Joi.string().required().label('Product Name'),
        description: Joi.string().allow('').optional().label('Description'),
        categoryName: Joi.string().required().label('Category Name'),
        barcode: Joi.string().required().label('Barcode'),
        minQty: Joi.number().positive().required().label('Min Qty').messages({
            'number.base': 'Min Qty should be a valid number.',
            'number.positive': 'Min Qty should be a valid positive number.'
        })
    });

    const validate = () => {
        const result = productSchema.validate(
            { productName, description, categoryName, barcode, minQty },
            { abortEarly: false }
        );
        if (!result.error) return null;

        const errorMessages = {};
        result.error.details.forEach((detail) => {
            errorMessages[detail.path[0]] = detail.message;
        });
        return errorMessages;
    };

    const handleProductImageUpload = (e) => {
        const file = e.target.files[0];

        if (file && !['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
            setAlertConfig({
                severity: 'error',
                title: 'Validation Error',
                message: 'Image type should be JPG / JPEG / PNG.',
                duration: 4000
            });
            setAlertVisible(true);
            setImage(null);
            return;
        }
        if (file) {
            TransformFile(file);
        }
    };

    const TransformFile = (file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setImage(reader.result);
        };
        reader.onerror = (error) => {
            console.error('Error reading file:', error);
            setImage(null);
        };
        if (file) {
            reader.readAsDataURL(file);
        }
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
                message: Object.values(validationErrors).join('\n'),
                duration: 4000
            });
            setAlertVisible(true);
            return;
        }

        const formData = new FormData();
        formData.append('productName', productName);
        formData.append('description', description);
        formData.append('categoryName', categoryName);
        formData.append('barcode', barcode);
        formData.append('minQty', minQty);
        if (image) {
            formData.append('image', image);
        }

        setIsLoading(true);
        try {
            await createProduct(formData);
            setAlertConfig({
                severity: 'success',
                title: 'Added',
                message: 'Product added successfully!',
                duration: 4000
            });
            setAlertVisible(true);
            setProductName('');
            setDescription('');
            setCategoryName('');
            setBarcode('');
            setMinQty('');
            setImage(null);
        } catch (error) {
            console.error('Error posting data:', error);
            setAlertConfig({
                severity: 'error',
                title: 'Error',
                message: 'Failed to add Product.',
                duration: 4000
            });
            setAlertVisible(true);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCategorySuggestions = async (query) => {
        try {
            const response = await getCategories();
            const formattedData = response.data.map((category) => ({
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
                <form onSubmit={addProductHandler} encType="multipart/form-data">
                    <div style={{ display: 'block', width: '100%' }}>
                        <div>
                            <InputLabel htmlFor="productName" color="#0377A8">
                                Product Name
                            </InputLabel>
                            <InputField
                                type="text"
                                id="productName"
                                name="productName"
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                                editable={true}
                                style={{ width: '100%' }}
                            />
                        </div>
                        <div>
                            <InputLabel htmlFor="barcode" color="#0377A8">
                                Barcode
                            </InputLabel>
                            <InputField
                                type="text"
                                id="barcode"
                                name="barcode"
                                value={barcode}
                                onChange={(e) => setBarcode(e.target.value)}
                                editable={true}
                                style={{ width: '100%' }}
                            />
                        </div>
                        <div>
                            <InputLabel htmlFor="categoryName" color="#0377A8">
                                Category Name
                            </InputLabel>
                            <SearchBar
                                searchTerm={categoryName}
                                setSearchTerm={setCategoryName}
                                onSelectSuggestion={(suggestion) =>
                                    setCategoryName(suggestion.displayText.split(' ').slice(1).join(' '))
                                }
                                fetchSuggestions={fetchCategorySuggestions}
                            />
                        </div>
                        <div>
                            <InputLabel htmlFor="minQty" color="#0377A8">
                                Min Qty
                            </InputLabel>
                            <InputField
                                type="text"
                                id="minQty"
                                name="minQty"
                                value={minQty}
                                onChange={(e) => setMinQty(e.target.value)}
                                editable={true}
                                style={{ width: '100%' }}
                            />
                        </div>
                        <div style={{ marginBottom: '5px' }}>
                            <InputLabel htmlFor="uploadImage" color="#0377A8">
                                Upload Image
                            </InputLabel>
                            <InputFile
                                id="uploadImage"
                                name="image"
                                style={{ width: '100%' }}
                                onChange={handleProductImageUpload}
                            />
                        </div>
                        <div>
                            <InputLabel htmlFor="description" color="#0377A8">
                                Description
                            </InputLabel>
                            <InputField
                                type="text"
                                id="description"
                                name="description"
                                height="4em"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                editable={true}
                                style={{ width: '100%' }}
                            />
                        </div>
                    </div>
                </form>
            </AddNewPopup>
        </>
    );
};

export default AddNewProductPopup;
