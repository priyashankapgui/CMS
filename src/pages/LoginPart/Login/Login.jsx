import React, { useState } from "react";
import "./Login.css";
import { Link } from "react-router-dom";
import { FaRegEye, FaRegUserCircle, FaEyeSlash, FaArrowRight } from "react-icons/fa";
import cmslogo from "../../../Assets/cmslogo.svg";
import greenleaf from "../../../Assets/greenleaf.svg";
import InputField from "../../../Components/InputField/InputField";
import Buttons from "../../../Components/Buttons/SquareButtons/Buttons";

const Login = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="s-mainContainer">
      <div className="s-leftcontainer">
        <img className="s-image" src={cmslogo} alt="cms logo" />
        <h2 className="s-flexflow-text">Flex Flow</h2>

        <div className="s-companyName">
          <p>Hexacode Solutions Pvt Ltd</p>
        </div>
      </div>

      <div className="s-rightcontainer">
        <div className="s-greenmartlogo">
          <img className="s-image" src={greenleaf} alt="greenmart logo" />
          <h2 className="s-boldText">Green Leaf Super Mart </h2>
        </div>

        <div className="s-loginCard">
          <form className="s-form">
            <h3 className="s-WelcomeText">Welcome Back!</h3>
            <InputField
              type="text"
              id="empID"
              name="empID"
              editable={true}
              placeholder="Emp ID"
              borderRadius="20px"
              height="40px"
              width="416px"
              backBG="#F3F3F5"
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
              borderRadius="20px"
              height="40px"
              width="416px"
              backBG="#F3F3F5"
              boxShadow="0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(22, 168, 214, 0.7);"
              value={password}
              onChange={handlePasswordChange}
              required
            >
              {showPassword ? <FaEyeSlash onClick={toggleShowPassword} style={{ cursor: "pointer" }} /> : <FaRegEye onClick={toggleShowPassword} style={{ cursor: "pointer" }} />}
            </InputField>
            <Buttons
              type="submit"
              id="signin-btn"
              style={{ backgroundColor: "#23A3DA", color: "white" }}
              btnHeight="2.2em"
              btnWidth="8em"
            >
              Sign In <FaArrowRight />
            </Buttons>

            <Link to="/login/fp">Forgot Password?</Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
