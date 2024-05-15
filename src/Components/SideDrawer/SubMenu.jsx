import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

const SubMenu = ({ item }) => {
  const [subnav, setSubnav] = useState(false);

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
              ? item.iconClosed
              : null}
        </div>
      </Link>
      {subnav &&
        item.subNav.map((subItem, index) => (
          <Link
            to={subItem.path}
            className={`dropdown-link ${currentLocation === subItem.path ? "active" : ""
              }`}
            key={index}
          >
            {subItem.icon}
            <span className="sidebar-label">{subItem.title}</span>
          </Link>
        ))}
    </>
  );
};

export default SubMenu;