import React, { useState } from 'react';
import Layout from "../../Layout/Layout";
import { useDropzone } from 'react-dropzone';
import './WebMgmt.css';
import InputLabel from '../../Components/Label/InputLabel';
import InputField from '../../Components/InputField/InputField';
import Buttons from '../../Components/Buttons/SquareButtons/Buttons';


export const WebMgmt = () => {
    const [imageUrl, setImageUrl] = useState(null);
    const [files, setFile] = useState(null);
    const [showAlertSuccess, setShowAlertSuccess] = useState(false);
    const [showAlertError, setShowAlertError] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const formData = new FormData();

    const handleDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        setFile(file);
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

    const handleCreatewebImage = async () => {
        setLoading(true);
        try {
            
            if (files) {
                for (var x = 0; x < files.length; x++) {
                    formData.append("images", files[x]);
                }
                
            }
            const response = await fetch("http://localhost:8080/webIamges", {
                method: "POST",
                
                body: formData,
            });
            
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const data = await response.json();
                // Process JSON data
                if (!response.ok) {
                    console.log("Error:", data.error);
                   
                } else {
                    setShowAlertSuccess(true);
                    console.log("Success");
                }
            } else {
                // Handle non-JSON response (likely HTML)
                const text = await response.text();
                console.log("Non-JSON Response:", text);
                setShowAlertError("Unexpected response from server");
            }
            
        } catch (error) {
            setShowAlertError(error.message);
            console.error("Error:", error);
        }
        setLoading(false);
    }

    const handleImageChange = (event) => {
        const file = event.target.files;
        setFile(file);
        
        
    };


    

    return (
        <>
            <Layout>
                <div className="web-mgmt-container">
                    <div>
                        <h3 className='web-mgmt-headerOne'>Home Page</h3>
                        <div className="web-mgmt-data">
                            <InputLabel htmlFor="uploadImages" color="#0377A8">Upload Carousel Images</InputLabel>
                            
                            <input 
                                type="file" 
                                id="uploadCarosalImages" 
                                name="images" 
                                style={{ width: '100%' }} 
                                className="web-mgmt-lable"
                                onChange={handleImageChange} 
                                multiple 
                                
                            />
                        </div>
                        <div className="web-mgmt-data">
                            <InputLabel htmlFor="uploadImages" color="#0377A8">Upload End Images</InputLabel>
                            <input 
                                type="file" 
                                id="uploadEndImages" 
                                name="images" 
                                className="web-mgmt-lable"
                                style={{ width: '100%' }} 
                                onChange={handleImageChange} 
                                multiple 
                                src={imageUrl} 
                            />
                            {isDragActive ? (
                                <p>Drop the image here...</p>
                            ) : (
                                null
                            )}
                        </div>
                        <div className="web-mgmt-data"></div>
                        <h3 className='web-mgmt-headerOne'>AboutUs Page</h3>
                        <div className="web-mgmt-data">
                            <InputLabel htmlFor="uploadImages" color="#0377A8">Upload AboutUs Image</InputLabel>
                            <input 
                                type="file" 
                                id="uploadAboutUsImages" 
                                name="images" 
                                style={{ width: '100%' }} 
                                className="web-mgmt-lable"
                                onChange={handleImageChange} 
                                multiple 
                            />
                        </div>
                        <div className="web-mgmt-data">
                            <InputLabel htmlFor="aboutUs" color="#0377A8">Upload AboutUs</InputLabel>
                            <InputField type="text" id="aboutUs" name="AboutUs" textAlign="left" editable={true} width="100%" height="20vh"/>
                        </div>
                    </div>

                    <Buttons type="submit" id="submit-btn" style={{ backgroundColor: "white", color: "#EB1313" }} onClick={handleCreatewebImage} >
                        Submit
                    </Buttons>
                    {loading && <p>Loading...</p>}
                    {showAlertSuccess && <p>Image uploaded successfully!</p>}
                    {showAlertError && <p className='webMgmt_uploadErorr'>Error uploading image</p>}
                </div>
            </Layout>
        </>
    );
};
