import React, { useState } from 'react';
import SubPopup from './SubPopup';
import Buttons from '../Buttons/SquareButtons/Buttons';
import RoundButtons from '../Buttons/RoundButtons/RoundButtons';
import { BiMessageSquareEdit } from "react-icons/bi";

function AdjustPopup({ topTitle, children, buttonId, buttonText, onClick }) {
    const [open, setOpen] = useState(false); 

    function handleButtonClick() {
        onClick();
        setOpen(false);
    }

    return (
        <SubPopup
            show={open}
            triggerComponent={
                <RoundButtons
                    id="summary-btn"
                    name="summary-btn"
                    type="button" 
                    icon={<BiMessageSquareEdit style={{ fontSize: '15px' }} />}
                    onClick={() => setOpen(!open)}
                />
            }
            headBG="#23A3DA"
            title={topTitle}
            headTextColor="White"
            closeIconColor="white"
            bodyContent={(
                <>
                    {children}
                    <Buttons
                        type="submit" 
                        id={buttonId}
                        style={{ backgroundColor: "#23A3DA", color: "white" }}
                        onClick={handleButtonClick}
                    >
                        {buttonText}
                    </Buttons>
                </>
            )}
        />
    );
}

export default AdjustPopup;
