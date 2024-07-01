import React, { useState, useEffect } from "react";
import Buttons from "../../Buttons/SquareButtons/Buttons";
import InputLabel from "../../Label/InputLabel";
import InputField from "../../InputField/InputField";
import CustomAlert from "../../Alerts/CustomAlert/CustomAlert";
import "./MyAccountDetails.css";
import PasswordStrengthBar from "react-password-strength-bar";
import secureLocalStorage from "react-secure-storage";
import { useNavigate } from "react-router-dom";
import SubSpinner from "../../Spinner/SubSpinner/SubSpinner";
import { updatePassword, updatePersonalAccount } from "../../../Api/BranchMgmt/UserAccountsAPI";

export default function MyAccountDetailsPassword({ toggleViewPassword }) {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showAlertSuccess, setShowAlertSuccess] = useState(false);
  const [showAlertError, setShowAlertError] = useState("");
  const [loading, setLoading] = useState(false);


  const handleUpdate = async () => {
    if (!currentPassword || !password || !confirmPassword) {
      setShowAlertError("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      setShowAlertError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const token = secureLocalStorage.getItem("accessToken");
      const response = await updatePassword(currentPassword, password , token);
      console.log("response", response);
      if (response.status !== 200) {
        console.log("Error:", response.error);
        setShowAlertError(response.data.error);
      } 
      else {
        setShowAlertSuccess(true);
      }
      setLoading(false);
    } 
    catch (error) {
      setLoading(false);
      setShowAlertError(error.message);
      console.error("Error:", error);
    }
  };

  return (
    <div className="view-profile-form-background">
      <div>
        <Buttons
          id="toggle-btn"
          btnWidth="30px"
          btnHeight="fit-content"
          marginTop="0"
          style={{ backgroundColor: "white", color:"#0377A8", marginBottom: "20px"}}
          onClick={toggleViewPassword}
        >
           ←
        </Buttons>
        <form className="password-field" autoComplete="off">
          <InputLabel for="userPassword" color="#0377A8">
            Do you want to change your password?
          </InputLabel>
          <InputField
            type="password"
            id="currentPassword"
            name="currentPassword"
            placeholder="Current Password"
            value={currentPassword}
            editable={true}
            className="blue-border"
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <InputField
            type="password"
            id="newPassword"
            name="newPassword"
            placeholder="New Password"
            value={password}
            editable={true}
            className="blue-border"
            onChange={(e) => setPassword(e.target.value)}
          />
          {password && (
            <PasswordStrengthBar
              password={password}
              minLength={8}
              scoreWordStyle={{
                fontSize: "14px",
                fontFamily: "Poppins",
              }}
              scoreWords={["very weak", "weak", "good", "strong", "very strong"]}
              shortScoreWord="should be atlest 8 characters long"
            />
          )}
          <InputField
            type="password"
            id="conf_newPassword"
            name="conf_newPassword"
            placeholder="Confirm New Password"
            value={confirmPassword}
            editable={true}
            className="blue-border"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </form>
        {loading ? (
          <SubSpinner loading={loading} spinnerText="Updating" />
        ) : (
          <Buttons
            type="submit"
            id="update-btn"
            btnWidth="22em"
            style={{ backgroundColor: "#23A3DA", color: "white" }}
            onClick={handleUpdate}
          >
            Change Password
          </Buttons>
        )}
      </div>

      {showAlertSuccess && (
        <CustomAlert
          severity="success"
          title="Success"
          message="Your Password has been updated successfully"
          duration={3000}
          onClose={() => {setShowAlertSuccess(false);toggleViewPassword();}}
        />
      )}

      {showAlertError && (
        <CustomAlert
          severity="error"
          title="Error"
          message={showAlertError}
          duration={10000}
          onClose={() => setShowAlertError("")}
        />
      )}
    </div>
  );
}
