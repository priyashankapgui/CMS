import React, { useState, useEffect } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import './Spinner.css';


const Spinner = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false); // Stop the spinner after 2 seconds
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="sweet-loading" style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "80vh", }}>
            <div className="SpinnerSystemText">
                Flex Flow
            </div>
            <BeatLoader
                color="#0377A8"
                loading={loading}
                size={15}
                css={{ margin: "auto" }}
                aria-label="Loading Spinner"
                data-testid="loader"
            />
        </div>
    );
};

export default Spinner;
