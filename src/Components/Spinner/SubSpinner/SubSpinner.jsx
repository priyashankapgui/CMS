import React from "react";
import PropagateLoader from "react-spinners/PropagateLoader";
import './SubSpinner.css';

const SubSpinner = ({ loading, spinnerText = 'Loading' }) => {
    return (
        <div className="sweet-loading-sub">
            <div className="SubSpinnerSystemText">
                {spinnerText}
            </div>
            <PropagateLoader
                color="#0377A8"
                loading={loading}
                size={8}
                css={{ margin: "auto" }}
                aria-label="Loading Sub Spinner"
                data-testid="loader"
            />
        </div>
    );
};

export default SubSpinner;
