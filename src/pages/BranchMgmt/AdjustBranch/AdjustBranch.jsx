import React, { useState, useEffect } from 'react';
import Layout from "../../../Layout/Layout";
import './AdjustBranch.css';
import TableWithPagi from "../../../Components/Tables/TableWithPagi";
import DeletePopup from "../../../Components/PopupsWindows/DeletePopup";
import UpdateBranchPopup from "./UpdateBranchPopup";
import AddNewBranchPopup from "./AddNewBranchPopup";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import SubSpinner from '../../../Components/Spinner/SubSpinner/SubSpinner';
import CustomAlert from '../../../Components/Alerts/CustomAlert/CustomAlert';
import secureLocalStorage from 'react-secure-storage';

const branchesApiUrl = process.env.REACT_APP_BRANCHES_API;

export const AdjustBranch = () => {
    const [branchData, setBranchData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertConfig, setAlertConfig] = useState({});

    const navigate = useNavigate();

    useEffect(() => {
        const fetchBranchData = async () => {
            try {
                const token = secureLocalStorage.getItem("accessToken");
                const response = await axios.get(branchesApiUrl, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                // Ensure the response data is an array
                setBranchData(Array.isArray(response.data) ? response.data : response.data.branchesList || []);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching branches:', error);
                setLoading(false);
            }
        };

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
            await axios.delete(`${branchesApiUrl}/${branchId}`);
            const updatedBranchData = branchData.filter(branch => branch.branchId !== branchId);
            setBranchData(updatedBranchData);
            console.log("Branch deleted successfully");

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
                        <AddNewBranchPopup />
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
                                        <UpdateBranchPopup branchId={branch.branchId} />
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
