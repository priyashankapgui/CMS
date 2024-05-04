import React, { useState}  from 'react';
import axios from 'axios';
import { Icon } from "@iconify/react";
import InputLabel from '../../../Components/Label/InputLabel';
import InputField from '../../../Components/InputField/InputField';
import AddNewPopup from '../../../Components/PopupsWindows/AddNewPopup';
import { useDropzone } from 'react-dropzone'; 

const AddNewProductPopup = ({ history }) => {
    // //const [imageUrl, setImageUrl] = useState(null);
    // const [file, setFile] = useState(null);
    // //const [image, setImage] = useState('');

    // const [formData, setFormData] = useState({
    //     ProductName: "",
    //     BranchName: "",
    //     Description: "",
    //     CategoryName: ""
    // });

    const [productName, setProductName] = useState('')
    const [branchName, setBranchName] = useState('')
    const [description, setDescription] = useState('')
    const [categoryName, setCategoryName] = useState('')
    const [image, setImage] = useState('')

    const baseURL = "http://localhost:8080/products";

    const addProductHandler = async (e) => {
        e.preventDefault()

        const formData = new FormData()
        formData.append('image', image)
        formData.append('productName', productName)
        formData.append('branchName', branchName)
        formData.append('description', description)
        formData.append('categoryName', categoryName)

        
        try {
            await axios.post(baseURL, formData);
            history.push('/products');
        } catch (error) {
            console.error('Error posting data:', error);
        }

    };



    


    // const handleChange = (e) => {
    //     setFormData({ ...formData, [e.target.name]: e.target.value });

    // };

    // const handleFileChange = (e) => {
    //     const selectedFile = e.target.files[0];
    //     setFile(selectedFile);
    // };

   
//     const handleSubmit = async () => {
//         try{
   
           
//             // Optionally, you can reset the form after successful submission
           
        
//         }
//         catch (error) {
//             console.error('Error posting data:', error);
//         }
//    };

//     const handleDrop = (acceptedFiles) => {
//         const file = acceptedFiles[0];
//         setFile(file);
//     };

//     const { getRootProps, getInputProps, isDragActive } = useDropzone({
//         accept: '',
//         multiple: false,
//         onDrop: handleDrop
//     });

    return (
        <AddNewPopup topTitle="Create New Product " buttonId="save-btn" buttonText="Save" >
            <>
                
            <form onSubmit={addProductHandler} method="POST" encType='multipart/form-data'>
                <div style={{ display: 'flex', gap: '20px', width: '100%' }}>
                    <div style={{ flex: '1' }} controlId="fileName" className="mb-3">
                        <InputLabel htmlFor="uploadImage" color="#0377A8">Upload Image</InputLabel>
                        <input type="file" id="uploadImage" name="image" style={{ width: '100%' }} onChange={(e) => setImage(e.target.files[0])}/>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '20px', width: '100%' }}>

                    
                    <div style={{ flex: '1' }}>
                        <InputLabel htmlFor="productName" color="#0377A8" fontsize="">Product Name</InputLabel>
                        <InputField type="text" id="productName" name="productName" value={productName} onChange={(e) => setProductName(e.target.value)} editable={true} style={{ width: '100%' }} />
                        {/* <InputField type="text" id="productName" name="productName" value={formData.ProductName} onChange={handleChange} editable={true} style={{ width: '100%' }} /> */}
                    </div>

                    <div style={{ flex: '1' }}>
                        <InputLabel htmlFor="branchName" color="#0377A8">Branch Name</InputLabel>
                        <InputField type="text" id="branchName" name="branchName" value={branchName} onChange={(e) => setBranchName(e.target.value)} editable={true} style={{ width: '100%' }} />
                    </div>
                </div>
                
                <div style={{ display: 'flex', gap: '20px', width: '100%', marginTop: '10px' }}>
                    <div style={{ flex: '1' }}>
                        <InputLabel htmlFor="description" color="#0377A8">Description</InputLabel>
                        <InputField type="text" id="description" name="description" value={description} onChange={(e) => setDescription(e.target.value)} editable={true} style={{ width: '100%' }} />
                    </div>
                    <div style={{ flex: '1' }}>
                        <InputLabel htmlFor="categoryName" color="#0377A8">Category Name</InputLabel>
                        <InputField type="text" id="categoryName" name="categoryName" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} editable={true} style={{ width: '100%' }} />
                    </div>
                </div>
            </form>
            </>
        </AddNewPopup>
    );
}

export default AddNewProductPopup;
