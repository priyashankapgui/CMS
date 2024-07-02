import React, { useState, useEffect } from 'react';
import Joi from 'joi';
import { useNavigate } from 'react-router-dom';
import InputLabel from '../../../Components/Label/InputLabel';
import InputField from '../../../Components/InputField/InputField';
import InputFile from '../../../Components/InputFile/InputFile';
import AddNewPopup from '../../../Components/PopupsWindows/AddNewPopup';
import CustomAlert from '../../../Components/Alerts/CustomAlert/CustomAlert';
import { createCategory } from '../../../Api/Inventory/Category/CategoryAPI';

const AddNewCategoryPopup = ({ onClose, onSave }) => {
    const navigate = useNavigate();
    const [categoryName, setCategoryName] = useState('');
    const [image, setImage] = useState(null);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertConfig, setAlertConfig] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const categorySchema = Joi.object({
        categoryName: Joi.string().required().label('Category Name'),
        image: Joi.any().optional().label('Image'),
    });



    const validate = () => {
        const result = categorySchema.validate({ categoryName, image }, { abortEarly: false });
        if (!result.error) return null;

        const errorMessages = {};
        result.error.details.forEach(detail => {
            errorMessages[detail.path[0]] = detail.message;
        });
        return errorMessages;
    };

    const resetFields = () => {
        setCategoryName('');
        setImage(null);
    };

    const handleCategoryImageUpload = (e) => {
        const file = e.target.files[0];
        console.log("Selected file:", file);

        if (file) {
            TransformFile(file);
        }
    };

    const TransformFile = (file) => {
        const reader = new FileReader();

        reader.onloadend = () => {
            setImage(reader.result);
            console.log("Base64 Image:", reader.result);
        };

        reader.onerror = (error) => {
            console.error("Error reading file:", error);
            setImage(null);
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const addCategoryHandler = async (e) => {
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
        formData.append('categoryName', categoryName);

        setIsLoading(true);
        try {
           await createCategory(formData);

            const alertData = {
                severity: 'success',
                title: 'Added',
                message: 'Category added successfully!',
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
                message: 'Failed to add category.',
                duration: 5000
            };
            localStorage.setItem('alertConfig', JSON.stringify(alertData));
            navigate('/Products');
            window.location.reload();
        } finally {
            setIsLoading(false);
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
                topTitle="Create New Category"
                buttonId="save-btn"
                buttonText="Save"
                onClick={addCategoryHandler}
                isLoading={isLoading}
            >
                <form onSubmit={addCategoryHandler} encType='multipart/form-data'>
                    <div style={{ display: 'block', width: '100%' }}>
                        <div style={{ marginBottom: "5px" }}>
                            <InputLabel htmlFor="uploadImage" color="#0377A8">Upload Image</InputLabel>
                            <InputFile id="uploadImage" name="image" style={{ width: '100%' }} onChange={handleCategoryImageUpload} />
                        </div>
                        <div>
                            <InputLabel htmlFor="categoryName" color="#0377A8">Category Name</InputLabel>
                            <InputField type="text" id="categoryName" name="categoryName" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} editable={true} style={{ width: '100%' }} />
                        </div>
                    </div>
                </form>
            </AddNewPopup>
        </>
    );
};

export default AddNewCategoryPopup;
