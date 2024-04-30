import React, { useState, useEffect } from "react";
import RingLoader from "react-spinners/RingLoader";

const Spinner = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate starting the loader automatically after some time (e.g., 2 seconds)
        const timer = setTimeout(() => {
            setLoading(false); // Stop the spinner after 2 seconds
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="sweet-loading" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
            <RingLoader
                color="#0377A8"
                loading={loading}
                size={170}
                aria-label="Loading Spinner"
                data-testid="loader"
            />
        </div>
    );
};

export default Spinner;
