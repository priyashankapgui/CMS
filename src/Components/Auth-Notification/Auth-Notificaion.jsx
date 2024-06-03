import React from "react";
import { IoWarning } from "react-icons/io5";
import "./Auth-Notification.css";
import Layout from "../../Layout/Layout";

const UnauthorizedNotification = () => {

    return (
        <Layout>
            <div className="unauthorized-container">
                <IoWarning className="warning-icon" />
                <div className="unauthorized-frame">
                    <h2 className="unauthorized-title">
                        Access Denied: You lack the necessary permissions to view this content.
                    </h2>
                </div>
            </div>
        </Layout>
    );
}

export default UnauthorizedNotification;
