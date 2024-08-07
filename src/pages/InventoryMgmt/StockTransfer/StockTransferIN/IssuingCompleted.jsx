import Layout from "../../../../Layout/Layout";
import React, { useState, useEffect } from 'react';
import './IssuingCompleted.css';
import Buttons from '../../../../Components/Buttons/SquareButtons/Buttons';
import InputLabel from "../../../../Components/Label/InputLabel";
import TableWithPagi from '../../../../Components/Tables/TableWithPagi';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { IoChevronBackCircleOutline } from "react-icons/io5";
import SubSpinner from "../../../../Components/Spinner/SubSpinner/SubSpinner"; 
import { getStockTransferBySTN_NO } from "../../../../Api/Inventory/StockTransfer/StockTransferAPI";

export const IssuingCompleted = () => {
    const navigate = useNavigate();
    const { STN_NO } = useParams();
    const [loading, setLoading] = useState(true); 
    const [stockTransferDetails, setStockTransferDetails] = useState(null);

    useEffect(() => {
        const fetchStockTransferDetails = async () => {
            setLoading(true);
            try {
                const response = await getStockTransferBySTN_NO(STN_NO);
                setStockTransferDetails(response.data);
            } catch (error) {
                console.error('Error fetching stock transfer details:', error);
            } finally {
                setLoading(false); 
            }
        };

        if (STN_NO) {
            fetchStockTransferDetails();
        }
    }, [STN_NO]);

    const handleButtonClick = () => {
        navigate('/stock-transfer');
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
        "Status",
    ];

    return (
        <>
            <div className="top-nav-blue-text">
                <div className="stockIssuingCompleted-top-link">
                    <Link to="/stock-transfer">
                        <IoChevronBackCircleOutline style={{ fontSize: "22px", color: "#0377A8" }} />
                    </Link>
                    <h4>Stock Transfer IN - Completed</h4>
                </div>
            </div>
            <Layout>
                <div className="stockIssuingCompleted-bodycontainer">
                    <div className="stockIssuingCompleted-filter-container">
                        <div className="stockIssuingCompletedField">
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
                        <div className="SubmittedByField">
                            <InputLabel htmlFor="submittedBy" color="#0377A8">Submitted By</InputLabel>
                            <div className="data-box">
                                <span>{stockTransferDetails?.submittedBy}</span>
                            </div>
                        </div>
                        <div className="RequestedByField">
                            <InputLabel htmlFor="requestedBy" color="#0377A8">Requested By</InputLabel>
                            <div className="data-box">
                                <span>{stockTransferDetails?.requestedBy}</span>
                            </div>
                        </div>
                    </div>
                    <div className="stockIssuingCompleted-content-middle">
                        {loading ? (
                            <SubSpinner /> 
                        ) : stockTransferDetails?.products ? (
                            <TableWithPagi rows={stockTransferDetails.products.map(product => ({
                                "Product Id / Name": `${product.productId} / ${product.productName}`,
                                "Req. Qty": product.requestedQty,
                                "Batch No": product.batches.map(batch => batch.batchNo).join(', '),
                                "Transfer Qty": product.batches.map(batch => batch.transferQty).join(', '),
                                "Unit Price": product.batches.map(batch => batch.unitPrice).join(', '),
                                "Amount": product.batches.map(batch => batch.amount).join(', '),
                                "Status": 'Completed',
                            }))} columns={columns} />
                        ) : (
                            <p>No products available</p>
                        )}
                    </div>
                    <div className="stockIssuingCompleted-BtnSection">
                        <Buttons type="button" id="close-btn" style={{ backgroundColor: "white", color: "black" }} onClick={handleButtonClick}>Close</Buttons>
                        <p className='tot-amount-txt'>Total Amount: <span className="totalAmountValue">Rs: {calculateTotalAmount()}</span></p>
                    </div>
                </div>
            </Layout>
        </>
    );
};

export default IssuingCompleted;
