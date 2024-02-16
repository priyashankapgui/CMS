import React from "react";
import "./login.css";
import { Link } from "react-router-dom";

import { FaRegUserCircle } from "react-icons/fa";
import { FaKey } from "react-icons/fa";
import cmslogo from "../assets/cmslogo.svg";
import greenmart from "../assets/greenmart.svg";

const Login = () => {
  return (
    <div className="s-mainContainer">
      <div className="s-leftcontainer">
        <img className="s-image" src={cmslogo} alt="cms logo" />
        <h1 className="s-flexflow-text">Flex Flow</h1>
      </div>

      <div className="s-rightcontainer">
        <div className="s-greenmartlogo">
          <img className="s-image" src={greenmart} alt="greenmart logo" />
          <h1 className="s-boldText">Green Leaf Super Mart </h1>
        </div>

        <div className="s-loginCard">
          <div className="s-welcomeText">
            <h1 className="s-boldText">Welcome Back!</h1>
          </div>

          <form className="s-form">
            <div className="s-inputField">
              <input
                className="s-inputF"
                type="text"
                placeholder="Employee ID"
              />
              <FaRegUserCircle />
            </div>
            <div className="s-inputField">
              <input
                className="s-inputF"
                type="password"
                placeholder="Password"
              />
              <FaKey />
            </div>

            <button className="s-button">Login</button>

            <Link to="/login/fp">Forgot Password?</Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
