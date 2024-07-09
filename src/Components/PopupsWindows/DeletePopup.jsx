import React, { useState } from 'react';
import { Icon } from "@iconify/react";
import SubPopup from './SubPopup';
import Buttons from '../Buttons/SquareButtons/Buttons';

function DeletePopup({ handleDelete }) {
  const [isHovered, setIsHovered] = useState(false);
  const [open, setOpen] = useState(undefined);


  async function DeleteAndClose() {
    setOpen(undefined)

    await handleDelete();
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
        title="Delete"
        headTextColor="White"
        closeIconColor="white"
        bodyContent={(
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <p>Do you really want to delete this one?</p> <br />
            <Buttons type="submit" id="yes-btn" style={{ backgroundColor: "#EB1313", color: "white" }} onClick={DeleteAndClose}> Yes </Buttons>
          </div>
        )}
      />
    </>
  );
}

export default DeletePopup;