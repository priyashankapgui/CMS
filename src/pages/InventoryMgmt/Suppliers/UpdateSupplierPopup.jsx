import React, { useEffect, useState } from 'react';
import InputLabel from '../../../Components/Label/InputLabel';
import InputField from '../../../Components/InputField/InputField';
import EditPopup from '../../../Components/PopupsWindows/EditPopup';
import CustomAlert from '../../../Components/Alerts/CustomAlert/CustomAlert';
import PropTypes from 'prop-types';
import Joi from 'joi';
import { getSupplierById, updateSupplier } from '../../../Api/Inventory/Supplier/SupplierAPI';

function UpdateSupplierPopup({ supplierId }) {
    const [post, setPost] = useState({
        supplierName: '',
        regNo: '',
        address: '',
        email: '',
        contactNo: ''
    });
    const [originalPost, setOriginalPost] = useState(null);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertConfig, setAlertConfig] = useState({});

    const schema = Joi.object({
        supplierName: Joi.string().required().label('Supplier Name'),
        regNo: Joi.string().required().label('Reg No'),
        email: Joi.string().email({ tlds: { allow: false } }).required().label('Email'),
        address: Joi.string().required().label('Address'),
        contactNo: Joi.string().pattern(/^\d{10}$/).required().label('Contact No').messages({
            'string.pattern.base': 'Contact No must be a 10-digit number.'
        }),
    });

    useEffect(() => {
        const fetchSupplierDetails = async () => {
            try {
                const res = await getSupplierById(supplierId);
                const { supplierName, regNo, address, email, contactNo } = res.data;
                const fetchedData = { supplierName, regNo, address, email, contactNo };
                setPost(fetchedData);
                setOriginalPost(fetchedData);
            } catch (error) {
                console.error('Error fetching supplier:', error);
            }
        };

        if (supplierId) {
            fetchSupplierDetails();
        }
    }, [supplierId]);

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
        if (event) {
            event.preventDefault();
        }

        const validationErrors = validate();
        if (validationErrors) {
            setAlertConfig({
                severity: 'error',
                title: 'Validation Error',
                message: Object.values(validationErrors).join('\n'),
                duration: 5000
            });
            setAlertVisible(true);
            return;
        }
        if (JSON.stringify(post) === JSON.stringify(originalPost)) {
            setAlertConfig({
                severity: 'info',
                title: 'No Changes',
                message: 'No changes were made to the supplier details.',
                duration: 3000
            });
            setAlertVisible(true);
            return;
        }

        try {
            await updateSupplier(supplierId, post);
            setAlertConfig({
                severity: 'success',
                title: 'Successfully Updated!',
                message: 'Supplier updated successfully!',
                duration: 3000
            });
            setAlertVisible(true);
        } catch (error) {
            console.error('Error updating supplier:', error);
            setAlertConfig({
                severity: 'error',
                title: 'Error',
                message: 'Failed to update supplier.',
                duration: 3000
            });
            setAlertVisible(true);
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
            <EditPopup topTitle="Update Supplier Details" buttonId="update-btn" buttonText="Update" onClick={handleSave}>
                <form onSubmit={handleSave}>
                    <div className="content1" style={{ display: 'block', width: '100%' }}>
                        <div className="supplierNameField">
                            <InputLabel htmlFor="supplierName" color="#0377A8">Supplier Name</InputLabel>
                            <InputField type="text" id="supplierName" name="supplierName" value={post.supplierName} onChange={handleUpdate} editable={true} />
                        </div>
                        <div className="RegNoField">
                            <InputLabel htmlFor="regNo" color="#0377A8">Reg No</InputLabel>
                            <InputField type="text" id="regNo" name="regNo" value={post.regNo} onChange={handleUpdate} editable={true} />
                        </div>
                        <div className="AddressField">
                            <InputLabel htmlFor="address" color="#0377A8">Address</InputLabel>
                            <InputField type="text" id="address" name="address" value={post.address} onChange={handleUpdate} editable={true} />
                        </div>
                        <div className="EmailField">
                            <InputLabel htmlFor="email" color="#0377A8">Email</InputLabel>
                            <InputField type="text" id="email" name="email" value={post.email} onChange={handleUpdate} editable={true} />
                        </div>
                        <div className="ContactNoField">
                            <InputLabel htmlFor="contactNo" color="#0377A8">Contact No</InputLabel>
                            <InputField type="text" id="contactNo" name="contactNo" value={post.contactNo} onChange={handleUpdate} editable={true} />
                        </div>
                    </div>
                    <button type="submit" style={{ display: 'none' }}>Submit</button>
                </form>
            </EditPopup>
        </>
    );
}

UpdateSupplierPopup.propTypes = {
    supplierId: PropTypes.string.isRequired
};

export default UpdateSupplierPopup;
