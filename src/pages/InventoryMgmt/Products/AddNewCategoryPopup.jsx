import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InputLabel from '../../../Components/Label/InputLabel';
import InputField from '../../../Components/InputField/InputField';
import AddNewPopup from '../../../Components/PopupsWindows/AddNewPopup';
import axios from 'axios';
import CustomAlert from '../../../Components/Alerts/CustomAlert/CustomAlert';

const url = "http://localhost:8080/categories";

function AddNewCategoryPopup() {
    const navigate = useNavigate();
    const [categoryName, setCategoryName] = useState('');
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertConfig, setAlertConfig] = useState({});

    useEffect(() => {
        const storedAlertConfig = localStorage.getItem('alertConfig');
        if (storedAlertConfig) {
            setAlertConfig(JSON.parse(storedAlertConfig));
            setAlertVisible(true);
            localStorage.removeItem('alertConfig');
        }
    }, []);

    const handleSave = async (e) => {
        if (e) {
            e.preventDefault();
        }
        try {
            const resp = await axios.post(url, {
                categoryName: categoryName,

            });
            console.log("Category added successfully");
            const alertData = {
                severity: 'success',
                title: 'Added',
                message: 'Category added successfully!',
                duration: 3000
            };
            localStorage.setItem('alertConfig', JSON.stringify(alertData));
            navigate('/Products');
            window.location.reload();
        } catch (error) {
            console.error("Error:", error);
            const alertData = {
                severity: 'error',
                title: 'Error',
                message: 'Failed to add category.',
                duration: 3000
            };
            localStorage.setItem('alertConfig', JSON.stringify(alertData));
            navigate('/Products');
            window.location.reload();
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
            <AddNewPopup topTitle="Add New Category" buttonId="create-btn" buttonText="Create" onClick={handleSave}>
                <div style={{ display: 'block', width: '100%' }}>
                    <div>
                        <InputLabel htmlFor="categoryName" color="#0377A8">Category Name</InputLabel>
                        <InputField type="text" id="categoryName" name="categoryName" editable={true} value={categoryName} onChange={(e) => setCategoryName(e.target.value)} style={{ width: '100%' }} />
                    </div>

                </div>

            </AddNewPopup>
        </>
    );
}

export default AddNewCategoryPopup;