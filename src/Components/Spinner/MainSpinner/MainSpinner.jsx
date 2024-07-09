import React from "react";
import BeatLoader from "react-spinners/BeatLoader";
import './MainSpinner.css';

const MainSpinner = ({ loading }) => {

    return (
        <div className="sweet-loading-Main">
            <div className="SpinnerSystemTextMain">
                Flex Flow
            </div>
            <BeatLoader
                color="#0377A8"
                loading={loading}
                size={15}
                css={{ margin: "auto" }}
                aria-label="Loading Main Spinner"
                data-testid="loader"
            />
        </div>
    );
};

export default MainSpinner;
