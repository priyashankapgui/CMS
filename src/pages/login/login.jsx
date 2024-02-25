import React, { useState, useEffect } from "react";
import "./login.css";
import { Link } from "react-router-dom";
import { FaRegUserCircle } from "react-icons/fa";
import { FaKey } from "react-icons/fa";
import cmslogo from "../../Assets/cmslogo.svg";
import greenmart from "../../Assets/greenmart.svg";

const Login = () => {

  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    // Retrieve employee ID and password from sessionStorage
    const storedEmployeeId = sessionStorage.getItem("employeeId");
    const storedPassword = sessionStorage.getItem("password");
    if (storedEmployeeId) {
      setEmployeeId(storedEmployeeId);
    }
    if (storedPassword) {
      setPassword(storedPassword);
    }
  }, []); // Run only once on component mount

  const handleEmployeeIdChange = (e) => {
     setEmployeeId(e.target.value);
    
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Employee ID: ", employeeId);
    console.log("Password: ", password);

    sessionStorage.removeItem('employeeId');
    sessionStorage.removeItem('password');
    // // Store employee ID and password in sessionStorage
    sessionStorage.setItem("employeeId", employeeId);
    sessionStorage.setItem("password", password);

    // Clear the input fields
    setEmployeeId("");
    setPassword("")

    // window.location.reload();
  };
  
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

          <form className="s-form" onSubmit={handleSubmit}>
            <div className="s-inputField">
              <input
                className="s-inputF"
                type="text"
                placeholder="Employee ID"
                value={employeeId}
                onChange={handleEmployeeIdChange}
                required
              />
              <FaRegUserCircle />
            </div>
            <div className="s-inputField">
              <input
                className="s-inputF"
                type="password"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                required
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