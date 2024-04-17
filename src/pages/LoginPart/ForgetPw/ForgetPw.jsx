import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";
import "./ForgetPw.css";
import InputField from "../../../Components/InputField/InputField";
import Buttons from "../../../Components/Buttons/SquareButtons/Buttons";
import SubPopup from "../../../Components/PopupsWindows/SubPopup";

const ForgetPw = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [showSubPopup, setShowSubPopup] = useState(false); // State to control the visibility of SubPopup

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    // Clear any previous error message when user starts typing
    setError("");
  };

  const handleOpen = (e) => {
    e.preventDefault(); // Prevent default form submission
    // Validate if the email is empty
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    // Validate if the email ends with "@gmail.com"
    if (
      !email.endsWith("@gmail.com") ||
      !email.includes("@") ||
      !email.includes(".") ||
      !email.includes("com")
    ) {
      setError("Please enter a valid email address.");
      return;
    }
    // If email is valid, show the SubPopup
    console.log("Email is valid. Setting showSubPopup to true...");
    setShowSubPopup(true);
  };

  return (
    <div className="s-fp-container">
      <form className="s-fp-form">
        <div className="s-forgotText">
          <h2>Forgot Password</h2>
        </div>

        <p>Enter your email to reset your password:</p>

        <div className="s-fp-inputField">
          <InputField type="email" id="emailF" name="emailF" placeholder="example@gmail.com" editable={true} height="3em" width="30em" onChange={handleEmailChange} required><FaEnvelope className="s-fp-icon" /></InputField>
          <Buttons type="submit" id="confirm-btn" style={{ backgroundColor: "#23A3DA", color: "white" }} onClick={handleOpen}> Confirm </Buttons>
        </div>

        {error && <p className="fp-error">{error}</p>}

        <p className="backtologin">
          Remember your password?
          <Link to="/">  Login</Link>
        </p>
      </form>

      {console.log("showSubPopup:", showSubPopup)}
      {showSubPopup && (
        <SubPopup
          show={showSubPopup}
          onClose={() => setShowSubPopup(false)}
          headBG="#23A3DA"
          title="Alert"
          headTextColor="White"
          closeIconColor="white"
          bodyContent={(
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <p>Your password reset link has been sent to your email</p>


              {/*  Change this one later when it can be sent by email. */}

              <Link to="/login/resetpw">
                <Buttons type="button" id="ok-btn" style={{ backgroundColor: "#23A3DA", color: "white" }}>Ok </Buttons>
              </Link>
            </div>
          )}
        />
      )}
    </div>
  );
};

export default ForgetPw;
