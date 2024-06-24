import React from "react";
import { IoWarning } from "react-icons/io5";
import "./Auth-Notification.css";
import Buttons from "../Buttons/SquareButtons/Buttons";
import secureLocalStorage from "react-secure-storage";
import { useNavigate } from "react-router-dom";

const ErrorNotification = ({errorType}) => {
    const navigate = useNavigate();
    console.log(errorType);
    let notificationContent;

    switch (errorType) {
        case 'expiredToken':
            notificationContent = (
                <>
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
                            marginTop="1.625em"
                            onClick={() => {
                                secureLocalStorage.removeItem('accessToken');
                                secureLocalStorage.removeItem('user');
                                navigate('/');
                            }}
                        >
                            Back To Login
                        </Buttons>
                    </div>
                </>
            );
            break;
        case 'serverError':
            notificationContent = (
                <>
                    <div className="unauthorized-container">
                        <IoWarning className="warning-icon" />
                        <div className="unauthorized-frame">
                            <h2 className="unauthorized-title">
                                Server not responding. Please try again later.
                            </h2>
                        </div>
                        <Buttons
                            style={{ backgroundColor: "#EEEEEE", color: "red" }}
                            btnWidth={150}
                            marginTop="1.625em"
                            onClick={() => {
                                navigate(0);
                            }}
                        >
                            Retry
                        </Buttons>
                    </div>
                </>
            );
            break;
        default:
            notificationContent = (
                <>
                    <div className="unauthorized-container">
                        <IoWarning className="warning-icon" />
                        <div className="unauthorized-frame">
                            <h2 className="unauthorized-title">
                                Unknown error occurred.
                            </h2>
                        </div>
                    </div>
                </>
            );
            break;
    }
    console.log(notificationContent);
    return <>{notificationContent}</>;
}

export default ErrorNotification;
