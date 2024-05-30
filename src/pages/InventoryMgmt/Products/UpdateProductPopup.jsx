import React from 'react';
import InputLabel from '../../../Components/Label/InputLabel';
import InputField from '../../../Components/InputField/InputField';
import EditPopup from '../../../Components/PopupsWindows/EditPopup';

function UpdateProductPopup() {
    return (
        <>
            <EditPopup topTitle="Update Product's Details" buttonId="update-btn" buttonText="Update" onClick={() => console.log('clicked')}>

                <div className="content1" style={{ display: 'flex', gap: '20px', width: '100%' }}>
                    <div className="BranchField">
                        <InputLabel for="branchName" color="#0377A8">Branch Name</InputLabel>
                        <InputField type="text" id="branchName" name="branchName" editable={true} />
                    </div>
                    <div className="ProductNameField">
                        <InputLabel for="Product Name" color="#0377A8" fontsize="">Product Name</InputLabel>
                        <InputField type="text" id="Product Name" name="Product Name" editable={true} />
                    </div>
                </div>
                <div className="content2" style={{ display: 'flex', gap: '20px', width: '100%', marginTop: '10px' }}>
                    <div className="EmailField">
                        <InputLabel for="SupplierName" color="#0377A8">Supplier Name</InputLabel>
                        <InputField type="text" id="SupplierName" name="SupplierName" editable={true} />
                    </div>

                    <div className="ProductCategory">
                        <InputLabel for="ProductCategory" color="#0377A8">Product Category</InputLabel>
                        <InputField type="text" id="ProductCategory" name="ProductCategory" editable={true} />
                    </div>
                </div>

            </EditPopup>
        </>
    );
}

export default UpdateProductPopup;
