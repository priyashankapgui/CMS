// WebMgmt.jsx
import React, { useState } from 'react';
import Layout from "../../Layout/Layout";
import CustomAlert from '../../Components/Alerts/CustomAlert/CustomAlert';

export const WebMgmt = () => {
    const [alertOpen, setAlertOpen] = useState(false);

    // Function to handle button click and open the alert
    const handleButtonClick = () => {
        setAlertOpen(true);
    };

    return (
        <>
            <div className="top-nav-blue-text">
                <h4> WebMgmt</h4>
            </div>
            <Layout>
                <button onClick={handleButtonClick}>Show Alert</button>

                {/* Conditionally render the CustomAlert component based on alertOpen state */}
                {alertOpen && (
                    <CustomAlert
                        severity="info"
                        title="Bill generated successfully"
                        message="This is a success message"
                        duration={3000} // Specify the duration in milliseconds (e.g., 3000 for 3 seconds)
                    />
                )}
            </Layout>
        </>
    );
};
