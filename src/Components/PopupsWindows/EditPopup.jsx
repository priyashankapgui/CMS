import React, { useState } from 'react';
import { Icon } from "@iconify/react";
import SubPopup from './SubPopup';
import Buttons from '../Buttons/SquareButtons/Buttons';
import SubSpinner from '../Spinner/SubSpinner/SubSpinner';


function EditPopup({ topTitle, children, buttonId, buttonText, onClick }) {
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = React.useState(false);

  const onClickWithLoading = async () => {
    setLoading(true);
    await onClick();
    setLoading(false);
};

  return (
    <div style={{ width: '' }}>
      <SubPopup
        triggerComponent={
          <Icon
            icon="bitcoin-icons:edit-outline"
            style={{ fontSize: '24px', color: isHovered ? '#8D9093' : 'black' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          />
        }
        headBG="#23A3DA"
        title={topTitle}
        headTextColor="White"
        closeIconColor="white"
        bodyContent={(
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {children}
            {loading ? <SubSpinner /> :
              <Buttons type="submit" id={buttonId} style={{ backgroundColor: "#23A3DA", color: "white" }} btnWidth="22em" btnHeight="2.5em" onClick={onClickWithLoading}>{buttonText}</Buttons>
            }
          </div>
        )}
      />
    </div>
  );
}

export default EditPopup;