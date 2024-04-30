import React from "react";
import Layout from "../../Layout/Layout";
import "./OnlineOrders.css";
import SalesReceipt from "../../Components/SalesReceiptTemp/SalesReceipt";

export const OnlineOrders = () => {

    return (
        <>
            <div className="online-orders">
                <h4>Online Orders</h4>
            </div>
            <Layout>
                <SalesReceipt />
            </Layout>

        </>
    );
};
