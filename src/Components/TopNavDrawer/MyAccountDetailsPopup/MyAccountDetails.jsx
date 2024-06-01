import React, { useState } from 'react';
import { Icon } from "@iconify/react";
import SubPopup from '../../PopupsWindows/SubPopup';
import Buttons from '../../Buttons/SquareButtons/Buttons';
import InputLabel from '../../Label/InputLabel';
import InputField from '../../InputField/InputField';
import { useDropzone } from 'react-dropzone';
import './MyAccountDetails.css';

function MyAccountDetails() {
    const [editable, setEditable] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);
    const [showSubPopup, setShowSubPopup] = useState(false);

    const toggleEditable = () => {
        setEditable(!editable);
    };

    const handleDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        const reader = new FileReader();
        reader.onload = () => {
            setImageUrl(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: '',
        multiple: false,
        onDrop: handleDrop
    });

    const handleCloseSubPopup = () => {
        setShowSubPopup(false);
    };

    const user = JSON.parse(sessionStorage.getItem('user'));
    let employeeName = user?.employeeName;
    let empId = user?.employeeId;
    let branchName = user?.branchName;
    let userRole = user?.role;
    let email= user?.email;
    



    return (
        <div>
            <SubPopup
                triggerComponent={
                    <div className="userProfile" >
                        <div className="profile-dp" />
                        <div className="userName">
                            <h4>{employeeName}</h4>   
                        </div>
                    </div>

                }
                popupPosition="70%"
                headBG="none"
                title={
                    <>
                        My Profile <Icon icon="tabler:edit" style={{ fontSize: "1em", cursor: "pointer" }} onClick={toggleEditable} />
                    </>
                }
                headTextColor="black"
                closeIconColor="red"
                show={showSubPopup}
                onClose={handleCloseSubPopup}
                bodyContent={(
                    <div className="view-profile-form-background">
                        <div className="branch-field">
                            <InputLabel for="branchName" color="#0377A8">Branch</InputLabel>
                            <InputField 
                            type="text"
                            id="branchName" 
                            name="branchName"
                            value={branchName} 
                            width="250px"
                             />
                        </div>
                        <div className="flex-content-ViewP">
                            <div className="user-role-field">
                                <InputLabel for="userRole" color="#0377A8">User Role</InputLabel>
                                <InputField 
                                type="text"
                                id="role" 
                                name="role"
                                value={userRole} 
                                width="250px"
                                />
                            </div>
                            <div className="change-dp" {...(getRootProps())}>
                                {imageUrl && <img className="preview-image" src={imageUrl} alt="Preview" />}
                                <label className="upload-label" htmlFor="profilePicture">
                                    <Icon icon="fluent:camera-add-20-regular" style={{ fontSize: "0.813em" }} />
                                </label>
                                <input {...getInputProps()} />
                                {isDragActive ? <p>Drop the image here...</p> : <p>Drag 'n' drop or click to select an image</p>}
                            </div>
                        </div>
                        <div className="emp-id-field">
                            <InputLabel for="empID" color="#0377A8">Emp ID</InputLabel>
                            <InputField 
                            type="text"
                            id="empID" 
                            name="empID"
                            value={empId} 
                             />
                        </div>
                        <div className="emp-name-field">
                            <InputLabel for="empName" color="#0377A8">Emp Name</InputLabel>
                            <InputField 
                            type="text" 
                            id="empName" 
                            name="empName" 
                            value={employeeName}
                             />
                        </div>
                        <div className="email-field">
                            <InputLabel for="empEmail" color="#0377A8">Official Email (Optional)</InputLabel>
                            <InputField 
                            type="email" 
                            id="empEmail" 
                            name="empEmail" 
                            value={email}
                            />
                        </div>
                        <div className="password-field">
                            <InputLabel for="userPassword" color="#0377A8">Do you want to change your password?</InputLabel>
                            <InputField type="password" id="currentPassword" name="currentPassword" placeholder="Current Password" editable={editable} />
                            <InputField type="password" id="newPassword" name="newPassword" placeholder="New Password" editable={editable} />
                            <InputField type="password" id="conf_newPassword" name="conf_newPassword" placeholder="Confirm New Password" editable={editable} />
                        </div>
                        <Buttons type="submit" id="save-btn" style={{ backgroundColor: "#23A3DA", color: "white" }}> Save </Buttons>
                    </div>
                )}
            />
        </div>
    );
}

export default MyAccountDetails;