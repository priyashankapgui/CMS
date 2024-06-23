import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaRegUserCircle } from "react-icons/fa";
import "./ForgetPw.css";
import InputField from "../../../Components/InputField/InputField";
import Buttons from "../../../Components/Buttons/SquareButtons/Buttons";
import SubPopup from "../../../Components/PopupsWindows/SubPopup";
import SubSpinner from "../../../Components/Spinner/SubSpinner/SubSpinner";

const ForgetPw = () => {
  const API_FORGOT_PW_URL = `${process.env.REACT_APP_API_FORGOT_PASSWORD_URL}`;
  const API_FORGOT_PW_SUPERADMIN_URL = `${process.env.REACT_APP_API_SUPERADMIN_FORGOT_PASSWORD_URL}`;
  const [empId, setEmpid] = useState("");
  const [error, setError] = useState("");
  const [showSubPopup, setShowSubPopup] = useState(false); // State to control the visibility of SubPopup
  const [subLoading, setSubLoading] = useState(false);


  const handleEmployeeIdSubmit = (e) => {
    setEmpid(e.target.value);
    // Clear any previous error message when user starts typing
    setError("");
  };

  const handleOpen = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setSubLoading(true);
    if (!empId.startsWith("SA")) {

      if (!empId) {
        setError("Please enter your employee ID.");
      }
      const response = await fetch(API_FORGOT_PW_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employeeId: empId,
        }),
      }).catch((error) => console.error("Error:", error));


      if (response.ok) {
        setShowSubPopup(true);
      } else {
        const data = await response.json();
        setError(data.message);
      }
      setSubLoading(false);
    } else {

      if (!empId) {
        setError("Please enter your employee ID.");
      }
      const response = await fetch(API_FORGOT_PW_SUPERADMIN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID: empId,
        }),
      }).catch((error) => console.error("Error:", error));

      if (response.ok) {
        setShowSubPopup(true);
      } else {
        const data = await response.json();
        setError(data.message);
      }
      setSubLoading(false);
    }
  };

  const handleOkButtonClick = () => {
    setShowSubPopup(false);
  };

  return (
    <div className="s-fp-container">
      <h2 className="s-flexflow-text-fp">Flex Flow</h2>
      <form className="s-fp-form">
        <div className="s-forgotText">
          <h2>Forgot Password</h2>
        </div>

        <p className="s-EnterEmp-FW">Enter your employee ID to reset your password:</p>

        <div className="s-fp-inputField">
          <InputField
            type="text"
            id="empId"
            name="empId"
            editable={true}
            placeholder="Emp ID"
            height="50px"
            width="410px"
            onChange={handleEmployeeIdSubmit}
            required
          >
            <FaRegUserCircle className="s-fp-icon" />
          </InputField>
          {error && <p className="fp-error">{error}</p>}
          {subLoading ?
            <SubSpinner loading={subLoading} spinnerText="Checking" />
            :
            <Buttons
              type="submit"
              id="confirm-btn"
              style={{ backgroundColor: "#23A3DA", color: "white" }}
              btnHeight="50px"
              btnWidth="410px"
              fontSize="18px"
              onClick={handleOpen}
            >
              {" "}
              Confirm{" "}
            </Buttons>
          }
        </div>
        <p className="backtologin">
          Remember your password?
          <Link to="/" className="loginPwTxt"> Login</Link>
        </p>
      </form>

      {console.log("showSubPopup:", showSubPopup)}
      {showSubPopup && (
        <SubPopup
          show={showSubPopup}
          onClose={() => setShowSubPopup(false)}
          headBG="#23A3DA"
          title="Email Alert"
          headTextColor="White"
          closeIconColor="white"
          bodyContent={
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <p>Your password reset link has been sent to your email</p>


              <Buttons
                type="button"
                id="ok-btn"
                style={{ backgroundColor: "#23A3DA", color: "white" }}
                onClick={handleOkButtonClick}
              >
                Ok{" "}
              </Buttons>

            </div>
          }
        />
      )}
    </div>
  );
};

export default ForgetPw;