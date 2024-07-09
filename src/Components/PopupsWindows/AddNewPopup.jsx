import React, { useEffect } from 'react';
import SubPopup from './SubPopup';
import Buttons from '../Buttons/SquareButtons/Buttons';
import SubSpinner from '../Spinner/SubSpinner/SubSpinner';

function AddNewPopup({ topTitle, children, buttonId, buttonText, onClick, closeSubpopup, forceClose }) {
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const onClickWithLoading = async () => {
        setLoading(true);
        await onClick();
        setLoading(false);
    };

    const handleClose = () => {
        setOpen(false);
        if (closeSubpopup) {
            closeSubpopup();
        }
    };

    useEffect(() => {
        if (forceClose) {
            setOpen(false);
        }
    }, [forceClose]);

    const handleOpen = () => {
        setOpen(true);
    };

    return (
        <SubPopup
            show={open}
            triggerComponent={
                <Buttons type="button" id="new-btn" style={{ backgroundColor: "white", color: "#23A3DA" }} margintop="0" onClick={handleOpen}>
                    New +
                </Buttons>
            }
            headBG="#23A3DA"
            title={topTitle}
            headTextColor="White"
            closeIconColor="white"
            bodyContent={(
                <>
                    {children}
                    {loading ? (
                        <SubSpinner spinnerText='Saving'/>
                    ) : (
                        <Buttons
                            type="submit"
                            id={buttonId}
                            style={{ backgroundColor: "#23A3DA", color: "white" }}
                            btnWidth="100%"
                            btnHeight="2.5em"
                            onClick={onClickWithLoading}
                        >
                            {buttonText}
                        </Buttons>
                    )}
                </>
            )}
            onClose={handleClose}
        />
    );
}

export default AddNewPopup;
