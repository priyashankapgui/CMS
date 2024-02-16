import React, { useState } from "react";
import "./changepw.css";
import { FaKey } from "react-icons/fa";
import { FcOk } from "react-icons/fc";
import { Link } from "react-router-dom";
import PopupLoginModal from "../../../components/popup/popupLogin";
import { useNavigate } from 'react-router-dom';

const Changepw = () => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform validation here
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // If validation passes, proceed with password change logic
    // For example, you can navigate to a different page
    // Here, we are logging the password change details

    // console.log('New Password:', newPassword);
    // console.log('Confirm Password:', confirmPassword);

    // Reset the fields after submission
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setModalOpen(true);

  };
  const navigate = useNavigate();

  const handleClose = () => {
    setModalOpen(false);
    navigate('/login'); // Redirect to the login page
   

  };

  return (
    <div className="s-cp-container">
      <form className="s-cp-form" onSubmit={handleSubmit}>
        <div className="s-cp-changepwText">
          <h2>Change Password</h2>
        </div>

        <p>Enter your new password:</p>

        <div className="s-cp-changepwcard">
          <div className="s-cp-inputField">
            <input
              type="password"
              placeholder="New Password"
              className="s-cp-inputF"
              value={newPassword}
              onChange={handleNewPasswordChange}
              required
            />
            <FaKey />
          </div>

          <div className="s-cp-inputField">
            <input
              type="password"
              placeholder="Confirm Password"
              className="s-cp-inputF"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
            />
            <FaKey />
          </div>

          {error && <p className="cp-error">{error}</p>}

          <div className="s-cp-buttonContainer">
            <button className="s-cp-button">Confirm</button>

            <Link to="/login/fp">Didn't Receive email? </Link>
          </div>
        </div>
      </form>
      {modalOpen && (
        <PopupLoginModal
          open={modalOpen}
          onClose={handleClose}
          text="Your password has been changed successfully!"
          buttonText={"Back to Login"}
          icon={<FcOk style={{ width: '50px', height: '50px' }}/>}
        />
      )}
    </div>
  );
};

export default Changepw;
