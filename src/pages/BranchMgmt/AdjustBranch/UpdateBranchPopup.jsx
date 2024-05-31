import React, { useEffect, useState } from 'react';
import InputLabel from '../../../Components/Label/InputLabel';
import InputField from '../../../Components/InputField/InputField';
import EditPopup from '../../../Components/PopupsWindows/EditPopup';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const branchesApiUrl = process.env.REACT_APP_BRANCHES_API;

function UpdateBranchPopup({}) {
    const { id } = useParams();

    const [post, setPost] = useState({
        branchName: '',
        address: '',
        branchEmail: '',
        contactNo: ''
    });

    useEffect(() => {
        axios.get(`${branchesApiUrl}/${id}`)
            .then(res => setPost(res.data))
            .catch(err => console.log(err));
    }, [id]);

    const handleUpdate = (event) => {
        setPost({ ...post, [event.target.name]: event.target.value });
    };

    const handleSave = (event) => {
        event.preventDefault();
        axios.put(`${branchesApiUrl}/${id}`, post)
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.error('Error updating branch:', error);
            });
    };

    return (
        <EditPopup topTitle="Update Branch Details" buttonId="update-btn" buttonText="Update" onClick={handleSave}>
            <form onSubmit={handleSave}>
                <div className="content1" style={{ display: 'flex', gap: '20px', width: '100%' }}>
                    <div className="BranchField">
                        <InputLabel htmlFor="branchName" color="#0377A8">Branch Name</InputLabel>
                        <InputField type="text" id="branchName" name="branchName" value={post.branchName} onChange={handleUpdate} editable={true} />
                    </div>
                    <div className="AddressField">
                        <InputLabel htmlFor="address" color="#0377A8">Address</InputLabel>
                        <InputField type="text" id="address" name="address" value={post.address} onChange={handleUpdate} editable={true} />
                    </div>
                </div>
                <div className="content2" style={{ display: 'flex', gap: '20px', width: '100%', marginTop: '10px' }}>
                    <div className="EmailField">
                        <InputLabel htmlFor="branchEmail" color="#0377A8">Email</InputLabel>
                        <InputField type="text" id="branchEmail" name="branchEmail" value={post.branchEmail} onChange={handleUpdate} editable={true} />
                    </div>
                    <div className="ContactNoField">
                        <InputLabel htmlFor="contactNo" color="#0377A8">Contact No</InputLabel>
                        <InputField type="text" id="contactNo" name="contactNo" value={post.contactNo} onChange={handleUpdate} editable={true} />
                    </div>
                </div>
            </form>
        </EditPopup>
    );
}

export default UpdateBranchPopup;
