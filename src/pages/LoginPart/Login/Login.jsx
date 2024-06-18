import React, { useState } from "react";
import "./Login.css";
import { Link } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import {
  FaRegEye,
  FaRegUserCircle,
  FaEyeSlash,
} from "react-icons/fa";
import { HiArrowRight } from "react-icons/hi";
import cmslogo from "../../../Assets/cmslogo.svg";
import greenleaf from "../../../Assets/greenleaf.svg";
import InputField from "../../../Components/InputField/InputField";
import Buttons from "../../../Components/Buttons/SquareButtons/Buttons";
import CustomAlert from '../../../Components/Alerts/CustomAlert/CustomAlert';
import SubSpinner from "../../../Components/Spinner/SubSpinner/SubSpinner";

const Login = () => {
  const API_LOGIN_KEY = `${process.env.REACT_APP_API_LOGIN_URL}`;
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [empID, setEmpId] = useState("");
  const [error, setError] = useState("");
  const [subLoading, setSubLoading] = useState(false); // State for showing spinner
  const [loggingSuccess, setLoggingSuccess] = useState(false);

  const handleEmpIdChange = (e) => {
    setEmpId(e.target.value);
    setError("");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError("");
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setSubLoading(true);
    let response;
    if (empID.startsWith("SA")) {
      response = await fetch(`http://localhost:8080/superAdmin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID: empID,
          password: password,
        }),
      }).catch((error) => console.error("Error:", error));
    } else {
      response = await fetch(API_LOGIN_KEY, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employeeId: empID,
          password: password,
        }),
      }).catch((error) => console.error("Error:", error));
    }
    try {
      if (response.ok) {
        const data = await response.json();
        console.log("Response data:", data);

        // Store the token in local storage
        secureLocalStorage.setItem("accessToken", data.token);
        secureLocalStorage.setItem("user", JSON.stringify(data.user));
        secureLocalStorage.setItem("accessToken", data.token);

        setLoggingSuccess(true);
      } else {
        // Login failed, handle error
        const data = await response.json();
        console.log("Error:", data.error);
        setError(data.error);
        setSubLoading(false);
      }
    }
    catch (error) {
      setError("Internal Server Error")
      console.error("Error:", error);
      setSubLoading(false);
    }
  };

  return (
    <>
      <div className="s-mainContainer">
        {/* Login page content */}
        <div className="s-leftcontainer">
          <img className="s-image" src={cmslogo} alt="cms logo" />
          <h2 className="s-flexflow-text">Flex Flow</h2>

          <div className="s-companyName">
            <p>Hexacode Solutions Pvt Ltd</p>
          </div>
        </div>

        <div className="s-rightcontainer">
          <div className="s-greenmartlogo">
            <img src={greenleaf} alt="greenmart logo" />
            <h2 className="s-boldText">Green Leaf Super Mart </h2>
          </div>

          <div className="s-loginCard">
            <form className="s-form" onSubmit={handleLogin}>
              <h3 className="s-WelcomeText">Welcome Back!</h3>
              <InputField
                type="text"
                id="empID"
                name="empID"
                editable={true}
                placeholder="Emp ID"
                borderRadius="10px"
                height="50px"
                width="100%"
                backBG="#F3F3F5"
                value={empID}
                onChange={handleEmpIdChange}
                boxShadow="0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(22, 168, 214, 0.7);"
                required
              >
                <FaRegUserCircle />
              </InputField>
              <InputField
                type={showPassword ? "text" : "password"}
                id="empPassword"
                name="empPassword"
                editable={true}
                placeholder="Password"
                borderRadius="10px"
                height="50px"
                width="100%"
                backBG="#F3F3F5"
                boxShadow="0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(22, 168, 214, 0.7);"
                value={password}
                onChange={handlePasswordChange}
                required
              >
                {showPassword ? (
                  <FaRegEye
                    onClick={toggleShowPassword}
                    style={{ cursor: "pointer" }}
                  />
                ) : (
                  <FaEyeSlash
                    onClick={toggleShowPassword}
                    style={{ cursor: "pointer" }}
                  />
                )}
              </InputField>
              {error && <p className="login-error">{error}</p>}
              {subLoading ?
                <SubSpinner loading={subLoading} spinnerText="Verifying" />
                :
                <Buttons
                  type="submit"
                  id="signin-btn"
                  className="signin-btn" 
                  style={{ backgroundColor: "#23A3DA", color: "white" }}
                  btnHeight="50px"
                  btnWidth="410px"
                  fontSize="18px"
                  marginTop="2px"
                >
                  Sign In <HiArrowRight style={{marginBottom:"-2px"}}/>
                </Buttons>
            
              }

              <Link to="/login/fp" className="forgotPWtxt">Forgot Password?</Link>
            </form>
          </div>
        </div>
      </div>
      {loggingSuccess && (
        <CustomAlert
          onClose={() => window.location.href = "/sales"}
          severity="success"
          title="Logging Successfully"
          message="Welcome to the FlexFlow - GreenLeaf"
          duration={1500}
        />
      )}
    </>
  );
};

export default Login;
