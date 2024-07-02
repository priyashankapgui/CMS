import React from 'react';
import './ConfirmationModal.css';
import Buttons from '../Components/Buttons/SquareButtons/Buttons';

const ConfirmationModal = ({ open, onClose, onConfirm }) => {
    if (!open) return null;

    return (
        <div className="confirmation-modal-overlay">
            <div className="confirmation-modal">
                <div className="confirmation-modal-Topcontent">
                    <h4>Confirm Cancellation?</h4>
                </div>
                <div className="confirmation-modal-Bodycontent">
                    <p>Are you sure you want to cancel this bill?</p>
                    <div className="confirmation-modal-buttons">
                        <Buttons type="submit" id="no-btn" style={{ backgroundColor: "rgb(250, 250, 250)", color: "black" }} onClick={onClose}> No </Buttons>
                        <Buttons type="submit" id="yes-btn" style={{ backgroundColor: "#EB1313", color: "white" }} onClick={onConfirm}> Yes </Buttons>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;