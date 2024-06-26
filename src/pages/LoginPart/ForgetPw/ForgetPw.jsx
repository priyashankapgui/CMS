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

  const handleOpen = async (e) => {
    e.preventDefault(); // Prevent default form submission


    if (!email) {
      setError("Please enter your email address.");
      return;
    }


    if (
      // !email.endsWith("@gmail.com") ||
      !email.includes("@") ||
      !email.includes(".") ||
      !email.includes("com")
    ) {
      setError("Please enter a valid email address.");
      return;
    }

    const response = await fetch("http://localhost:8080/api/login/fp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
      }),
    }).catch((error) => console.error("Error:", error));


    if (response.ok) {
      setShowSubPopup(true);
    } else {
      const data = await response.json();
      setError(data.message);
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

        <p>Enter your email to reset your password:</p>

        <div className="s-fp-inputField">
          <InputField
            type="email"
            id="emailF"
            name="emailF"
            placeholder="example@gmail.com"
            editable={true}
            height="3em"
            width="30em"
            onChange={handleEmailChange}
            required
          >
            <FaEnvelope className="s-fp-icon" />
          </InputField>
          <Buttons
            type="submit"
            id="confirm-btn"
            style={{ backgroundColor: "#23A3DA", color: "white" }}
            onClick={handleOpen}
          >
            {" "}
            Confirm{" "}
          </Buttons>
        </div>

        {error && <p className="fp-error">{error}</p>}

        <p className="backtologin">
          Remember your password?
          <Link to="/"> Login</Link>
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