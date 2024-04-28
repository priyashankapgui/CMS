import React from "react";
import "./Auth-Notification.css";


export const UnAuthorized = () =>{
    const goBack = () => {
        window.history.back();
    }

    return (
        <div className="unauthorized-container">
            <div className="unauthorized-frame">
                <h1 className="unauthorized-title">UnAuthorized to access this page</h1>
                <button className="unauthorized-button" onClick={goBack}>
                Go Back
                </button>
            </div>
         </div>
    )

}

