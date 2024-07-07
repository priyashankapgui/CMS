import React, { useState } from 'react';
import SubPopup from './SubPopup';
import Buttons from '../Buttons/SquareButtons/Buttons';


function ConfirmationPopup({ title, message, onConfirm, onCancel }) {
    const [open, setOpen] = useState(true);

    const handleConfirm = async () => {
        setOpen(false);
        await onConfirm(); 
    };

    const handleCancel = () => {
        setOpen(false);
        onCancel(); 
    };

    return (
        <SubPopup
            show={open}
            triggerComponent={null}
            headBG="#EB1313"
            title={title || "Confirmation"}
            headTextColor="White"
            closeIconColor="white"
            bodyContent={(
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <p>{message || "Are you sure?"}</p>
                    <div style={{ marginTop: '10px' }}>
                        <Buttons type="button" id="yes-btn" style={{ backgroundColor: "#EB1313", color: "white", marginLeft: '10px' }} onClick={handleConfirm}> Yes </Buttons>
                        <Buttons type="button" id="no-btn" style={{ backgroundColor: "white", color: "black", marginLeft: '10px' }} onClick={handleCancel}> No </Buttons>
                    </div>
                </div>
            )}
        />
    );
}

export default ConfirmationPopup;
