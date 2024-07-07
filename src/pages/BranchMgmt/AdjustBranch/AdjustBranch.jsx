import React, { useState, useEffect } from 'react';
import Layout from "../../../Layout/Layout";
import './AdjustBranch.css';
import TableWithPagi from "../../../Components/Tables/TableWithPagi";
import DeletePopup from "../../../Components/PopupsWindows/DeletePopup";
import UpdateBranchPopup from "./UpdateBranchPopup";
import AddNewBranchPopup from "./AddNewBranchPopup";
import SubSpinner from '../../../Components/Spinner/SubSpinner/SubSpinner';
import CustomAlert from '../../../Components/Alerts/CustomAlert/CustomAlert';
import { getBranchOptions, deleteBranch } from '../../../Api/BranchMgmt/BranchAPI.jsx';

export const AdjustBranch = () => {
    const [branchData, setBranchData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertConfig, setAlertConfig] = useState({});

    const fetchBranchData = async () => {
        setLoading(true);
        try {
            const branches = await getBranchOptions();
            setBranchData(Array.isArray(branches) ? branches : []);
        } catch (error) {
            console.error('Error fetching branches:', error);
            showAlert({
                severity: 'error',
                title: 'Error!',
                message: 'Failed to fetch branches.',
                duration: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBranchData();

        const storedAlertConfig = localStorage.getItem('alertConfig');
        if (storedAlertConfig) {
            setAlertConfig(JSON.parse(storedAlertConfig));
            setAlertVisible(true);
            localStorage.removeItem('alertConfig');
        }
    }, []);

    const showAlert = (config) => {
        setAlertConfig(config);
        setAlertVisible(true);
        setTimeout(() => {
            setAlertVisible(false);
        }, config.duration || 3000);
    };

    const handleDelete = async (branchId) => {
        setLoading(true);
        try {
            await deleteBranch(branchId);
            const updatedBranchData = branchData.filter(branch => branch.branchId !== branchId);
            setBranchData(updatedBranchData);

            showAlert({
                severity: 'success',
                title: 'Successfully Deleted!',
                message: 'Branch deleted successfully!',
                duration: 3000
            });
        } catch (error) {
            console.error('Error deleting branch:', error);

            showAlert({
                severity: 'warning',
                title: 'Error!',
                message: 'Failed to delete branch.',
                duration: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const handlePopupClose = () => {
        fetchBranchData(); // Call fetchBranchData when closing the popup
    };

    return (
        <>
            {alertVisible && (
                <CustomAlert
                    severity={alertConfig.severity}
                    title={alertConfig.title}
                    message={alertConfig.message}
                    duration={alertConfig.duration}
                    onClose={() => setAlertVisible(false)}
                />
            )}
            <div className="top-nav-blue-text">
                <h4>Adjust Branch</h4>
            </div>

            <Layout>
                <div className="registerdBranch">
                    <div className="adjustBranchTop">
                        <h3 className="registeredBranch-title">Registered Branches</h3>
                        <AddNewBranchPopup fetchData={fetchBranchData}/>
                    </div>

                    {loading ? (
                        <div> <SubSpinner/></div>
                    ) : (
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
                                        <UpdateBranchPopup branchId={branch.branchId} onClose={handlePopupClose} />
                                        <DeletePopup handleDelete={() => handleDelete(branch.branchId)} />
                                    </div>
                                )
                            }))}
                        />
                    )}
                </div>
            </Layout>
        </>
    );
};

export default AdjustBranch;
