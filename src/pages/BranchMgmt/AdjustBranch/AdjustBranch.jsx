import React, {  useState, useEffect } from 'react';
import Layout from "../../../Layout/Layout";
import './AdjustBranch.css'
import TableWithPagi from "../../../Components/Tables/TableWithPagi";
import DeletePopup from "../../../Components/PopupsWindows/DeletePopup";
import UpdateBranchPopup from "../../../Components/PopupsWindows/UpdateBranchPopup";
import Buttons from "../../../Components/Buttons/Buttons";
// import data from "../../../Components/Data.json";
import axios from "axios";

export const AdjustBranch = () => {
  const [branchData, setBranchData] = useState([]);

    useEffect(() => {
        const fetchBranchData = async () => {
            try {
                const response = await axios.get("http://localhost:8080/branches");
                setBranchData(response.data); // Set the fetched supplier data
            } catch (error) {
                console.error('Error fetching branches:', error);
            }
        };

        fetchBranchData();
    }, []);
    return (
        <>
            <div className="adjust-branch">
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
                        columns={['Branch ID', 'Branch Name', 'Address', 'Email', 'Contact No', '']}
                        rows={branchData.map(branch=>({'branchId':branch.branchId,'branchName':branch.branchName,'address':branch.address,'email':branch.email,'contactNumber':branch.contactNumber,
                            action: (
                                <div style={{ display: "flex", gap: "0.5em" }}>
                                    <UpdateBranchPopup />
                                    <DeletePopup />
                                </div>
                            )
                        }))}
                    />
                </div>







            </Layout>


        </>
    );
};