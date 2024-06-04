import React from 'react';
import SubPopup from './SubPopup';
import Buttons from '../Buttons/SquareButtons/Buttons';

function AddNewPopup({ topTitle, children, buttonId, buttonText, onClick }) {
    const [open, setOpen] = React.useState(undefined);

    function CreateAndClose() {
        console.log('CreateAndClose');
        onClick();
        console.log('onClick safely called');
        setOpen(false);
        console.log('setOpen set to false');
    }
    return (
        <SubPopup
            open={open}
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
                    <Buttons type="submit" id={buttonId} style={{ backgroundColor: "#23A3DA", color: "white" }} onClick={CreateAndClose}>{buttonText}</Buttons>
                </>
            )}
        />
    );
}

export default AddNewPopup;