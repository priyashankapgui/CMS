import { React, useState } from 'react'
import { useDropzone } from 'react-dropzone';
import Layout from "../../../../Layout/Layout";
import './CreateNewAccounts.css';
import { Icon } from "@iconify/react";
import { AiOutlineClose } from "react-icons/ai";
import { IoChevronBackCircleOutline } from "react-icons/io5";
import RoundButtons from '../../../../Components/Buttons/RoundButtons/RoundButtons';
import Buttons from '../../../../Components/Buttons/SquareButtons/Buttons';
import InputLabel from '../../../../Components/Label/InputLabel';
import InputField from '../../../../Components/InputField/InputField';
import InputDropdown from '../../../../Components/InputDropdown/InputDropdown';
import dropdownOptions from '../../../../Components/Data.json';
import { Link } from 'react-router-dom';

export function CreateNewAccounts() {
    const [imageUrl, setImageUrl] = useState(null);


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


    return (
        <>
            <div className="top-nav-blue-text">
                <div className="new-account-top-link">
                    <Link to="/accounts">
                        <IoChevronBackCircleOutline style={{ fontSize: "22px", color: "#0377A8" }} />
                    </Link>
                    <h4>New Account</h4>
                </div>
            </div>
            <Layout>
                <div className="new-account-form-background">
                    <div className='new-account-form-title'>
                        <h3>New Account</h3>
                        <Link to="/accounts">
                            <RoundButtons id="cancelBillBtn" type="submit" name="cancelBillBtn" icon={<AiOutlineClose style={{ color: 'red' }} onClick={() => console.log("Close Button clicked")} />} />
                        </Link>
                    </div>
                    <div className="branch-field">
                        <InputLabel for="branchName" color="#0377A8">Branch</InputLabel>
                        <InputDropdown id="branchName" name="branchName" editable={true} options={dropdownOptions.dropDownOptions.branchOptions} />
                    </div>
                    <div className="flex-content-NA">
                        <div className="user-role-field">
                            <InputLabel for="userRole" color="#0377A8">User Role</InputLabel>
                            <InputDropdown id="userRole" name="userRole" editable={true} options={dropdownOptions.dropDownOptions.userRoleOptions} />
                        </div>
                        <div className="add-dp-NA" {...(getRootProps())}>
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
                        <InputField type="text" id="empID" name="empID" editable={true} />
                    </div>
                    <div className="emp-name-field">
                        <InputLabel for="empName" color="#0377A8">Emp Name</InputLabel>
                        <InputField type="text" id="empName" name="empName" editable={true} />
                    </div>
                    <div className="email-field">
                        <InputLabel for="empEmail" color="#0377A8">Official Email (Optional)</InputLabel>
                        <InputField type="email" id="empEmail" name="empEmail" placeholder="abc@greenleaf.com" editable={true} />
                    </div>
                    <div className="password-field">
                        <InputLabel for="tempPassword" color="#0377A8">Password</InputLabel>
                        <InputField type="password" id="tempPassword" name="tempPassword" editable={true} />
                        <InputLabel for="tempConPassword" color="#0377A8">Confirm Password</InputLabel>
                        <InputField type="password" id="tempConPassword" name="tempPassword" editable={true} />
                    </div>
                    <Buttons type="submit" id="create-btn" style={{ backgroundColor: "#23A3DA", color: "white" }}> Create </Buttons>

                </div>
            </Layout>

        </>
    );
};


