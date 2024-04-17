import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import './TopNav.css';
import MyAccountDetails from '../MyAccountDetailsPopup/MyAccountDetails';
import LogoutPopup from '../LogoutPopup/LogoutPopup';

const TopNav = ({ showSidebar }) => {
  const [logoutPopupOpen, setLogoutPopupOpen] = useState(false);
  const [MyAccountDetailsOpen, setMyAccountDetailsOpen] = useState(false);

  const openLogoutPopup = () => setLogoutPopupOpen(true);
  const closeLogoutPopup = () => setLogoutPopupOpen(false);
  const closeMyAccountDetails = () => setMyAccountDetailsOpen(false);

  return (
    <div className="TopNav">
      <Link to="#" className="nav-icon" onClick={showSidebar}>
        <div className="collapse-side-icon1">
          <Icon icon="bi:menu-app" style={{ fontSize: '22px' }} />
        </div>
      </Link>
      <h3 className="SystemName-1">Flex Flow</h3>
      <div className="TopNav-right-container">
        <h4 className="ShopName">Green Leaf Super Mart</h4>
        <div className="TopNav-right-elements">
          <div className="QuickAccessBtn">
            <Link to="/Sales">
              <Icon icon="material-symbols:home-outline" style={{ fontSize: '22px' }} />
            </Link>
            <Link to="/notifications">
              <Icon icon="mingcute:notification-line" style={{ fontSize: '22px' }} />
            </Link>
            <Link to="/fullscreen">
              <Icon icon="material-symbols:fullscreen" style={{ fontSize: '21px' }} />
            </Link>
            <Link to="/new-tab">
              <Icon icon="icomoon-free:new-tab" style={{ fontSize: '21px' }} />
            </Link>
          </div>
          <div className="Profile">
            <MyAccountDetails open={MyAccountDetailsOpen} onClose={closeMyAccountDetails} />
          </div>
          <h4 className="ProfileName">Imesh Mendis</h4>
          <div className="logout-icon">
            <Link to="#" onClick={openLogoutPopup}>
              <Icon icon="icomoon-free:switch" style={{ fontSize: '19px', color: 'Red' }} />
            </Link>
          </div>
        </div>
      </div>
      <LogoutPopup open={logoutPopupOpen} onClose={closeLogoutPopup} />
    </div>
  );
};

export default TopNav;
