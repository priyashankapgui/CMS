import React, { useState, useEffect } from 'react';
import './ViewGRN.css';
import Layout from "../../../Layout/Layout";
import Buttons from '../../../Components/Buttons/SquareButtons/Buttons';
import InputLabel from "../../../Components/Label/InputLabel";
import TableWithPagi from '../../../Components/Tables/TableWithPagi';
import SubSpinner from '../../../Components/Spinner/SubSpinner/SubSpinner'; 
import { Link, useNavigate, useParams } from 'react-router-dom';
import { IoChevronBackCircleOutline } from "react-icons/io5";
import { getGRNByGRN_NO } from '../../../Api/Inventory/GoodReceive/GoodReceiveAPI';

export function ViewGRN() {
    const { GRNNo } = useParams();
    const [GRNData, setGRNData] = useState(null);
    const [loading, setLoading] = useState(true); 
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGRNData = async () => {
            try {
                setLoading(true); 
                const response = await getGRNByGRN_NO(GRNNo);
                setGRNData(response.data);
            } catch (error) {
                console.error("Error fetching GRN data:", error);
            } finally {
                setLoading(false); 
            }
        };

        fetchGRNData();
    }, [GRNNo]);

    const handleButtonClick = () => {
        navigate('/good-receive');
    };

    const calculateTotalAmount = () => {
        return GRNData?.productGRNs.reduce((total, productGRN) => total + parseFloat(productGRN.amount || 0), 0).toFixed(2);
    };

    const columns = [
        "Product ID / Name",
        "Batch No",
        "Qty",
        "Purchase Price",
        "Selling Price",
        "Free Qty",
        "Exp Date",
        "Amount",
        "Comment"
    ];

    const rows = GRNData ? GRNData.productGRNs.map(productGRN => ({
        productId: `${productGRN.productId} / ${productGRN.productName}`,
        batchNo: productGRN.batchNo,
        totalQty: productGRN.totalQty,
        purchasePrice: productGRN.purchasePrice,
        sellingPrice: productGRN.sellingPrice,
        freeQty: productGRN.freeQty,
        expDate: productGRN.expDate,
        amount: productGRN.amount,
        comment: productGRN.comment
    })) : [];

    return (
        <>
            <div className="top-nav-blue-text">
                <div className="view-grn-top-link">
                    <Link to="/good-receive">
                        <IoChevronBackCircleOutline style={{ fontSize: "22px", color: "#0377A8" }} />
                    </Link>
                    <h4>View GRN</h4>
                </div>
            </div>
            <Layout>
                <div className="ViewNewGRN-bodycontainer">
                    {loading ? (
                        <div className="loading-container"><SubSpinner /></div> 
                    ) : (
                        <>
                            <div className="view-grn-filter-container">
                                <div className="branchField">
                                    <InputLabel htmlFor="branchName" color="#0377A8">Branch ID / Name</InputLabel>
                                    <div className="viewGRNdata-box">
                                        <span>{GRNData?.branchName}</span>
                                    </div>
                                </div>

                                <div className="InvoiceNoField">
                                    <InputLabel htmlFor="invoiceNo" color="#0377A8">Invoice No</InputLabel>
                                    <div className="viewGRNdata-box">
                                        <span>{GRNData?.invoiceNo}</span>
                                    </div>
                                </div>
                                <div className="SupplierField">
                                    <InputLabel htmlFor="supplierName" color="#0377A8">Supplier ID / Name</InputLabel>
                                    <div className="viewGRNdata-box">
                                        <span>{GRNData?.supplierName}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="ViewGRN-content-middle">
                                <TableWithPagi rows={rows} columns={columns} />
                            </div>
                            <div className="Grn-BtnSection">
                                <Buttons type="button" id="close-btn" style={{ backgroundColor: "white", color: "black" }} onClick={handleButtonClick}>Close</Buttons>
                                <p className='tot-amount-txt'>Total Amount: <span className="totalAmountValue">Rs: {calculateTotalAmount()}</span></p>
                            </div>
                        </>
                    )}
                </div>
            </Layout>
        </>
    );
};

export default ViewGRN;
