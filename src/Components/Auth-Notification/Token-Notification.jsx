import React from "react";
import { IoWarning } from "react-icons/io5";
import "./Auth-Notification.css";
import Buttons from "../Buttons/SquareButtons/Buttons";
import secureLocalStorage from "react-secure-storage";

const TokenNotification = () => {

    return (
        <div className="unauthorized-container">
            <IoWarning className="warning-icon" />
            <div className="unauthorized-frame">
                <h2 className="unauthorized-title">
                    Your token has expired or you are logged in from another device.
                </h2>
            </div>
            <Buttons
                style={{ backgroundColor: "#EEEEEE", color: "red" }}
                btnWidth={150}
                onClick={() => {
                    secureLocalStorage.removeItem('accessToken');
                    secureLocalStorage.removeItem('user');  
                    window.location.href = '/';
                }}
              >
                Back To Login
              </Buttons>
        </div>
    );
}

export default TokenNotification;
