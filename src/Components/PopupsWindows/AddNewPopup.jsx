import React from 'react';
// import { Icon } from "@iconify/react";
import SubPopup from './SubPopup';
import Buttons from '../Buttons/Buttons';

function AddNewPopup({ topTitle, children, buttonId, buttonText, onClick }) {
  

    return (
        <div style={{ width: 'fit-content' }}>
            <SubPopup
                triggerComponent={
                    <Buttons type="submit" id="new-btn" style={{ backgroundColor: "white", color: "#23A3DA" }} margintop="0" > New + </Buttons>

                }
                headBG="#23A3DA"
                title={topTitle}
                headTextColor="White"
                closeIconColor="white"
                bodyContent={(
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {children}
                        <Buttons type="submit" id={buttonId} style={{ backgroundColor: "#23A3DA", color: "white" }} onClick={onClick}>{buttonText}</Buttons>
                    </div>
                )}
            />
        </div>
    );
}

export default AddNewPopup;
