import React, { useState } from 'react';
import "./Layout.css";
import TopNav from "../../src/Components/TopNavDrawer/TopNav/TopNav";
import Sidebar from '../Components/SideDrawer/Sidebar';
import ConnectionWarning from '../Components/Alerts/ConnectionWarning/ConnectionWarning';

const Layout = ({ children }) => {
    const [sidebarExpanded, setSidebarExpanded] = useState(true);

    const toggleSidebar = () => {
        setSidebarExpanded(!sidebarExpanded);
    };

    return (
            <div className='layout'>
                <TopNav />
                <Sidebar expanded={sidebarExpanded} toggleSidebar={toggleSidebar} />
            
                <ConnectionWarning/>
                <div id="bodycontent" style={{ marginLeft: sidebarExpanded ? '16.875em' : '1.25em' ,  marginRight: sidebarExpanded ? '1.25em' : '1.25em' }}>
                    {children}
                </div>
            </div>
    );
};

export default Layout;
