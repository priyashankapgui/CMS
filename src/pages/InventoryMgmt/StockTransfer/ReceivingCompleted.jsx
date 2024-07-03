import Layout from "../../../Layout/Layout";
import React, { useState, useEffect } from 'react';
import './ReceivingCompleted.css';
import Buttons from '../../../Components/Buttons/SquareButtons/Buttons';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { IoChevronBackCircleOutline } from "react-icons/io5";
import CustomAlert from '../../../Components/Alerts/CustomAlert/CustomAlert';
import InputLabel from "../../../Components/Label/InputLabel";
import TableWithPagi from '../../../Components/Tables/TableWithPagi';
import { getStockTransferBySTN_NO, updateTransferQty } from "../../../Api/Inventory/StockTransfer/StockTransferAPI";

export const ReceivingCompleted = () => {
    const navigate = useNavigate();
    const { STN_NO } = useParams();
    const [stockTransferDetails, setStockTransferDetails] = useState(null);
    const [isSaved, setIsSaved] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false); 
    const [alertConfig, setAlertConfig] = useState({}); 

    useEffect(() => {
        const fetchStockTransferDetails = async () => {
            try {
                const response = await getStockTransferBySTN_NO(STN_NO);
                setStockTransferDetails(response.data);

                // Check if data has already been saved
                const savedState = localStorage.getItem(`isSaved_${STN_NO}`);
                if (savedState === 'true' || response.data.isSaved) {
                    setIsSaved(true);
                }
            } catch (error) {
                console.error('Error fetching stock transfer details:', error);
            }
        };

        if (STN_NO) {
            fetchStockTransferDetails();
        }
    }, [STN_NO]);

    const handleButtonClick = () => {
        navigate('/stock-transfer');
    };

    const handleSave = async () => {
        if (!stockTransferDetails) return;

        const { STN_NO, requestBranch, products } = stockTransferDetails;

        const formattedData = {
            STN_NO,
            requestBranch,
            products: products.flatMap(product => 
                product.batches.map(batch => ({
                    productId: product.productId,
                    batchNo: batch.batchNo,
                    transferQty: batch.transferQty,
                }))
            ),
        };

        try {
            const response = await updateTransferQty(formattedData);
            if (response.success) {
                console.log('Data successfully saved:', response.message);
                setIsSaved(true); 
                setAlertConfig({
                    severity: 'success',
                    title: 'Saved',
                    message: 'Data successfully saved!',
                    duration: 5000
                });
                setAlertVisible(true);
                localStorage.setItem(`isSaved_${STN_NO}`, 'true');
            } else {
                console.error('Failed to save data:', response.data.message);
                setAlertConfig({
                    severity: 'error',
                    title: 'Error',
                    message: 'Failed to save data.',
                    duration: 5000
                });
                setAlertVisible(true);
            }
        } catch (error) {
            console.error('Error saving data:', error);
            setAlertConfig({
                severity: 'error',
                title: 'Error',
                message: 'Failed to save data.',
                duration: 5000
            });
            setAlertVisible(true);
        }
    };

    const calculateTotalAmount = () => {
        return stockTransferDetails?.products.reduce((total, product) => 
            total + product.batches.reduce((batchTotal, batch) => batchTotal + batch.amount, 0), 0
        ) || 0;
    };

    const columns = [
        "Product Id / Name",
        "Req. Qty",
        "Batch No",
        "Transfer Qty",
        "Unit Price",
        "Amount",
    ];

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
                <div className="stockReceiving-top-link">
                    <Link to="/stock-transfer">
                        <IoChevronBackCircleOutline style={{ fontSize: "22px", color: "#0377A8" }} />
                    </Link>
                    <h4>Stock Transfer OUT - Completed</h4>
                </div>
            </div>
            <Layout>
                <div className="stockReceiving-bodycontainer">
                    <div className="stockReceiving-filter-container">
                        <div className="StockTransferField">
                            <InputLabel htmlFor="stnNo" color="#0377A8">Stock Transfer No(STN)</InputLabel>
                            <div className="stockReceivingdata-box">
                                <span>{stockTransferDetails?.STN_NO}</span>
                            </div>
                        </div>
                        <div className="RequestedBranchField">
                            <InputLabel htmlFor="requestedBranch" color="#0377A8">Requested Branch</InputLabel>
                            <div className="stockReceivingdata-box">
                                <span>{stockTransferDetails?.requestBranch}</span>
                            </div>
                        </div>
                        <div className="SupplyingBranchField">
                            <InputLabel htmlFor="supplyingBranch" color="#0377A8">Supplying Branch</InputLabel>
                            <div className="stockReceivingdata-box">
                                <span>{stockTransferDetails?.supplyingBranch}</span>
                            </div>
                        </div>
                        <div className="RequestedByField">
                            <InputLabel htmlFor="requestedBy" color="#0377A8">Requested By</InputLabel>
                            <div className="stockReceivingdata-box">
                                <span>{stockTransferDetails?.requestedBy}</span>
                            </div>
                        </div>
                        <div className="SubmittedByField">
                            <InputLabel htmlFor="submittedBy" color="#0377A8">Submitted By</InputLabel>
                            <div className="stockReceivingdata-box">
                                <span>{stockTransferDetails?.submittedBy}</span>
                            </div>
                        </div>
                    </div>
                    <div className="stockReceiving-content-middle">
                        {stockTransferDetails?.products ? (
                            <TableWithPagi rows={stockTransferDetails.products.map(product => ({
                                "Product Id / Name": `${product.productId} / ${product.productName}`,
                                "Req. Qty": product.requestedQty,
                                "Batch No": product.batches.map(batch => batch.batchNo).join(', '),
                                "Transfer Qty": product.batches.map(batch => batch.transferQty).join(', '),
                                "Unit Price": product.batches.map(batch => batch.unitPrice).join(', '),
                                "Amount": product.batches.map(batch => batch.amount).join(', ')
                            }))} columns={columns} />
                        ) : (
                            <p>No products available</p>
                        )}
                    </div>
                    <div className="stockReceiving-BtnSection">
                        {!isSaved ? (
                            <Buttons type="button" id="save-btn" style={{ backgroundColor: "#23A3DA", color: "white" }} onClick={handleSave}> Save </Buttons>
                        ) : null}
                        <Buttons type="button" id="close-btn" style={{ backgroundColor: "white", color: "black" }} onClick={handleButtonClick}>Close</Buttons>
                        <p className='tot-amount-txt'>Total Amount: <span className="totalAmountValue">Rs: {calculateTotalAmount()}</span></p>
                    </div>
                </div>
            </Layout>
        </>
    );
};

export default ReceivingCompleted;
