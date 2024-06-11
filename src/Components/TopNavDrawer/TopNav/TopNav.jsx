import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import './TopNav.css';
import MyAccountDetails from '../MyAccountDetailsPopup/MyAccountDetails';
import LogoutPopup from '../LogoutPopup/LogoutPopup';

const TopNav = ({ showSidebar }) => {
  const [logoutPopupOpen, setLogoutPopupOpen] = useState(false);
  const [tooltipText, setTooltipText] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const currentUser = JSON.parse(sessionStorage.getItem('user'));

  const openLogoutPopup = () => setLogoutPopupOpen(true);
  const closeLogoutPopup = () => setLogoutPopupOpen(false);


  function requestFullScreen() {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    }
    else if (element.mozRequestFullScreen) { /* Firefox */
      element.mozRequestFullScreen();
    }
    else if (element.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) { /* IE/Edge */
      element.msRequestFullscreen();
    }
  }

  function openNewTab() {
    window.open(window.location.href, '_blank');
  }

  const handleMouseEnter = (text, event) => {
    setTooltipText(text);
    setTooltipPosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseLeave = () => {
    setTooltipText('');
  };

  return (
    <div className="TopNav">
      <Link to="#" className="nav-icon" onClick={showSidebar}>
        <div className="collapse-side-icon1">
          <Icon
            icon="bi:menu-app"
            style={{ fontSize: '22px' }}
            onMouseEnter={(event) => handleMouseEnter('Menu', event)}
            onMouseLeave={handleMouseLeave}
          />
        </div>
      </Link>
      <h3 className="SystemName-1">Flex Flow</h3>
      <div className="TopNav-right-container">
        <h4 className="ShopName">Green Leaf Super Mart {currentUser.branchName ? `- ${currentUser.branchName}` : null}</h4>
        <div className="TopNav-right-elements">
          <div className="QuickAccessBtn">
            <Link to="/Sales">
              <Icon
                icon="material-symbols:home-outline"
                style={{ fontSize: '22px', color: 'black' }}
                onMouseEnter={(event) => handleMouseEnter('Home', event)}
                onMouseLeave={handleMouseLeave}
              />
            </Link>
            <Link to="#">
              <Icon
                icon="mingcute:notification-line"
                style={{ fontSize: '22px', color: 'black' }}
                onMouseEnter={(event) => handleMouseEnter('Notifications', event)}
                onMouseLeave={handleMouseLeave}
              />
            </Link>
            <Link to="#" onClick={requestFullScreen}>
              <Icon
                icon="material-symbols:fullscreen"
                style={{ fontSize: '21px', color: 'black' }}
                onMouseEnter={(event) => handleMouseEnter('Full Screen', event)}
                onMouseLeave={handleMouseLeave}
              />
            </Link>
            <Link to="#" onClick={openNewTab}>
              <Icon
                icon="icomoon-free:new-tab"
                style={{ fontSize: '21px', color: 'black' }}
                onMouseEnter={(event) => handleMouseEnter('New Tab', event)}
                onMouseLeave={handleMouseLeave}
              />
            </Link>
          </div>

          <div className="Profile" >
            <MyAccountDetails />
          </div>

          <div className="logout-icon">
            <Link to="#" onClick={openLogoutPopup}>
              <Icon
                icon="icomoon-free:switch"
                style={{ fontSize: '19px', color: 'Red' }}
              />
            </Link>
          </div>
        </div>
      </div>
      {tooltipText && (
        <div
          className="tooltip"
          style={{ top: tooltipPosition.y + 20, left: tooltipPosition.x }}
        >
          {tooltipText}
        </div>
      )}
      <LogoutPopup open={logoutPopupOpen} onClose={closeLogoutPopup} />
    </div>
  );
};

export default TopNav;