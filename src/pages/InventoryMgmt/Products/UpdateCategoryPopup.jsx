import React, { useState, useEffect } from 'react';
import Joi from 'joi';
import InputLabel from '../../../Components/Label/InputLabel';
import InputField from '../../../Components/InputField/InputField';
import InputFile from '../../../Components/InputFile/InputFile';
import EditPopup from '../../../Components/PopupsWindows/EditPopup';
import CustomAlert from '../../../Components/Alerts/CustomAlert/CustomAlert';
import PropTypes from 'prop-types';
import { getCategoryById, updateCategory } from '../../../Api/Inventory/Category/CategoryAPI';



function UpdateCategoryPopup({ categoryId }) {

    const [post, setPost] = useState({
        categoryName: '',
        image: null
    });

    const [alertVisible, setAlertVisible] = useState(false);
    const [alertConfig, setAlertConfig] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const schema = Joi.object({
        categoryName: Joi.string().required().label('Category Name'),
        image: Joi.any().optional().label('Image')
    });

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const categoryData = await getCategoryById(categoryId);
                setPost({
                    categoryName: categoryData.data.categoryName,
                    image: null
                });
            } catch (error) {
                console.error('Error fetching category:', error);
            }
        };

        if (categoryId) {
            fetchCategory();
        }
    }, [categoryId]);


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
            formData.append('categoryName', post.categoryName);
            if (post.image) {
                formData.append('image', post.image);
            }

            await updateCategory(categoryId, formData);

            setAlertConfig({
                severity: 'success',
                title: 'Successfully Updated!',
                message: 'Category updated successfully!',
                duration: 3000
            });
            setAlertVisible(true);
        } catch (error) {
            console.error('Error updating category:', error);
            setAlertConfig({
                severity: 'error',
                title: 'Error',
                message: 'Failed to update category.',
                duration: 3000
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
            <EditPopup
                topTitle="Update Category Details"
                buttonId="update-btn"
                buttonText="Update"
                onClick={handleSave}
                isLoading={isLoading}
            >
                <form onSubmit={handleSave} encType='multipart/form-data'>
                    <div style={{ display: 'block', width: '100%' }}>
                        <div>
                            <InputLabel htmlFor="categoryName" color="#0377A8">Category Name</InputLabel>
                            <InputField type="text" id="categoryName" name="categoryName" value={post.categoryName} onChange={handleUpdate} editable={true} style={{ width: '100%' }} />
                        </div>
                        <div>
                            <InputLabel htmlFor="image" color="#0377A8">Image</InputLabel>
                            <InputFile id="image" name="image" onChange={handleFileChange} />
                        </div>
                    </div>
                    <button type="submit" style={{ display: 'none' }}>Submit</button>
                </form>
            </EditPopup>
        </>
    );
}

UpdateCategoryPopup.propTypes = {
    categoryId: PropTypes.string.isRequired
};

export default UpdateCategoryPopup;
