import React from 'react';
import Modal from '@mui/material/Modal';
import "./popupLogin.css";

const PopupLoginModal = ({ open, onClose, text, buttonText, icon}) => {



  return (
    <div> 
      {/* <Modal className="popupModal" open={open} onClose={onClose}>
        <div className='s_popup'>
          <p>Your password has been sent to your email</p>
          <button onClick={onClose} >Close</button>
        </div>
      </Modal> */}

      <Modal className="popupModal" open={open} onClose={onClose}>
        <div className='s_popup'>
          <div className='s_icon'>{icon}</div>
          <p>{text}</p>
          <button onClick={onClose} >{buttonText}</button>
        </div>
      </Modal>
    </div>
  );
};

export default PopupLoginModal;
