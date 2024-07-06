import React from 'react';
import './ConfirmationModal.css';
import Buttons from '../../Buttons/SquareButtons/Buttons';

const ConfirmationModal = ({ open, onClose, onConfirm, topContentBgColor, bodyContent, yesBtnBgColor }) => {
    if (!open) return null;

    return (
        <div className="confirmation-modal-overlay">
            <div className="confirmation-modal">
                <div className="confirmation-modal-Topcontent" style={{ backgroundColor: topContentBgColor }}>
                    <h4 className='confirmation-modal-Topcontent-txt'>Confirmation</h4>
                </div>
                <div className="confirmation-modal-Bodycontent">
                    <p className='confirmation-modal-Bodycontent-txt'>{bodyContent}</p>
                    <div className="confirmation-modal-buttons">
                        <Buttons type="submit" id="no-btn" style={{ backgroundColor: "rgb(250, 250, 250)", color: "black" }} onClick={onClose}> No </Buttons>
                        <Buttons type="submit" id="yes-btn" style={{ backgroundColor: yesBtnBgColor, color: "white" }} onClick={onConfirm}> Yes </Buttons>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
