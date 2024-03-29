import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

const SubMenu = ({ item }) => {
 
  const currentLocation = useLocation().pathname;
  const [subnav, setSubnav] = useState(false);


  useEffect(() => {
    if (item.subNav) {
      item.subNav.forEach(link => {
        if (link.path === currentLocation) {
          setSubnav(true);
        }
      });
    }
  }, [currentLocation, item.subNav]);
  


  const showSubnav = () => setSubnav(!subnav);

  return (
    <>
      <Link to={item.path} className="sidebar-link" onClick={item.subNav && showSubnav}>
        <div className="link-container">
          {item.icon}
          <span className="sidebar-label">{item.title}</span>
        </div>
        <div>
          {item.subNav && subnav
            ? item.iconOpened
            : item.subNav
              ? item.iconClosed
              : null}
        </div>
      </Link>
      {subnav &&
        item.subNav.map((item, index) => {
          return (
            <Link to={item.path} className="dropdown-link" key={index}>
              {item.icon}
              <span className="sidebar-label">{item.title}</span>
            </Link>
          );
        })}
    </>
  );
};

export default SubMenu;
