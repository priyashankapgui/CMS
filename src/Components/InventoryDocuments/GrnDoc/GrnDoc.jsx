import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReceiptPopup from '../../SalesReceiptTemp/ReceiptPopup/ReceiptPopup';
import './GrnDoc.css';
import greenleaf from "../../../Assets/greenleaf.svg";
import SubSpinner from '../../../Components/Spinner/SubSpinner/SubSpinner'; // Import the spinner

const GrnDoc = ({ GRN_NO, onClose }) => {
    console.log("data ohh",GRN_NO);
    const [GRNData, setGRNData] = useState(null);
    const [loading, setLoading] = useState(true); // Add loading state

    useEffect(() => {
        const fetchGRNData = async () => {
            try {
                setLoading(true); // Start loading
                const response = await axios.get(`http://localhost:8080/grn-all?GRN_NO=${GRN_NO}`);
                setGRNData(response.data.data);
                
            } catch (error) {
                console.error("Error fetching GRN data:", error);
            } finally {
                setLoading(false); // Stop loading
            }
        };

        fetchGRNData();
    }, [GRN_NO]);

    const handleReprintReceipt = () => {
        window.print();
    };

    const calculateTotalAmount = () => {
        return GRNData?.productGRNs.reduce((total, productGRN) => total + parseFloat(productGRN.amount || 0), 0).toFixed(2);
    };

    const GrnDocContent = (
        <div className="GrnDoc-paper-frame">
            {loading ? (
                <div className="loading-container"><SubSpinner /></div> // Show spinner while loading
            ) : (
                <>
                    <div className="GrnDoc-paper-header">
                        <div className="logo">
                            <img className="GrnDoc-paper-sys-logo" src={greenleaf} alt="greenmart logo" />
                            <h4 className='shopName'>Green Leaf Super Mart</h4>
                        </div>
                    </div>
                    <h5 className='GrnDoc-paper-title'>Good Receive Note</h5>
                    <div className="GrnDoc-top-details">
                        <div className="GrnDoc-top-details-left">
                            <p>GRN No: {GRNData?.GRN_NO}</p>
                            <p>Branch: {GRNData?.branchName}</p>
                            <p>Created At: {new Date(GRNData?.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="GrnDoc-top-details-right">
                            <p>Invoice No: {GRNData?.invoiceNo}</p>
                            <p>Supplier: {GRNData?.supplierName}</p>
                            <p>Submitted By: {GRNData?.submittedBy || 'N/A'}</p>
                        </div>
                    </div>
                    <hr className='invoice-line-top' />

                    <div className="GrnDoc-bodyContent">
                        <table className="GrnDoc-bodyContent-table">
                            <thead>
                                <tr>
                                    <th>Product ID / Name</th>
                                    <th>Batch No</th>
                                    <th>Qty</th>
                                    <th>Purchase Price</th>
                                    <th>Selling Price</th>
                                    <th>Free Qty</th>
                                    <th>Exp Date</th>
                                    <th>Amount</th>
                                    <th>Comment</th>
                                </tr>
                            </thead>
                            <tbody>
                                {GRNData?.productGRNs.map((productGRN, index) => (
                                    <tr key={index}>
                                        <td>{productGRN.productId} / {productGRN.productName}</td>
                                        <td>{productGRN.batchNo}</td>
                                        <td>{productGRN.totalQty}</td>
                                        <td>{productGRN.purchasePrice}</td>
                                        <td>{productGRN.sellingPrice}</td>
                                        <td>{productGRN.freeQty}</td>
                                        <td>{new Date(productGRN.expDate).toLocaleDateString()}</td>
                                        <td>{productGRN.amount}</td>
                                        <td>{productGRN.comment}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="GrnDoc-bottomContent">
                        <h5>Total Amount: Rs {calculateTotalAmount()}</h5>
                    </div>
                    <div className="GrnDoc-paper-footer">
                        <hr className='invoice-line-top' />
                        <p>© Green Leaf Super Mart - Galle</p>
                        <small>- Page <span className="pageNumber"></span> -</small>
                    </div>
                </>
            )}
        </div>
    );

    return (
        <ReceiptPopup bodyContent={GrnDocContent} onClose={onClose} onPrint={handleReprintReceipt} />
    );
};

export default GrnDoc;
