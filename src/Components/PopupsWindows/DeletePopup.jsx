import React, { useState } from 'react';
import { Icon } from "@iconify/react";
import SubPopup from './SubPopup';
import Buttons from '../Buttons/SquareButtons/Buttons';

function DeletePopup({ handleDelete }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <SubPopup
        triggerComponent={
          <Icon
            icon="material-symbols-light:delete-outline"
            style={{ fontSize: '24px', color: isHovered ? '#EB1313' : 'black' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          />
        }
        headBG="#EB1313"
        title="Delete"
        headTextColor="White"
        closeIconColor="white"
        bodyContent={(
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <p>Do you really want to delete this one?</p> <br />
            {/* Pass the handleDelete function to the Buttons component */}
            <Buttons type="submit" id="yes-btn" style={{ backgroundColor: "#EB1313", color: "white" }} onClick={handleDelete}> Yes </Buttons>
          </div>
        )}
      />
    </>
  );
}

export default DeletePopup;