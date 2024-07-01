import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

const SubMenu = ({ item, permissionArray }) => {
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

  const showSubnav = () => {
    if (item.subNav) {
      setSubnav(prevSubnav => !prevSubnav);
    }
  };

  return (
    <>
      <Link
        className={`sidebar-link ${currentLocation === item.path ? "active" : ""}`}
        onClick={showSubnav}
        to={item.path}
      >
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
        item.subNav.map((subItem, index) => {
          if(permissionArray.includes(subItem.path)){
            return(
            <Link
              to={subItem.path}
              className={`dropdown-link ${currentLocation === subItem.path ? "active" : ""
                }`}
              key={index}
            >
              {subItem.icon}
              <span className="sidebar-label">{subItem.title}</span>
            </Link>
            );
          }
          else{
            return null;
          }
        })}
    </>
  );
};

export default SubMenu;