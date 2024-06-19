import React, { useState } from 'react';
import Layout from "../../Layout/Layout";
import './WebMgmt.css';
import InputLabel from '../../Components/Label/InputLabel';
import InputField from '../../Components/InputField/InputField';

export const WebMgmt = () => {
    const [images, setImages] = useState([]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);
    };

    return (
        <>
            <Layout>
                <div className="web-mgmt-container">
                    <div>
                        <h3 className='web-mgmt-headerOne'>Home Page </h3>
                        <div className="web-mgmt-data">
                            <InputLabel htmlFor="uploadImages" color="#0377A8" >Upload Carousel Images</InputLabel>
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
                            />
                        </div>
                        <div  className="web-mgmt-data">
                        <InputLabel htmlFor="AddAnimetion" color="#0377A8">Add animetion</InputLabel>

                        
                        </div>

                        <h3 className='web-mgmt-headerOne'>AboutUs Page </h3>
                        <div className="web-mgmt-data">
                            <InputLabel htmlFor="uploadImages" color="#0377A8" >Upload AboutUs Image</InputLabel>
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
                            <InputLabel htmlFor="uploadImages" color="#0377A8" >Upload AboutUs</InputLabel>
                            <InputField type="text" id="aboutUs" name="AboutUs" textAlign="left" editable={true} width="100%"  height="20vh"/>
                         </div>
                    </div>
                </div>
            </Layout>
        </>
    );
};
