import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./ResetPw.css";
import InputField from "../../../Components/InputField/InputField";
import Buttons from "../../../Components/Buttons/SquareButtons/Buttons";
import SubPopup from "../../../Components/PopupsWindows/SubPopup";
import SubSpinner from "../../../Components/Spinner/SubSpinner/SubSpinner";
import PasswordStrengthBar from 'react-password-strength-bar';
import { resetPassword } from "../../../Api/Login/loginAPI";

const ResetPw = () => {
  //const API_RESET_PW_URL = `${process.env.REACT_APP_API_RESET_PASSWORD_URL}`;
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showSubPopup, setShowSubPopup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [subLoading, setSubLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setSubLoading(true);
    if (!password || !confirmPassword) {
      setError("Please fill in both password fields.");
      setSubLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setSubLoading(false);
      return;
    }
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    // If token is not present, redirect to login page
    if (!token) {
      window.location.href = "/";
    } else {
      const response = await resetPassword(token, password, confirmPassword);
      if (response.status === 200) {
        setShowSubPopup(true);
      } else {
        const data = response.data;
        setError(data.message);
      }
      setSubLoading(false);
    }
  };



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
            height="50px"
            width="410px"
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
          {password && (
            <PasswordStrengthBar
              password={password}
              minLength={8}
              scoreWordStyle={{
                fontSize: "14px",
                fontFamily: "Poppins",
              }
              }
              scoreWords={['very weak', 'weak', 'good', 'strong', 'very strong']}
              shortScoreWord="should be atlest 8 characters long"
            />
          )}
          <p className="s-confirmPW-text">Confirm New Password:</p>
          <InputField
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm new password"
            editable={true}
            height="50px"
            width="410px"
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
          {error && <p className="rp-error">{error}</p>}
          {subLoading ?
            <SubSpinner loading={subLoading} spinnerText="Saving" />
            :
            <Buttons
              type="submit"
              id="save-btn"
              style={{ backgroundColor: "#23A3DA", color: "white" }}
              btnHeight="50px"
              btnWidth="410px"
              fontSize="18px"
            >
              Save
            </Buttons>
          }
        </div>
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