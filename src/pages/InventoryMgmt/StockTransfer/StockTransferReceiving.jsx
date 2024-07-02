import Layout from "../../../Layout/Layout";
import React, { useState, useEffect } from 'react';
import './StockTransferReceiving.css';
import Buttons from '../../../Components/Buttons/SquareButtons/Buttons';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { IoChevronBackCircleOutline } from "react-icons/io5";
import InputLabel from "../../../Components/Label/InputLabel";
import TableWithPagi from '../../../Components/Tables/TableWithPagi';
import { getStockTransferBySTN_NO, updateTransferQty } from "../../../Api/Inventory/StockTransfer/StockTransferAPI";

export const StockTransferReceiving = () => {
    const navigate = useNavigate();
    const { STN_NO } = useParams();
    const [stockTransferDetails, setStockTransferDetails] = useState(null);

    useEffect(() => {
        const fetchStockTransferDetails = async () => {
            try {
                const response = await getStockTransferBySTN_NO(STN_NO);
                setStockTransferDetails(response.data);

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
            if (response.data.success) {
                console.log('Data successfully saved:', response.data.message);
                // Handle success (e.g., show a success message, navigate to another page, etc.)
            } else {
                console.error('Failed to save data:', response.data.message);
            }
            // Navigate to the desired page after successful save
            navigate('/stock-transfer');
        } catch (error) {
            console.error('Error saving data:', error);
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
            <div className="top-nav-blue-text">
            <div className="stockReceiving-top-link">
                    <Link to="/stock-transfer">
                        <IoChevronBackCircleOutline style={{ fontSize: "22px", color: "#0377A8" }} />
                    </Link>
                    <h4>Stock Transfer - Receiving Completed</h4>
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
                        <Buttons type="button" id="save-btn" style={{ backgroundColor: "#23A3DA", color: "white" }} onClick={handleSave}> Save </Buttons>
                        <Buttons type="button" id="close-btn" style={{ backgroundColor: "white", color: "black" }} onClick={handleButtonClick}>Close</Buttons>
                        <p className='tot-amount-txt'>Total Amount: <span className="totalAmountValue">Rs: {calculateTotalAmount()}</span></p>
                    </div>
                </div>
            </Layout>
        </>
    );
};

export default StockTransferReceiving;
