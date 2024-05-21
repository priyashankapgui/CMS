import React from 'react';
import './ReceiptPopup.css';
import { IoReturnUpBack } from 'react-icons/io5';
import { FaPrint } from 'react-icons/fa';
import RoundButtons from '../../../Components/Buttons/RoundButtons/RoundButtons';

const ReceiptPopup = ({ onClose, onPrint, bodyContent }) => {
    return (
        <div className="popup-overlay">
            <div className="popup">
                <div className="popup-btn-sec">
                    <RoundButtons id="backBillBtn" type="submit" name="backBillBtn" backgroundColor="rgba(3, 119, 168, 0.3)" icon={<IoReturnUpBack />} onClick={onClose} />
                    <RoundButtons id="printBillBtn" type="submit" name="printBillBtn" backgroundColor="rgba(3, 119, 168, 0.3)" icon={<FaPrint />} onClick={onPrint} />
                </div>
                <div className="bodyContent">
                    {bodyContent}
                </div>
            </div>
        </div>
    );
};

export default ReceiptPopup;