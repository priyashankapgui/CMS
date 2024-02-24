import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { SidebarData } from "./SidebarData";
import SubMenu from "./SubMenu";
import TopNav from "../TopNavDrawer/TopNav";
import "./Sidebar.css";

const Sidebar = () => {
  const [sidebar, setSidebar] = useState(true);

  const showSidebar = () => setSidebar(!sidebar);

  return (
    <>
      <TopNav showSidebar={showSidebar} />
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
    </>
  );
};

export default Sidebar;
