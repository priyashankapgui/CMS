import Layout from "../../../Layout/Layout";
import './AdjustBranch.css';
import { useEffect, useState } from "react";
import Buttons from "../../../Components/Buttons/Buttons";
import TableWithPagi from "../../../Components/Tables/TableWithPagi";
import DeletePopup from "../../../Components/PopupsWindows/DeletePopup";
import UpdateBranchPopup from "./UpdateBranchPopup";
import AddNewBranchPopup from "./AddNewBranchPopup";
import axios from "axios";

const branchesApiUrl = process.env.REACT_APP_BRANCHES_API;

export const AdjustBranch = () => {
    const [branchData, setBranchData] = useState([]);

    useEffect(() => {
        const fetchBranchData = async () => {
            try {
                const response = await axios.get(branchesApiUrl);
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
                        <h3 className="registerdBranch-title">Registered Branches</h3>
                        <Buttons type="submit" id="new-btn" style={{ backgroundColor: "white", color: "#23A3DA" }} margintop="0"> New + </Buttons>
                    </div>
                    <TableWithPagi
                        itemsPerPage={5}
                        columns={['Branch ID', 'Branch Name', 'Address', 'Email', 'Contact No', 'Action']}
                        rows={[
                            {
                                branchid: "B001",
                                branchName: "Kaluthara",
                                branchAddress: "28, Galle Road, Kaluthara South",
                                branchEmail: "kaluthara@greenleaf.com",
                                branchContact: "0342 222 231",
                                action: (
                                    <div style={{ display: "flex", gap: "0.5em" }}>
                                        <UpdateBranchPopup />
                                        <DeletePopup />
                                    </div>
                                )
                            },
                            {
                                branchid: "B002",
                                branchName: "Galle",
                                branchAddress: "28, Galle Road, Kaluthara South",
                                branchEmail: "galle@greenleaf.com",
                                branchContact: "0342 222 231",
                                action: (
                                    <div style={{ display: "flex", gap: "0.5em" }}>
                                        <UpdateBranchPopup />
                                        <DeletePopup />
                                    </div>
                                )
                            }

                        ]}
                    />
                </div>







            </Layout>


        </>
    );
};
