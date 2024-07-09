import React, { useState } from 'react';
import SubPopup from './SubPopup';
import RoundButtons from '../Buttons/RoundButtons/RoundButtons';
import { IoReorderThreeOutline } from "react-icons/io5";

function SummaryPopup({ topTitle, children }) {
    const [open, setOpen] = useState(false); 

    return (
        <SubPopup
            show={open}
            triggerComponent={
                <RoundButtons
                    id="summary-btn"
                    name="summary-btn"
                    type="button" 
                    onClick={() => setOpen(!open)}
                    icon={<IoReorderThreeOutline style={{ fontSize: '18px' }} />}
                />
            }
            headBG="#23A3DA"
            title={topTitle}
            headTextColor="White"
            closeIconColor="white"
            bodyContent={children}
        />
    );
}

export default SummaryPopup;
