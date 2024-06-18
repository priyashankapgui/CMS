import React from 'react';
import Layout from "../../Layout/Layout";
import NewSales  from "../../Components/NewSales/NewSales"
export const WebMgmt = () => {

    return (
        <>
            <div className="top-nav-blue-text">
                <h4>WebMgmt</h4>
            </div>
            <Layout>
            <NewSales/>
            </Layout>
        </>
    );
};
