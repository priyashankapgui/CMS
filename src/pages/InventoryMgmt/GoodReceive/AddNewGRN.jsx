import React from 'react';
import './AddNewGRN.css';
import Layout from "../../../Layout/Layout";
import { Link} from 'react-router-dom';
import { IoChevronBackCircleOutline } from "react-icons/io5";

export function AddNewGRN() {
    return (
        <>
            <div className="top-nav-blue-text">
                <div className="new-grn-top-link">
                    <Link to="/good-receive">
                        <IoChevronBackCircleOutline style={{ fontSize: "22px", color: "#0377A8" }} />
                    </Link>
                    <h4>GRN - New</h4>
                </div>
            </div>
            <Layout>



            </Layout>

        </>
    );
}

export default AddNewGRN