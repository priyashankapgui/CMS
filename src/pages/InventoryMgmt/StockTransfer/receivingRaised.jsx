import Layout from "../../../Layout/Layout";
import React, { useState, useEffect } from 'react';
import './StockTransferReceiving.css';
import Buttons from '../../../Components/Buttons/SquareButtons/Buttons';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { IoChevronBackCircleOutline } from "react-icons/io5";
import axios from 'axios';
import InputLabel from "../../../Components/Label/InputLabel";
import TableWithPagi from '../../../Components/Tables/TableWithPagi';

export const ReceivingRaised = () => {
    const navigate = useNavigate();
    const { STN_NO } = useParams();
    const [stockTransferDetails, setStockTransferDetails] = useState(null);

    useEffect(() => {
        const fetchStockTransferDetails = async () => {
            try {
                const response = await axios.get(`/stock-transferAllDetails/${STN_NO}`);
                if (response.data.success) {
                    setStockTransferDetails(response.data.data);
                } else {
                    console.error('Failed to fetch stock transfer details:', response.data.message);
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
        navigate('/stock-transfer/OUT');
    };


    const columns = [
        "Product Id / Name",
        "Req. Qty",
        "Status",
    ];

    return (
        <>
            <div className="top-nav-blue-text">
            <div className="stockReceiving-top-link">
                    <Link to="/stock-transfer/OUT">
                        <IoChevronBackCircleOutline style={{ fontSize: "22px", color: "#0377A8" }} />
                    </Link>
                    <h4>Stock Transfer - OUT Raised</h4>
                </div>
                
            </div> 
            <Layout>    
                <div className="viewNewGRN-bodycontainer">
                    <div className="view-grn-filter-container">
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
                        <div className="RequestedByField">
                            <InputLabel htmlFor="requestedBy" color="#0377A8">Requested By</InputLabel>
                            <div className="data-box">
                                <span>{stockTransferDetails?.requestedBy}</span>
                            </div>
                        </div>
                       
                    </div>
                    <div className="GRN-content-middle">
                        {stockTransferDetails?.products ? (
                            <TableWithPagi rows={stockTransferDetails.products.map(product => ({
                                "Product Id / Name": `${product.productId} / ${product.productName}`,
                                "Req. Qty": product.requestedQty,
                                "Status": 'Raised'
                                
                            }))} columns={columns} />
                        ) : (
                            <p>No products available</p>
                        )}
                    </div>
                    <div className="Grn-BtnSection">
                        {/* <Buttons type="button" id="save-btn" style={{ backgroundColor: "#23A3DA", color: "white" }} onClick={handleSave}> Save </Buttons> */}
                        <Buttons type="button" id="close-btn" style={{ backgroundColor: "white", color: "black" }} onClick={handleButtonClick}>Close</Buttons>
                        
                    </div>
                </div>
            </Layout>
        </>
    );
};

export default ReceivingRaised;