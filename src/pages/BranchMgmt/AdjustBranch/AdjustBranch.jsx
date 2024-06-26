import React, { useState, useEffect } from 'react';
import Layout from "../../../Layout/Layout";
import './AdjustBranch.css'
import TableWithPagi from "../../../Components/Tables/TableWithPagi";
import DeletePopup from "../../../Components/PopupsWindows/DeletePopup";
import UpdateBranchPopup from "./UpdateBranchPopup";
import AddNewBranchPopup from "./AddNewBranchPopup";
import axios from "axios";
const url = "http://localhost:8080/branches";

export const AdjustBranch = () => {
    const [branchData, setBranchData] = useState([]);

    useEffect(() => {
        const fetchBranchData = async () => {
            try {
                const response = await axios.get(url);
                setBranchData(response.data); // Set the fetched branch data
            } catch (error) {
                console.error('Error fetching branches:', error);
            }
        };

        fetchBranchData();
    }, []);

    const handleDelete = () => {
        // Your delete logic here
        console.log("Delete button clicked");
    };

    return (
        <>
            <div className="top-nav-blue-text">
                <h4>Adjust Branch</h4>
            </div>

            <Layout>
                <div className="registerdBranch">
                    <div className="adjustBranchTop">
                        <h3 className="registeredBranch-title">Registered Branches</h3>
                        <AddNewBranchPopup />
                    </div>
                    <TableWithPagi
                        itemsPerPage={5}
                        columns={['Branch ID', 'Branch Name', 'Address', 'Email', 'Contact No', '']}
                        rows={branchData.map(branch => ({
                            branchId: branch.branchId,
                            branchName: branch.branchName,
                            branchAddress: branch.address,
                            branchEmail: branch.email,
                            branchContact: branch.contactNumber,

                            action: (
                                <div style={{ display: "flex", gap: "0.5em" }}>
                                    <UpdateBranchPopup />
                                    <DeletePopup handleDelete={handleDelete} />
                                </div>
                            )
                        }))}
                    />
                </div>
            </Layout>
        </>
    );
};

export default AdjustBranch;