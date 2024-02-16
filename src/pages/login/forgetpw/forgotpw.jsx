import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";
import "./forgotpw.css";
import PopupLoginModal from "../../../components/popup/popupLogin";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

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
    // If the email is valid, open the modal
    setModalOpen(true);
  };
  const navigate = useNavigate();

  const handleClose = () => {
    setModalOpen(false);
    navigate("/changepw"); // Redirect to the change password page
  };

  return (
    <div className="s-fp-container">
      <form className="s-fp-form">
        <div className="s-forgotText">
          <h2>Forgot Password</h2>
        </div>

        <p>Enter your email to reset your password:</p>

        <div className="s-fp-fp">
          <div className="s-fp-inputField">
            <input
              className="s-fp-inputF"
              name="emailF"
              type="email" // Changed to email type for email validation
              placeholder="example@gmail.com"
              required
              value={email}
              onChange={handleEmailChange}
            />
            <FaEnvelope className="s-fp-icon" />
          </div>

          {/* <button className='s-fp-button' onClick={handleOpen}>Confirm</button> */}
          <button
            type="submit"
            className="s-fp-button"
            onClick={(e) => handleOpen(e)}
          >
            Confirm
          </button>
        </div>

        {error && <p className="fp-error">{error}</p>}

        <p className="backtologin">
          Remember your password?
          <Link to="/login">Login</Link>
        </p>
      </form>

      {modalOpen && (
        <PopupLoginModal
          open={modalOpen}
          onClose={handleClose}
          text="Your password has been sent to your email"
          buttonText={"Close"}
        />
      )}
    </div>
  );
};

export default ForgotPassword;
