import React, { useState, useEffect } from 'react';
import Layout from "../../../Layout/Layout";
import './AdjustBranch.css'
import TableWithPagi from "../../../Components/Tables/TableWithPagi";
import DeletePopup from "../../../Components/PopupsWindows/DeletePopup";
import UpdateBranchPopup from "./UpdateBranchPopup";
import AddNewBranchPopup from "./AddNewBranchPopup";
import axios from "axios";

export const AdjustBranch = () => {
    const [branchData, setBranchData] = useState([]);

    useEffect(() => {
        const fetchBranchData = async () => {
            try {
                const response = await axios.get("http://localhost:8080/branches");
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
            <div className="adjust-branch">
                <h4>Adjust Branch</h4>
            </div>

            <Layout>
                <div className="registerdBranch">
                    <div className="adjustBranchTop">
                        <h3 className="registerdBranch-title">Registered Branches</h3>
                        <AddNewBranchPopup />
                    </div>
                    <TableWithPagi
                        itemsPerPage={5}
                        columns={['Branch ID', 'Branch Name', 'Address', 'Email', 'Contact No', '']}
                        rows={branchData.map(branch => ({
                            branchid: branch.id,
                            branchName: branch.name,
                            branchAddress: branch.address,
                            branchEmail: branch.email,
                            branchContact: branch.contact,
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
