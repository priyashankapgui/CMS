import React from 'react';
import SubPopup from './SubPopup';
import Buttons from '../Buttons/SquareButtons/Buttons';
import SubSpinner from '../Spinner/SubSpinner/SubSpinner';

function AddNewPopup({ topTitle, children, buttonId, buttonText, onClick }) {
    const [open, setOpen] = React.useState(undefined);
    const [loading, setLoading] = React.useState(false);

    const onClickWithLoading = async () => {
        setLoading(true);
        await onClick();
        setLoading(false);
    };
    
    return (
        <SubPopup
            // show={open}
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
                    {loading ? <SubSpinner /> :
                    <Buttons type="submit" id={buttonId} style={{ backgroundColor: "#23A3DA", color: "white", }} btnWidth="30%" btnHeight="2.5em" onClick={onClickWithLoading}>{buttonText}</Buttons>
                    }
                </>
            )}
        />
    );
}

export default AddNewPopup;