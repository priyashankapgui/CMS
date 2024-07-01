// Sidebar.jsx
import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { SidebarData } from "./SidebarData";
import SubMenu from "./SubMenu";
import TopNav from "../../Components/TopNavDrawer/TopNav/TopNav";
import "./Sidebar.css";
import secureLocalStorage from "react-secure-storage";
import { getUserRolePermissionsByToken } from "../../Api/BranchMgmt/UserRoleAPI";

const Sidebar = ({ expanded, toggleSidebar }) => {
  const [activeMenuItem, setActiveMenuItem] = useState("");
  const [permissionArray, setPermissionArray] = useState([]);

  useEffect(() => {
    const getPermissions = async () => {
      try {
        // console.log("Fetching permissions");
        const response = await getUserRolePermissionsByToken(secureLocalStorage.getItem("accessToken"));
        const data = await response.data;
        const tempData = data.map((page) => {
          return `/${page.pageAccessId}`;
        });
        setPermissionArray(tempData);
        console.log("Permissions:", tempData);
        // secureLocalStorage.setItem("permissions", tempData);
      } catch (error) {
        console.error("Error fetching permissions:", error);
      }
    };
    // if(secureLocalStorage.getItem("permissions")){
    //   // console.log("Fetching permissions from local storage");
    //   setPermissionArray(secureLocalStorage.getItem("permissions"));
    //   console.log("Permissions:", secureLocalStorage.getItem("permissions"));
    // }
    // else{
      getPermissions();
    // }
  }, []);

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
            {SidebarData.map((item, index) => {
              if (
                (item.subNav?.some((subitem) => permissionArray.includes(subitem.path))) 
                ||
                permissionArray.includes(item.path)
              ) {
                return (
                  <SubMenu
                    key={index}
                    item={item}
                    activeMenuItem={activeMenuItem}
                    setActiveMenuItem={setActiveMenuItem}
                    permissionArray={permissionArray}
                  />
                );
              } else {
                return null;
              }
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
