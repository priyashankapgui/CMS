import Layout from "../../../Layout/Layout";
import React, { useState, useEffect } from 'react';
import './Cancelled.css';
import Buttons from '../../../Components/Buttons/SquareButtons/Buttons';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { IoChevronBackCircleOutline } from "react-icons/io5";
import InputLabel from "../../../Components/Label/InputLabel";
import TableWithPagi from '../../../Components/Tables/TableWithPagi';
import { getStockTransferBySTN_NO } from "../../../Api/Inventory/StockTransfer/StockTransferAPI";

export const IssuingCancelled = () => {
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


    const columns = [
        "Product Id / Name",
        "Req. Qty",
        "Status",
    ];

    return (
        <>
            <div className="top-nav-blue-text">
            <div className="stockCancel-top-link">
                    <Link to="/stock-transfer">
                        <IoChevronBackCircleOutline style={{ fontSize: "22px", color: "#0377A8" }} />
                    </Link>
                    <h4>Stock Transfer IN - Cancelled</h4>
                </div>
                
            </div>
            <Layout>
                <div className="stockCancel-bodycontainer">
                    <div className="stockCancel-filter-container">
                        <div className="stockCancelField">
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
                        <div className="RequestedByField">
                            <InputLabel htmlFor="requestedBy" color="#0377A8">Requested By</InputLabel>
                            <div className="data-box">
                                <span>{stockTransferDetails?.requestedBy}</span>
                            </div>
                        </div>
                        <div className="CancelledByField">
                            <InputLabel htmlFor="cancelledBy" color="#0377A8">Cancelled By</InputLabel>
                            <div className="data-box">
                                <span>{stockTransferDetails?.submittedBy}</span>
                            </div>
                        </div>
                    </div>
                    <div className="stockCancel-content-middle">
                        {stockTransferDetails?.products ? (
                            <TableWithPagi rows={stockTransferDetails.products.map(product => ({
                                "Product Id / Name": `${product.productId} / ${product.productName}`,
                                "Req. Qty": product.requestedQty,
                                "Status": 'Cancelled'
                                
                            }))} columns={columns} />
                        ) : (
                            <p>No products available</p>
                        )}
                    </div>
                    <div className="stockCancel-BtnSection">
                        <Buttons type="button" id="close-btn" style={{ backgroundColor: "white", color: "black" }} onClick={handleButtonClick}>Close</Buttons>
                        
                    </div>
                </div>
            </Layout>
        </>
    );
};

export default IssuingCancelled;
