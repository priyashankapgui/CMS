import React, { useState, useEffect } from "react";
import "./Login.css";
import { Link } from "react-router-dom";
import {
  FaRegEye,
  FaRegUserCircle,
  FaEyeSlash,
  FaArrowRight,
} from "react-icons/fa";
import cmslogo from "../../../Assets/cmslogo.svg";
import greenleaf from "../../../Assets/greenleaf.svg";
import InputField from "../../../Components/InputField/InputField";
import Buttons from "../../../Components/Buttons/SquareButtons/Buttons";
import Spinner from "../../../Components/Spinner/Spinner";

const Login = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [empID, setEmpId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true); // State for showing spinner

  useEffect(() => {
    // Simulating loading delay
    const timer = setTimeout(() => {
      setLoading(false); // Hide spinner after some time
    }, 2000); // Adjust this time as needed

    return () => clearTimeout(timer);
  }, []);

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

    const response = await fetch("http://localhost:8080/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        employeeId: empID,
        password: password,
      }),
    }).catch((error) => console.error("Error:", error));

    if (response.ok) {
      const data = await response.json();
      console.log("Response data:", data);

      // Store the token in local storage
      sessionStorage.setItem("accessToken", data.token);
      sessionStorage.setItem("user", JSON.stringify(data.user));

      console.log(sessionStorage.getItem("accessToken"));
      window.location.href = "/sales";
    } else {
      // Login failed, handle error
      const data = await response.json();
      console.log("Error:", data.message);
      setError(data.message);
    }
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
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
              <img
                className="s-image"
                src={greenleaf}
                alt="greenmart logo"
              />
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
                  borderRadius="20px"
                  height="40px"
                  width="416px"
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
                  borderRadius="20px"
                  height="40px"
                  width="416px"
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

                <Buttons
                  type="submit"
                  id="signin-btn"
                  style={{ backgroundColor: "#23A3DA", color: "white" }}
                  btnHeight="2.2em"
                  btnWidth="7em"
                >
                  Sign In <FaArrowRight />
                </Buttons>

                <Link to="/login/fp">Forgot Password?</Link>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
