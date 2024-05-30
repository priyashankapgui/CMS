import React, { useState, useEffect } from "react";
import { IoWarning } from "react-icons/io5"; 
import "./Auth-Notification.css";

const UnauthorizedNotification = () => {
    const [redirectCountdown, setRedirectCountdown] = useState(4); // Initial countdown value in seconds

    const goBack = () => {
        window.history.back();
    }

    // useEffect(() => {
    //     const redirectTimer = setTimeout(() => {
    //         goBack();
    //     }, redirectCountdown * 1000);

    //     const countdownInterval = setInterval(() => {
    //         setRedirectCountdown(prevCountdown => prevCountdown - 1);
    //     }, 1000);

    //     return () => {
    //         clearTimeout(redirectTimer);
    //         clearInterval(countdownInterval);
    //     };
    // }, [redirectCountdown]);

    return (
        <>
            <div className="unauthorized-container">
                <h2 className="flexflow-sys-name">Flex Flow</h2>
                <IoWarning className="warning-icon" />
                <div className="unauthorized-frame">
                    <h2 className="unauthorized-title">
                        Access Denied: You lack the necessary permissions to view this content.
                    </h2>
                    <h4>Redirecting to the previous page {redirectCountdown} seconds...</h4>
                    <button className="unauthorized-button" onClick={goBack}>
                        Go Back Now
                    </button>
                </div>
            </div>
        </>
    );
}

export default UnauthorizedNotification;
