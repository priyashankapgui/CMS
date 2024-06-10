import React from "react";
import Layout from "../../Layout/Layout";
import "./OnlineOrders.css";
import NewSales from "../../Components/NewSales/NewSales"

export const OnlineOrders = () => {

    return (
        <>
            <div className="top-nav-blue-text">
                <h4>Online Orders</h4>
            </div>
            <Layout>
                <NewSales />
            </Layout>
        </>
    );
};

export default OnlineOrders;
