import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { SidebarData } from "./SidebarData";
import SubMenu from "./SubMenu";
import MyAccountDetails from "../PopupsWindows/MyAccountDetails";
import LogoutPopup from "../PopupsWindows/LogoutPopup";
import TopNav from "../TopNavDrawer/TopNav";
import "./Sidebar.css";

const Sidebar = () => {
  const [sidebar, setSidebar] = useState(true);
  const [logoutPopupOpen, setLogoutPopupOpen] = useState(false);
  const [MyAccountDetailsOpen, setMyAccountDetailsOpen] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);
  const openLogoutPopup = () => setLogoutPopupOpen(true);
  const closeLogoutPopup = () => setLogoutPopupOpen(false);
  const openMyAccountDetails = () => setMyAccountDetailsOpen(true);
  const closeMyAccountDetails = () => setMyAccountDetailsOpen(false);

  return (
    <>
      <TopNav
        showSidebar={showSidebar}
        openMyAccountDetails={openMyAccountDetails}
        openLogoutPopup={openLogoutPopup}
      />
      <div className={`sidebar-nav ${sidebar ? "show" : ""}`}>
        <div className="sidebar-wrap">
          <div className="side-top">
            <div className="collapse-side-icon2" onClick={showSidebar}>
              <Icon icon="bi:menu-app" style={{ fontSize: "22px" }} />
            </div>
            <h3 className="SystemName-2">Flex Flow</h3>
          </div>
          <div className="side-middle-content">
            {SidebarData.map((item, index) => (
              <SubMenu item={item} key={index} />
            ))}
          </div>
        </div>
      </div>
      <MyAccountDetails open={MyAccountDetailsOpen} onClose={closeMyAccountDetails} />
      <LogoutPopup open={logoutPopupOpen} onClose={closeLogoutPopup} />

    </>
  );
};

export default Sidebar;
