// Sidebar.jsx
import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { SidebarData } from "./SidebarData";
import SubMenu from "./SubMenu";
import TopNav from "../TopNavDrawer/TopNav";
import "./Sidebar.css";

const Sidebar = ({ expanded, toggleSidebar }) => {
  const [activeMenuItem, setActiveMenuItem] = useState("");

  return (
    <>
      <TopNav showSidebar={toggleSidebar} />
      <div className={`sidebar-nav ${expanded ? "show" : ""}`}>
        <div className="sidebar-wrap">
          <div className="side-top">
            <div className="collapse-side-icon2" onClick={toggleSidebar}>
              <Icon icon="bi:menu-app" style={{ fontSize: "22px" }} />
            </div>
            <h3 className="SystemName-2">Flex Flow</h3>
          </div>
          <div className="side-middle-content">
            {SidebarData.map((item, index) => (
              <SubMenu
                key={index}
                item={item}
                activeMenuItem={activeMenuItem}
                setActiveMenuItem={setActiveMenuItem}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
