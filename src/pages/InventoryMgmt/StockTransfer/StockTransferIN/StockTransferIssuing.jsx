import Layout from "../../../../Layout/Layout";
import React, { useState, useEffect } from 'react';
import './StockTransferIssuing.css';
import Buttons from '../../../../Components/Buttons/SquareButtons/Buttons';
import InputLabel from "../../../../Components/Label/InputLabel";
import TableWithPagi from '../../../../Components/Tables/TableWithPagi';
import SearchBar from '../../../../Components/SearchBar/SearchBar';
import secureLocalStorage from "react-secure-storage";
import SubSpinner from "../../../../Components/Spinner/SubSpinner/SubSpinner";
import CustomAlert from '../../../../Components/Alerts/CustomAlert/CustomAlert';
import ConfirmationPopup from "../../../../Components/PopupsWindows/ConfirmationPopup";
import { Link , useNavigate, useParams } from 'react-router-dom';
import { IoChevronBackCircleOutline } from "react-icons/io5";
import { getStockTransferBySTN_NO, getBatchNo, createstockTransferIN } from "../../../../Api/Inventory/StockTransfer/StockTransferAPI";
import { cancelStockRequest } from "../../../../Api/Inventory/StockTransfer/StockTransferAPI";

export const StockTransferIssuing = () => {
    const { STN_NO } = useParams();
    const navigate = useNavigate();

    const [stockTransferDetails, setStockTransferDetails] = useState(null);
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [alert, setAlert] = useState({ show: false, severity: '', title: '', message: '' });


    useEffect(() => {
        const fetchStockTransferDetails = async () => {
            try {
                
                
                const response = await getStockTransferBySTN_NO(STN_NO);
                setStockTransferDetails(response.data);
                const products = response.data.products.map((product, index) => ({
                    id: index + 1,
                    productId: `${product.productId} / ${product.productName}`,
                    reqQty: product.requestedQty,
                    batchNo: '', 
                    transferQty: '',
                    unitPrice: 0,
                    expDate: '',
                    amount: 0,
                }));
                setRows(products);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching stock transfer details:", error);
            }finally {
                setLoading(false);
            }
        };

        fetchStockTransferDetails();
    }, [STN_NO]);

    const fetchBatchSuggestions = async (productId, branchName, searchTerm) => {
        try {
            const response = await getBatchNo(productId,branchName);
            console.log("data ",response.data);
            return response.data.map(batch => ({
                value: batch.batchNo,
                displayText: `${batch.batchNo} (Available: ${batch.totalAvailableQty})`,
                unitPrice: batch.sellingPrice ,
                expDate: batch.expDate,
            }));
        } catch (error) {
            console.error("Error fetching batch suggestions:", error);
            return [];
        }
    };

    const handleBatchSelect = (id, selectedBatch) => {
        const updatedRows = rows.map(row => {
            if (row.id === id) {
                return { ...row, batchNo: selectedBatch.value, unitPrice: selectedBatch.unitPrice, expDate: selectedBatch.expDate, amount: (row.transferQty * selectedBatch.unitPrice).toFixed(2) };
            }
            return row;
        });
        setRows(updatedRows);
    };

    const handleSave = async () => {
        try {
            const userJSON = secureLocalStorage.getItem("user");
            if (userJSON) {
                const user = JSON.parse(userJSON);
                
            

            const data = {
                STN_NO: stockTransferDetails?.STN_NO,
                submittedBy: user.userName,
                supplyingBranch: stockTransferDetails?.supplyingBranch,
                products: rows.map(row => ({
                    productId: row.productId.split(' / ')[0],
                    batchNo: row.batchNo,
                    transferQty: row.transferQty,
                    unitPrice: row.unitPrice,
                    expDate: row.expDate,
                    amount: row.amount
                }))
            };


            const response = await createstockTransferIN(data);
            setAlert({
                show: true,
                severity: 'success',
                title: 'Success',
                message: 'Stock transfer successful!'
            });
            
        } else {
            console.error('User details not found in secure storage');
        }
     } catch (error) {
            console.error("Error saving stock transfer:", error);
            setAlert({
                show: true,
                severity: 'error',
                title: 'Error',
                message: 'Failed to save stock transfer.'
            });
        }
    
    };

    const calculateTotalAmount = () => {
        return rows.reduce((total, row) => total + (row.transferQty * row.unitPrice || 0), 0).toFixed(2);
    };

    const handleInputChange = (id, field, value) => {
        const updatedRows = rows.map(row => {
            if (row.id === id) {
                const updatedRow = { ...row, [field]: value };
                if (field === 'transferQty' || field === 'unitPrice') {
                    updatedRow.amount = (updatedRow.transferQty * updatedRow.unitPrice).toFixed(2);
                }
                return updatedRow;
            }
            return row;
        });
        setRows(updatedRows);
    };

    const handleAddRow = (selectedRow) => {
        const newRow = {
            id: rows.length + 1,
            productId: selectedRow.productId,
            reqQty: selectedRow.reqQty,
            batchNo: '', 
            transferQty: '',
            unitPrice: 0,
            expDate: '',
            amount: 0,
        };
        setRows([...rows, newRow]);
    };

    const handleDeleteRow = (id) => {
        if (id === 1 && rows.length === 1) {
            // Clear data for the first row
            setRows([{ id: 1, productId: '', reqQty: '', batchNo: '', transferQty: '', unitPrice: 0, expDate: '', amount: 0 }]);
        } else {
            // Delete other rows
            setRows(rows.filter(row => row.id !== id));
        }
    };


    const columns = [
        "Product ID / Name",
        "Req. Qty",
        "Batch No",
        "Transfer Qty",
        "Unit Price",
        "Exp Date",
        "Amount",
        
    ];

    const tableRows = rows.map(row => ({
        productId: row.productId,
        reqQty: row.reqQty,
        batchNo: (
            <SearchBar
                searchTerm={row.batchNo}
                setSearchTerm={(term) => handleInputChange(row.id, 'batchNo', term)}
                fetchSuggestions={(term) => fetchBatchSuggestions(row.productId.split(' / ')[0], stockTransferDetails?.supplyingBranch, term)}
                onSelectSuggestion={(suggestion) => handleBatchSelect(row.id, suggestion)}
            />
        ),
        transferQty: (
            <input className="data-box-table"
                type="number"
                value={row.transferQty}
                onChange={(e) => handleInputChange(row.id, 'transferQty', parseFloat(e.target.value) || 0)}
            />
        ),
        unitPrice: (
            <input className="data-box-table"
                type="number"
                value={row.unitPrice}
                onChange={(e) => handleInputChange(row.id, 'unitPrice', parseFloat(e.target.value) || 0)}
            />
        ),

        expDate: row.expDate,
        amount: row.amount,
        
    }));


   
    const handleCancel = () => {
        setShowConfirmation(true);
    };

    const handleConfirmCancel = async () => {
        try {
            const userJSON = secureLocalStorage.getItem("user");
            if (userJSON) {
                const user = JSON.parse(userJSON);

                const data = {
                    STN_NO: stockTransferDetails?.STN_NO,
                    submittedBy: user.userName,
                };

                const response = await cancelStockRequest(data);
                setAlert({
                    show: true,
                    severity: 'success',
                    title: 'Success',
                    message: 'Stock transfer cancellation successful!.'
                });
            } else {
                console.error('User details not found in secure storage');
            }
        } catch (error) {
            console.error("Error cancelling stock transfer:", error);
            setAlert({
                show: true,
                severity: 'error',
                title: 'Error',
                message: 'Failed to cancel stock transfer.'
            });
        } finally {
            setShowConfirmation(false); 
        }
    };

    const handleCloseAlert = () => {
        setAlert({ show: false, severity: '', title: '', message: '' });
    };
    return (
        <>
         {alert.show && (
                <CustomAlert
                    severity={alert.severity}
                    title={alert.title}
                    message={alert.message}
                    duration={3000}
                    onClose={handleCloseAlert}
                />
            )}
            <div className="top-nav-blue-text">
            <div className="stockIssuing-link">
                    <Link to="/stock-transfer">
                        <IoChevronBackCircleOutline style={{ fontSize: "22px", color: "#0377A8" }} />
                    </Link>
                    <h4>Stock Transfer IN - Issuing</h4>
                </div>
               
            </div>
            <Layout>
                <div className="StockIn-bodycontainer">
                    <div className="StockIn-filter-container">
                        <div className="StockTransferField">
                            <InputLabel htmlFor="stnNo" color="#0377A8">Stock Transfer No(STN)</InputLabel>
                            <div className="data-box">
                                <span>{stockTransferDetails?.STN_NO}</span>
                            </div>
                        </div>

                        <div className="RequestedBranchField">
                            <InputLabel htmlFor="requestedBranch" color="#0377A8">Requested Branch</InputLabel>
                            <div className="data-box">
                                <span>{stockTransferDetails?.requestBranch}</span>
                            </div>
                        </div>
                        <div className="SupplyingBranchField">
                            <InputLabel htmlFor="supplyingBranch" color="#0377A8">Supplying Branch</InputLabel>
                            <div className="data-box">
                                <span>{stockTransferDetails?.supplyingBranch}</span>
                            </div>
                        </div>
                    </div>
                    <div className="StockIn-content-middle">
                    {loading ? (
                            <div><SubSpinner /></div>
                        ) : (
                        <TableWithPagi rows={tableRows} columns={columns} />
                        )}
                    </div>
                    <div className="StockIn-BtnSection">
                        <Buttons type="button" id="save-btn" style={{ backgroundColor: "#23A3DA", color: "white" }} onClick={handleSave}> Issue </Buttons>
                        <Buttons type="button" id="close-btn" style={{ backgroundColor: "white", color: "black" }} onClick={() => navigate('/stock-transfer')}>Close</Buttons>
                        <Buttons type="button" id="cancel-btn" style={{ backgroundColor: "white", color: "red" }}  onClick={handleCancel} >Cancel</Buttons> 
                       
                        <p className='tot-amount-txt'>Total Amount: <span className="totalAmountValue">Rs: {calculateTotalAmount()}</span></p>
                    </div>
                </div>
                {showConfirmation && (
                    <ConfirmationPopup
                        title="Cancel Confirmation"
                        message="Are you sure you want to cancel?"
                        onConfirm={handleConfirmCancel}
                        onCancel={() => setShowConfirmation(false)}
                    />
                )}
            </Layout>
        </>
    );
};

export default StockTransferIssuing;
