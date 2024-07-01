import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import SubPopup from "../../PopupsWindows/SubPopup";
import Buttons from "../../Buttons/SquareButtons/Buttons";
import "./MyAccountDetails.css";
import secureLocalStorage from "react-secure-storage";
import MyAccountDetailsMain from "./MyAccountDetailsMain";
import MyAccountDetailsPassword from "./MyAccountDetailsPassword";

function MyAccountDetails() {
  const [editable, setEditable] = useState(false);
  const [profilePicExists, setProfilePicExists] = useState(true);
  const [viewPassword, setViewPassword] = useState(false);
  let user = JSON.parse(secureLocalStorage.getItem("user"));

  const toggleEditable = () => {
    console.log("toggleEditable");
    setEditable(!editable);
  };

  const toggleViewPassword = () => {
    setViewPassword(!viewPassword);
  };

  return (
    <div>
      <SubPopup
        triggerComponent={
          <div className="userProfile">
            <div className="profile-dp">
              <img
                className="preview-image"
                src={`https://flexflowstorage01.blob.core.windows.net/cms-data/${user.userID}.png`}
                color="black"
                alt="Profile"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `${process.env.PUBLIC_URL}/Images/account_circle.svg`;
                  setProfilePicExists(false);
                }}
              />
            </div>
            <div className="userName">
              <h4>{user.userName || user.employeeName}</h4>
            </div>
          </div>
        }
        popupPositionLeft="0%"
        popupPositionTop="0%"
        justifyContent="flex-end"
        headBG="none"
        title={
          <>
            <div className="popupProfileTxt">
              My Profile{" "}
              <div className={editable?"editPopIcon editPopIcon-clicked" : "editPopIcon"}>
                <Icon
                  icon="fluent:person-edit-48-regular"
                  style={{ fontSize: "1em", cursor: "pointer", alignContent: "center", justifyContent: "center"}}
                  onClick={toggleEditable}
                />
              </div>
            </div>
          </>
        }
        headTextColor="black"
        closeIconColor="red"
        bodyContent={
          <div >
            {viewPassword ? null : (
              <>
                <MyAccountDetailsMain editable={editable} profilePicExists={profilePicExists} toggleEditable={toggleEditable}/>
                {!editable && 
                <Buttons
                  id="change-view-btn"
                  btnWidth="fit-content"
                  marginTop={"20px"}
                  fontSize={"14px"}
                  style={{ backgroundColor: "white", color:"#0377A8"}}
                  onClick={toggleViewPassword}
                >
                  Change Your Password?
                </Buttons>
                }
              </>
            )}
            {viewPassword && <MyAccountDetailsPassword toggleViewPassword={toggleViewPassword}/>}
          </div>
        }
      />
    </div>
  );
}

export default MyAccountDetails;
