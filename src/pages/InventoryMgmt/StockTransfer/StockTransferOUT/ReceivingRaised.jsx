import Layout from "../../../../Layout/Layout";
import React, { useState, useEffect } from 'react';
import './ReceivingRaised.css';
import Buttons from '../../../../Components/Buttons/SquareButtons/Buttons';
import InputLabel from "../../../../Components/Label/InputLabel";
import TableWithPagi from '../../../../Components/Tables/TableWithPagi';
import SubSpinner from "../../../../Components/Spinner/SubSpinner/SubSpinner"; 
import { Link, useNavigate, useParams } from 'react-router-dom';
import { IoChevronBackCircleOutline } from "react-icons/io5";
import { getStockTransferBySTN_NO } from "../../../../Api/Inventory/StockTransfer/StockTransferAPI";

export const ReceivingRaised = () => {
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

    const columns = [
        "Product Id / Name",
        "Req. Qty",
        "Status",
    ];

    return (
        <>
            <div className="top-nav-blue-text">
                <div className="receivingRaised-top-link">
                    <Link to="/stock-transfer">
                        <IoChevronBackCircleOutline style={{ fontSize: "22px", color: "#0377A8" }} />
                    </Link>
                    <h4>Stock Transfer OUT - Raised</h4>
                </div>
            </div> 
            <Layout>    
                <div className="receivingRaised-bodycontainer">
                    <div className="receivingRaised-filter-container">
                        <div className="receivingRaisedField">
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
                    </div>
                    <div className="receivingRaised-content-middle">
                        {loading ? (
                            <SubSpinner /> 
                        ) : stockTransferDetails?.products ? (
                            <TableWithPagi rows={stockTransferDetails.products.map(product => ({
                                "Product Id / Name": `${product.productId} / ${product.productName}`,
                                "Req. Qty": product.requestedQty,
                                "Status": 'Raised'
                            }))} columns={columns} />
                        ) : (
                            <p>No products available</p>
                        )}
                    </div>
                    <div className="receivingRaised-BtnSection">
                        <Buttons type="button" id="close-btn" style={{ backgroundColor: "white", color: "black" }} onClick={handleButtonClick}>Close</Buttons>
                    </div>
                </div>
            </Layout>
        </>
    );
};

export default ReceivingRaised;
