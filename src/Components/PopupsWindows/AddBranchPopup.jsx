import React, { useRef } from 'react';
import InputLabel from '../../Components/Label/InputLabel';
import InputField from '../InputField/InputField';
import EditPopup from './EditPopup';
import axios from 'axios';

function AddBranchPopup() {
  const form = useRef(null);

  const handleSubmit = () => {
    const formData = new FormData(form.current);

    axios.post("http://localhost:8080/branches", {
      branchName: formData.get('branchName'),
      address: formData.get('address'),
      email: formData.get('branchEmail'),
      contactNumber: formData.get('contactNo'),
    })
    .then(response => {
      // Handle the response
      console.log(response.data);
    })
    .catch(error => {
      // Handle the error
      console.error("Error:", error);
    });
  };

  return (
    <>
      <EditPopup 
        topTitle="Add Branch" 
        buttonId="addButton" 
        buttonText="Add"
        icon="none"
        labelText={"New +"}
        onSubmit={handleSubmit}
      >
        <form ref={form}>
          <div className="content1" style={{ display: 'flex', gap: '12px' }}>
            <div className="BranchField">
              <InputLabel for="branchName" color="#0377A8">Branch Name</InputLabel>
              <InputField type="text" id="branchName" name="branchName" editable={true} />
            </div>
            <div className="AddressField">
              <InputLabel for="address" color="#0377A8" fontsize="">Address</InputLabel>
              <InputField type="text" id="address" name="address" editable={true} />
            </div>
          </div>
          <div className="content2" style={{ display: 'flex', gap: '10px' }}>
            <div className="EmailField">
              <InputLabel for="branchEmail" color="#0377A8">Email</InputLabel>
              <InputField type="text" id="branchEmail" name="branchEmail" editable={true} />
            </div>
            <div className="ContactNoField">
              <InputLabel for="contactNo" color="#0377A8">Contact No</InputLabel>
              <InputField type="text" id="contactNo" name="contactNo" editable={true} />
            </div>
          </div>
        </form>
      </EditPopup>
    </>
  );
}

export default AddBranchPopup;
    