import React from 'react';
import { Link } from 'react-router-dom';
import { IoChevronBackCircleOutline } from "react-icons/io5";
import Layout from '../../../Layout/Layout';



export const AddNewGRN = () => {
    return (
        <>
            <div className="top-nav-blue-text">
                <div className="newGRN-top-link-top-link">
                    <Link to="/good-receive">
                        <IoChevronBackCircleOutline style={{ fontSize: "22px", color: "#0377A8" }} />
                    </Link>
                    <h4>New GRN</h4>
                </div>
            </div>
            <Layout>

            </Layout>
        </>
    );
};

export default AddNewGRN;
