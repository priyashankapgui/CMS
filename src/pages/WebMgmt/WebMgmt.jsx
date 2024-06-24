import React, { useState } from "react";
import Layout from "../../Layout/Layout";
import { useDropzone } from "react-dropzone";
import "./WebMgmt.css";
import InputLabel from "../../Components/Label/InputLabel";
import InputField from "../../Components/InputField/InputField";
import Buttons from "../../Components/Buttons/SquareButtons/Buttons";

export const WebMgmt = () => {
    const [imageUrl, setImageUrl] = useState(null);
    const [files, setFile] = useState(null);
    const [imageType, setImageType] = useState(""); 
    const formData = new FormData();
    const [showAlertSuccess, setShowAlertSuccess] = useState(false);
    const [showAlertError, setShowAlertError] = useState(false);
    const [loading, setLoading] = useState(false);
  
    const handleImageChange = (event, type) => {
      const file = event.target.files;
      setFile(file);
      setImageType(type); 
    };
  
    const handleCreatewebImage = async () => {
      setLoading(true);
      try {
        if (files) {
          for (var x = 0; x < files.length; x++) {
            formData.append("images", files[x]);
          }
          formData.append("type", imageType); 
        }
  
        const response = await fetch("http://localhost:8080/webIamges", {
          method: "POST",
          body: formData,
        });
  
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          if (!response.ok) {
            console.log("Error:", data.error);
          } else {
            setShowAlertSuccess(true);
            console.log("Success");
          }
        } else {
          const text = await response.text();
          console.log("Non-JSON Response:", text);
          setShowAlertError("Unexpected response from server");
        }
      } catch (error) {
        setShowAlertError(error.message);
        console.error("Error:", error);
      }
      setLoading(false);
    };
  
    return (
      <Layout>
        <div className="web-mgmt-container">
          <div>
            <h3 className="web-mgmt-header">Home Page</h3>
            <div className="web-mgmt-data">
              <InputLabel htmlFor="uploadCarosalImages" color="#0377A8">
                Upload Carousel Images
              </InputLabel>
              <input
                type="file"
                id="uploadCarosalImages"
                name="carosel"
                style={{ width: "100%" }}
                className="web-mgmt-lable"
                onChange={(event) => handleImageChange(event, "carosel")}
                multiple
              />
              <Buttons
                type="submit"
                id="submit-btn"
                style={{ backgroundColor: "white", color: "#EB1313" }}
                onClick={handleCreatewebImage}
              >
                Submit
              </Buttons>
            </div>
  
            <div className="web-mgmt-data">
              <InputLabel htmlFor="uploadEndImages" color="#0377A8">
                Upload End Images
              </InputLabel>
              <input
                type="file"
                id="uploadEndImages"
                name="images"
                className="web-mgmt-lable"
                style={{ width: "100%" }}
                onChange={(event) => handleImageChange(event, "endimage")}
                multiple
                src={imageUrl}
              />
              <Buttons
                type="submit"
                id="submit-btn"
                style={{ backgroundColor: "white", color: "#EB1313" }}
                onClick={handleCreatewebImage}
              >
                Submit
              </Buttons>
            </div>
          </div>
  
          <div>
            <h3 className="web-mgmt-header">AboutUs Page</h3>
            <div className="web-mgmt-data">
              <InputLabel htmlFor="uploadAboutUsImages" color="#0377A8">
                Upload AboutUs Image
              </InputLabel>
              <input
                type="file"
                id="uploadAboutUsImages"
                name="images"
                style={{ width: "100%" }}
                className="web-mgmt-lable"
                onChange={(event) => handleImageChange(event, "aboutimages")}
                multiple
              />
              <Buttons
                type="submit"
                id="submit-btn"
                style={{ backgroundColor: "white", color: "#EB1313" }}
                onClick={handleCreatewebImage}
              >
                Submit
              </Buttons>
            </div>
          </div>
  
          {loading && <p>Loading...</p>}
          {showAlertSuccess && <p>Image uploaded successfully!</p>}
          {showAlertError && (
            <p className="webMgmt_uploa">Error uploading image</p>
          )}
        </div>
     </Layout>
    );
  };
  