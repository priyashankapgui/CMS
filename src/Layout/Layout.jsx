import React, { useState } from 'react';
import "./Layout.css";
import TopNav from '../Components/TopNavDrawer/TopNav';
import Sidebar from '../Components/SideDrawer/Sidebar';

const Layout = ({ children }) => {
    const [sidebarExpanded, setSidebarExpanded] = useState(true);

    const toggleSidebar = () => {
        setSidebarExpanded(!sidebarExpanded);
    };

    return (
        <div className='layout'>
            <div id="wrapper">
                <div id="top-nav-content">
                    <TopNav />
                </div>
                <div id="side-nav-content">
                    <Sidebar expanded={sidebarExpanded} toggleSidebar={toggleSidebar} />
                </div>
                <div id="bodycontent" style={{ marginLeft: sidebarExpanded ? '270px' : '10px' }}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Layout;
