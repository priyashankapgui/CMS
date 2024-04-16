import React, { useState } from 'react';
import { Icon } from "@iconify/react";
import SubPopup from '../../../Components/PopupsWindows/SubPopup';
import Buttons from '../../../Components/Buttons/Buttons';
import axios from 'axios';

function DeletePopup({ branchId, onDelete }) {
  const [isHovered, setIsHovered] = useState(false);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/branches/${branchId}`);
      onDelete();
    } catch (error) {
      console.error("Error deleting branch:", error.response ? error.response.data.error : error.message);
    }
  };

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
            <p>Do you really want to delete this one?</p> <br/>
            <Buttons type="submit" id="yes-btn" style={{ backgroundColor: "#EB1313", color: "white" }} onClick={handleDelete}> Yes </Buttons>
          </div>
        )}
      />
    </>
  );
}

export default DeletePopup;