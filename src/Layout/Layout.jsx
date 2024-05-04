import React, { useState, useEffect } from 'react';
import "./Layout.css";
import TopNav from "../../src/Components/TopNavDrawer/TopNav/TopNav";
import Sidebar from '../Components/SideDrawer/Sidebar';
import ConnectionWarning from '../Components/Alerts/ConnectionWarning/ConnectionWarning';
import Spinner from "../Components/Spinner/Spinner";

const Layout = ({ children }) => {
    const [sidebarExpanded, setSidebarExpanded] = useState(true);
    const [loading, setLoading] = useState(true); // Add loading state

    const toggleSidebar = () => {
        setSidebarExpanded(!sidebarExpanded);
    };

    // Simulate loading delay (e.g., 2 seconds)
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 200);

        return () => clearTimeout(timer);
    }, []);

    // Render loading spinner while loading is true
    if (loading) {
        return <Spinner />;
    }

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
