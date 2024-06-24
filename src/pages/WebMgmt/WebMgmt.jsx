import React, { useState } from "react";
import Layout from "../../Layout/Layout";
import "./WebMgmt.css";
import InputLabel from "../../Components/Label/InputLabel";
import Buttons from "../../Components/Buttons/SquareButtons/Buttons";
import InputFile from "../../Components/InputFile/InputFile";
import CustomAlert from "../../Components/Alerts/CustomAlert/CustomAlert";
import { MdSettingsSuggest } from "react-icons/md";

export const WebMgmt = () => {
  const [imageUrl, setImageUrl] = useState(null);
  const [files, setFiles] = useState({ carosel: null, endimage: null, aboutimages: null });
  const [imageType, setImageType] = useState("");
  const formData = new FormData();
  const [alert, setAlert] = useState({ severity: "", title: "", message: "", show: false });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState({ carosel: false, endimage: false, aboutimages: false });

  const handleImageChange = (event, type) => {
    const file = event.target.files;
    setFiles(prevFiles => ({ ...prevFiles, [type]: file }));
    setImageType(type);
  };

  const handleCreatewebImage = async () => {
    setLoading(true);
    try {
      if (files[imageType]) {
        for (var x = 0; x < files[imageType].length; x++) {
          formData.append("images", files[imageType][x]);
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
          setAlert({ severity: "error", title: "Error", message: data.error, show: true });
        } else {
          setAlert({ severity: "success", title: "Success", message: "Image uploaded successfully!", show: true });
          setSubmitted(prevSubmitted => ({ ...prevSubmitted, [imageType]: true }));
        }
      } else {
        const text = await response.text();
        setAlert({ severity: "error", title: "Error", message: "Unexpected response from server", show: true });
      }
    } catch (error) {
      setAlert({ severity: "error", title: "Error", message: error.message, show: true });
    }
    setLoading(false);
  };

  const handleCloseAlert = () => {
    setAlert(prevAlert => ({ ...prevAlert, show: false }));
  };

  return (
    <Layout>
      <div className="web-mgmt-container">
        <div className="web-mgmt-Section1">
          <h4 className="web-mgmt-heading">
            Home Page <MdSettingsSuggest />
          </h4>
          <InputLabel htmlFor="uploadCarosalImages" color="#0377A8">
            Upload Carousel Images
          </InputLabel>
          <InputFile
            id="uploadCarosalImages"
            name="carosel"
            className="web-mgmt-lable"
            onChange={(event) => handleImageChange(event, "carosel")}
            multiple
          />
          {imageUrl && <img src={imageUrl} alt="Uploaded" />}

          {files.carosel && !submitted.carosel && (
            <Buttons
              type="submit"
              id="submit-btn"
              style={{ backgroundColor: "#23A3DA", color: "white" }}
              btnWidth="100%"
              onClick={handleCreatewebImage}
            >
              {loading ? "Uploading..." : "Submit"}
            </Buttons>
          )}
        </div>

        <div className="web-mgmt-Section2">
          <InputLabel htmlFor="uploadEndImages" color="#0377A8">
            Upload End Images
          </InputLabel>
          <InputFile
            id="uploadEndImages"
            name="images"
            className="web-mgmt-lable"
            onChange={(event) => handleImageChange(event, "endimage")}
            multiple
          />
          {imageUrl && <img src={imageUrl} alt="Uploaded" />}

          {files.endimage && !submitted.endimage && (
            <Buttons
              type="submit"
              id="submit-btn"
              btnWidth="100%"
              style={{ backgroundColor: "#23A3DA", color: "white" }}
              onClick={handleCreatewebImage}
            >
              {loading ? "Uploading..." : "Submit"}
            </Buttons>
          )}
        </div>

        <hr className="web-mgmt-hr-line" />

        <div className="web-mgmt-Section3">
          <h4 className="web-mgmt-heading">
            About Us Page <MdSettingsSuggest />
          </h4>
          <InputLabel htmlFor="uploadAboutUsImages" color="#0377A8">
            Upload About Us Image
          </InputLabel>

          <InputFile
            id="uploadAboutUsImages"
            name="images"
            className="web-mgmt-lable"
            onChange={(event) => handleImageChange(event, "aboutimages")}
            multiple
          />
          {imageUrl && <img src={imageUrl} alt="Uploaded" />}

          {files.aboutimages && !submitted.aboutimages && (
            <Buttons
              type="submit"
              id="submit-btn"
              btnWidth="100%"
              style={{ backgroundColor: "#23A3DA", color: "white" }}
              onClick={handleCreatewebImage}
            >
              {loading ? "Uploading..." : "Submit"}
            </Buttons>
          )}
        </div>

        {loading && <p>Uploading...</p>}
        {alert.show && (
          <CustomAlert
            severity={alert.severity}
            title={alert.title}
            message={alert.message}
            duration={4000}
            onClose={handleCloseAlert}
          />
        )}
      </div>
    </Layout>
  );
};
