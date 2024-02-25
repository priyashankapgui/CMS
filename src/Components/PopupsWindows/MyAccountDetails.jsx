import React, { useState } from 'react';
import { Icon } from "@iconify/react";
import styled from 'styled-components';
import SubPopup from './SubPopup';
import Buttons from '../Buttons/Buttons';
import InputLabel from '../Label/InputLabel';
import InputField from '../InputField/InputField';
import InputDropdown from '../InputDropdown/InputDropdown';
import { useDropzone } from 'react-dropzone';


const FormBackground = styled.div`
  height: fit-content;
`;

const FlexContent = styled.div`
  display: inline-flex;
  gap: 2.5em;
`;

const ChangeDP = styled.div`
  width: 4.688em;
  height: 4.688em;
  background-color: lightgray;
  border-radius: 50%;
  margin-top: -1.875em;
  position: relative;
  overflow: hidden; 
`;

const UploadLabel = styled.label`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ProfileDP = styled.div`
    width: 2.1875em; 
    height: 2.1875em; 
    margin-left: 1.25em; 
    margin-right: 0.625em; 
    border-radius: 50%;
    flex-shrink: 0;
    background: url('../../Assets/ProfileDP-SuperAdmin.svg') lightgray 0px -0.3666em / 100% 9.205em no-repeat;
`;



function MyAccountDetails() {
    const [editable, setEditable] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);

    const toggleEditable = () => {
        setEditable(!editable);
    };

    const handleDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        const url = URL.createObjectURL(file);
        setImageUrl(url);
    };

    const { getRootProps, getInputProps } = useDropzone({
        accept: 'image/*',
        multiple: false,
        onDrop: handleDrop
    });

    return (
        <>
            <SubPopup
               triggerComponent={<ProfileDP />}
                popupPosition="70%"
                headBG="none"
                title={
                    <>
                        My Profile <Icon icon="tabler:edit" style={{ fontSize: "1em" }} onClick={toggleEditable} />
                    </>
                }

                headTextColor="black"
                closeIconColor="red"
                btnName="Save"
                btnBG="#23A3DA"
                btnTextColor="white"
                bodyContent={(
                    <FormBackground>
                        <div className="BranchField">
                            <InputLabel for="branchName" color="#0377A8">Branch</InputLabel>
                            <InputDropdown id="branchName" name="branchName" options={['All', 'Galle', 'Kaluthara']} editable={false} />
                        </div>
                        <FlexContent>
                            <div className="UserRoleField">
                                <InputLabel for="userRole" color="#0377A8">User Role</InputLabel>
                                <InputDropdown id="userRole" name="userRole" options={['Super Admin', 'Admin', 'Cashier']} editable={false} />
                            </div>
                            <ChangeDP {...getRootProps()}>
                                {/* Preview image */}
                                {imageUrl && <PreviewImage src={imageUrl} alt="Preview" />}
                                {/* Camera icon */}
                                <UploadLabel htmlFor="profilePicture">
                                    <Icon icon="fluent:camera-add-20-regular" style={{ fontSize: "0.813em" }} />
                                </UploadLabel>
                                {/* Hidden file input */}
                                <input {...getInputProps()} style={{ display: "none" }} />
                            </ChangeDP>
                        </FlexContent>
                        {/* Other fields */}
                        <div className="EmpIDField">
                            <InputLabel for="empID" color="#0377A8">Emp ID</InputLabel>
                            <InputField type="text" id="empID" name="empID" editable={false} />
                        </div>
                        <div className="EmpNameField">
                            <InputLabel for="empName" color="#0377A8">Emp Name</InputLabel>
                            <InputField type="text" id="empName" name="empName" editable={editable} />
                        </div>
                        <div className="EmailField">
                            <InputLabel for="empEmail" color="#0377A8">Official Email (Optional)</InputLabel>
                            <InputField type="email" id="empEmail" name="empEmail" placeholder="abc@greenleaf.com" editable={editable} />
                        </div>
                        <div className="PasswordField">
                            <InputLabel for="userPassword" color="#0377A8">Do you want to change your password?</InputLabel>
                            <InputField type="password" id="currentPassword" name="currentPassword" placeholder="Current Password" editable={editable} />
                            <InputField type="password" id="newPassword" name="newPassword" placeholder="New Password" editable={editable} />
                            <InputField type="password" id="conf_newPassword" name="conf_newPassword" placeholder="Confirm New Password" editable={editable} />
                        </div>
                        <Buttons type="submit" id="save-btn" style={{ backgroundColor: "#23A3DA", color: "white" }}> Save </Buttons>
                  
                    </FormBackground>
                 
                )}
            />
        </>
    );
}

export default MyAccountDetails;
