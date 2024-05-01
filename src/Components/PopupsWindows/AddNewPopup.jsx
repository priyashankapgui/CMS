import React from 'react';
import SubPopup from './SubPopup';
import Buttons from '../Buttons/SquareButtons/Buttons';

function AddNewPopup({ topTitle, children, buttonId, buttonText, onClick }) {

    return (
        <SubPopup
            triggerComponent={
                <Buttons type="submit" id="new-btn" style={{ backgroundColor: "white", color: "#23A3DA" }} margintop="0" > New + </Buttons>
            }
            headBG="#23A3DA"
            title={topTitle}
            headTextColor="White"
            closeIconColor="white"
            bodyContent={(
                <>
                    {children}
                    <Buttons type="submit" id={buttonId} style={{ backgroundColor: "#23A3DA", color: "white" }} onClick={onClick}>{buttonText}</Buttons>
                </>
            )}
        />
    );
}

export default AddNewPopup;