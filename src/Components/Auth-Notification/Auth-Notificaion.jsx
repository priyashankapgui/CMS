import React from "react";
import { IoWarning } from "react-icons/io5"; 
import "./Auth-Notification.css";

const UnauthorizedNotification = () => {
    const goBack = () => {
        window.history.back();
    }

    return (
        <>
            <div className="unauthorized-container">
                <h2 className="flexflow-sys-name">Flex Flow</h2>
                <IoWarning className="warning-icon" />
                <div className="unauthorized-frame">
                    <h2 className="unauthorized-title">
                        Access Denied: You lack the necessary permissions to view this content.
                    </h2>
                    <button className="unauthorized-button" onClick={goBack}>
                        Go Back
                    </button>

                </div>
            </div>
        </>
    );
}

export default UnauthorizedNotification;
