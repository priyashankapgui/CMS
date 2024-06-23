import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Joi from 'joi';
import { useNavigate } from 'react-router-dom';
import InputLabel from '../../../Components/Label/InputLabel';
import InputField from '../../../Components/InputField/InputField';
import EditPopup from '../../../Components/PopupsWindows/EditPopup';
import CustomAlert from '../../../Components/Alerts/CustomAlert/CustomAlert';
import PropTypes from 'prop-types';

const categoryApiUrl = process.env.REACT_APP_CATEGORY_API;

function UpdateCategoryPopup({ categoryId }) {
    const navigate = useNavigate();
    const [post, setPost] = useState({
        categoryName: '',
       
    });
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertConfig, setAlertConfig] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const schema = Joi.object({
        categoryName: Joi.string().required().label('Category Name'),
        
    });

    useEffect(() => {
        if (categoryId) {
            axios.get(`${categoryApiUrl}/${categoryId}`)
                .then(res => setPost({
                    categoryName: res.data.data.categoryName,
                   
                }))
                .catch(err => console.log(err));
        }
    }, [categoryId]);

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

        setIsLoading(true);
        try {
            await axios.put(`${categoryApiUrl}/${categoryId}`, post);

            const alertData = {
                severity: 'success',
                title: 'Successfully Updated!',
                message: 'Category updated successfully!',
                duration: 3000
            };
            localStorage.setItem('alertConfig', JSON.stringify(alertData));
            navigate('/Products');
            window.location.reload();
        } catch (error) {
            console.error('Error updating category:', error);
            const alertData = {
                severity: 'error',
                title: 'Error',
                message: 'Failed to update category.',
                duration: 3000
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
            <EditPopup
                topTitle="Update Category Details"
                buttonId="update-btn"
                buttonText="Update"
                onClick={handleSave}
                isLoading={isLoading}
            >
                <form onSubmit={handleSave}>
                    <div style={{ display: 'block', width: '100%' }}>
                        <div>
                            <InputLabel htmlFor="categoryName" color="#0377A8">Category Name</InputLabel>
                            <InputField type="text" id="categoryName" name="categoryName" value={post.categoryName} onChange={handleUpdate} editable={true} style={{ width: '100%' }} />
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
