import React from 'react';
import './NewStockTransfer.css';
import Layout from "../../../Layout/Layout";
import { Link } from 'react-router-dom';
import { IoChevronBackCircleOutline } from "react-icons/io5";

export function NewStockTransfer() {
    return (
        <>
            <div className="top-nav-blue-text">
                <div className="new-st-top-link">
                    <Link to="/stock-transfer">
                        <IoChevronBackCircleOutline style={{ fontSize: "22px", color: "#0377A8" }} />
                    </Link>
                    <h4>Stock Transfer - New</h4>
                </div>
            </div>
            <Layout>

            </Layout>

        </>
    );
}
export default NewStockTransfer

