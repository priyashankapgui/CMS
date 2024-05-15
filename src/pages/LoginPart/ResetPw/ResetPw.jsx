import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./ResetPw.css";
import InputField from "../../../Components/InputField/InputField";
import Buttons from "../../../Components/Buttons/Buttons";
import SubPopup from "../../../Components/PopupsWindows/SubPopup";

const ResetPw = () => {
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      setError("Please fill in both password fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");



    // If token is not present, redirect to login page
    if (!token) {
      window.location.href = "/";
    } else {
      const response = await fetch("http://localhost:8080/api/login/resetpw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resetToken: token,
          newPassword: password,
          confirmPassword: confirmPassword,
        }),
      }).catch((error) => console.error("Error:", error));

      if (response.ok) {
        const data = await response.json();
        setShowSubPopup(true);

        console.log("Response data:", data);
      } else {
        const data = await response.json();
        setError(data.message);
      }
    }
  };

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showSubPopup, setShowSubPopup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError("");
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setError("");
  };

  const handleOkButtonClick = () => {
    // Navigate back to login page
    window.location.href = "/";
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="s-rp-container">
      <h2 className="s-flexflow-text-rp">Flex Flow</h2>
      <form className="s-rp-form" onSubmit={handleResetPassword}>
        <div className="s-resetText">
          <h2>Reset Password</h2>
        </div>
        <div className="s-rp-inputField">
          <p>New Password:</p>
          <InputField
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            placeholder="New password"
            editable={true}
            height="3em"
            width="30em"
            value={password}
            onChange={handlePasswordChange}
            required
          >
            <button
              type="button"
              onClick={toggleShowPassword}
              className="toggle-password-button"
              style={{
                border: "none",
                background: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              {showPassword ? <FaEye /> : < FaEyeSlash />}
            </button>
          </InputField>
          <p>Confirm New Password:</p>
          <InputField
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm new password"
            editable={true}
            height="3em"
            width="30em"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            required
          >
            <button
              type="button"
              onClick={toggleShowConfirmPassword}
              className="toggle-password-button"
              style={{
                border: "none",
                background: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              {showConfirmPassword ? <FaEye /> : < FaEyeSlash />}
            </button>
          </InputField>

          <Buttons
            type="submit"
            id="save-btn"
            style={{ backgroundColor: "#23A3DA", color: "white" }}
          >
            Save
          </Buttons>
        </div>
        {error && <p className="rp-error">{error}</p>}
      </form>

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
              <p>Your password has been reset successfully.</p>
              <Link to="/">
                <Buttons
                  type="button"
                  id="ok-btn"
                  style={{ backgroundColor: "#23A3DA", color: "white" }}
                  onClick={handleOkButtonClick}
                >
                  Ok
                </Buttons>
              </Link>
            </div>
          }
        />
      )}
    </div>
  );
};

export default ResetPw;