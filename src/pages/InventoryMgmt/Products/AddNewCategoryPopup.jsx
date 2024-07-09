import React, { useState} from 'react';
import Joi from 'joi';
import InputLabel from '../../../Components/Label/InputLabel';
import InputField from '../../../Components/InputField/InputField';
import InputFile from '../../../Components/InputFile/InputFile';
import AddNewPopup from '../../../Components/PopupsWindows/AddNewPopup';
import CustomAlert from '../../../Components/Alerts/CustomAlert/CustomAlert';
import { createCategory } from '../../../Api/Inventory/Category/CategoryAPI';

const AddNewCategoryPopup = ({ onClose, onSave }) => {
    const [categoryName, setCategoryName] = useState('');
    const [image, setImage] = useState(null);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertConfig, setAlertConfig] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const categorySchema = Joi.object({
        categoryName: Joi.string().required().label('Category Name'),
    });



    const validate = () => {
        const result = categorySchema.validate( { categoryName},
            { abortEarly: false }
        );
        if (!result.error) return null;

        const errorMessages = {};
        result.error.details.forEach(detail => {
            errorMessages[detail.path[0]] = detail.message;
        });
        return errorMessages;
    };


    const handleCategoryImageUpload = (e) => {
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
                message:  Object.values(validationErrors).join('\n'),
                duration: 4000
            });
            setAlertVisible(true);
            return;
        }

        const formData = new FormData();
        formData.append('categoryName', categoryName);
        if (image) {
            formData.append('image', image);
        }

        setIsLoading(true);
        try {
            await createCategory(formData);

            setAlertConfig({
                severity: 'success',
                title: 'Added',
                message: 'Category added successfully!',
                duration: 4000
            });
            setAlertVisible(true);
            setCategoryName('');
            setImage('');

        } catch (error) {
            console.error('Error posting data:', error);
            setAlertConfig({
                severity: 'error',
                title: 'Error',
                message: 'Failed to add category.',
                duration: 4000
            });
            setAlertVisible(true);
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
                        <div>
                            <InputLabel htmlFor="categoryName" color="#0377A8">Category Name</InputLabel>
                            <InputField type="text" id="categoryName" name="categoryName" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} editable={true} style={{ width: '100%' }} />
                        </div>
                        <div style={{ marginBottom: "5px" }}>
                            <InputLabel htmlFor="uploadImage" color="#0377A8">Upload Image</InputLabel>
                            <InputFile id="uploadImage" name="image" style={{ width: '100%' }} onChange={handleCategoryImageUpload} />
                        </div>
                    </div>
                </form>
            </AddNewPopup>
        </>
    );
};

export default AddNewCategoryPopup;
