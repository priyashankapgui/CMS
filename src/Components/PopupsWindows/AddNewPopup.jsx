import React from 'react';
import SubPopup from './SubPopup';
import Buttons from '../Buttons/SquareButtons/Buttons';

function AddNewPopup({ topTitle, children, buttonId, buttonText, onClick }) {
    const [open, setOpen] = React.useState(undefined);

    async function CreateAndClose() {
        console.log('CreateAndClose');
        try{
            await onClick();
            setOpen(false);
        }
        catch(error){
            console.log('Error in onClick');
        }
    }
    return (
        <SubPopup
            show={open}
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
                    <Buttons type="submit" id={buttonId} style={{ backgroundColor: "#23A3DA", color: "white", }} btnWidth="22em" btnHeight="2.5em" onClick={CreateAndClose}>{buttonText}</Buttons>
                </>
            )}
        />
    );
}

export default AddNewPopup;