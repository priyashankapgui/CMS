import React, { useState} from 'react';
import { Icon } from "@iconify/react";
import SubPopup from './SubPopup';
import Buttons from '../Buttons/SquareButtons/Buttons';

function ConfirmationPopup({ handleConfirm }) {
  const [isHovered, setIsHovered] = useState(false);
  const [open, setOpen] = useState(undefined);
  

  async function ConfirmAndClose() {
    setOpen(undefined)
    // Call the handleConfirm function passed as a prop
    await handleConfirm();
    // Close the popup
    setOpen(false);
    console.log("closed")
    
  }

  return (
    <>
      <SubPopup
        show={open}
        triggerComponent={
          <Icon
            icon="material-symbols-light:delete-outline"
            style={{ fontSize: '24px', color: isHovered ? '#EB1313' : 'black' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          />
        }
        headBG="#EB1313"
        title="Cancel"
        headTextColor="White"
        closeIconColor="white"
        bodyContent={(
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <p>Do you really want to cancel?</p> <br />
            {/* Pass the handleDelete function to the Buttons component */}
            <Buttons type="submit" id="yes-btn" style={{ backgroundColor: "#EB1313", color: "white" }} onClick={ConfirmAndClose}> Yes </Buttons>
          </div>
        )}
      />
    </>
  );
}

export default ConfirmationPopup;