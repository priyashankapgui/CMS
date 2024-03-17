import Layout from "../../../Layout/Layout";
import './AdjustBranch.css'
import TableWithPagi from "../../../Components/Tables/TableWithPagi";
import DeletePopup from "../../../Components/PopupsWindows/DeletePopup";
import UpdateBranchPopup from "../../../Components/PopupsWindows/UpdateBranchPopup";
import Buttons from "../../../Components/Buttons/Buttons";


export const AdjustBranch = () => {
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
