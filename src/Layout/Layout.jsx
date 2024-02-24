import React from 'react';
import "./Layout.css";
import TopNav from '../Components/TopNavDrawer/TopNav';
import Sidebar from '../Components/SideDrawer/Sidebar';

const Layout = ({ children }) => {
    return (
        <div className='layout'>
            <div id="wrapper">
                <div id="top-nav-content">
                    <TopNav />
                </div>
                <div id="side-nav-content">
                    <Sidebar />
                </div>
                <div id="bodycontent">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Layout;
