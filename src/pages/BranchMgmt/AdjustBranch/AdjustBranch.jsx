// AdjustBranch.js
import React, { useState, useEffect } from 'react';
import Layout from "../../../Layout/Layout";
import './AdjustBranch.css'
import { Icon } from "@iconify/react";
import TableWithPagi from "../../../Components/Tables/TableWithPagi";
import DeletePopup from "../../../Components/PopupsWindows/DeletePopup";
import UpdateBranchPopup from "./UpdateBranchPopup";
import AddNewBranchPopup from "./AddNewBranchPopup";
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';

const branchesApiUrl = process.env.REACT_APP_BRANCHES_API;

export const AdjustBranch = () => {
    const [branchData, setBranchData] = useState([]);
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBranchData = async () => {
            try {
                const response = await axios.get(branchesApiUrl);
                setBranchData(response.data);
            } catch (error) {
                console.error('Error fetching branches:', error);
            }
        };

        fetchBranchData();
    }, []);


    const handleDelete = async (branchId) => {
        try {
            // Send DELETE request to the backend to delete the branch
            await axios.delete(`${branchesApiUrl}/${branchId}`);
            // Update the state to reflect the deletion
            const updatedBranchData = branchData.filter(branch => branch.branchId !== branchId);
            setBranchData(updatedBranchData);
            console.log("Branch deleted successfully");
            navigate('/adjust-branch');
        } catch (error) {
            console.error('Error deleting branch:', error);
        }
    };

    const handleUpdatePopup = (branchId) => {
        navigate(`/adjust-branch/${branchId}`);
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
                                    <UpdateBranchPopup handleUpdatePopup={() => handleUpdatePopup(branch.branchId)} />
                                    <DeletePopup handleDelete={() => handleDelete(branch.branchId)} />
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
