import React, { useEffect, useState } from 'react';
import ReceiptPopup from '../../SalesReceiptTemp/ReceiptPopup/ReceiptPopup';
import './GrnDoc.css';
import SubSpinner from '../../../Components/Spinner/SubSpinner/SubSpinner'; 
import { getGRNByGRN_NO } from '../../../Api/Inventory/GoodReceive/GoodReceiveAPI';

const GrnDoc = ({ GRN_NO, onClose }) => {
    const [GRNData, setGRNData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGRNData = async () => {
            try {
                setLoading(true);
                const response = await getGRNByGRN_NO(GRN_NO);
                setGRNData(response.data);

            } catch (error) {
                console.error("Error fetching GRN data:", error);
            } finally {
                setLoading(false);
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
                <div className="loading-container"><SubSpinner /></div>
            ) : (
                <>
                    <div className="GrnDoc-paper-header">
                        <div className="logo">
                            <img className="GrnDoc-paper-sys-logo" src={`${process.env.PUBLIC_URL}/Images/greenleaf.svg`} alt="greenmart logo" />
                            <h4 className='shopName'>Green Leaf Super Mart</h4>
                        </div>
                    </div>
                    <h5 className='GrnDoc-paper-title'>Good Receive Note</h5>
                    <div className="GrnDoc-top-details">
                        <div className="GrnDoc-top-details-left">
                            <p>Branch: {GRNData?.branchName}</p>
                            <p>GRN No: {GRNData?.GRN_NO}</p>
                            <p>Created At: {new Date(GRNData?.createdAt).toLocaleDateString('en-GB')}</p>
                        </div>
                        <div className="GrnDoc-top-details-right">
                            <p>Invoice No: {GRNData?.invoiceNo}</p>
                            <p>Supplier: {GRNData?.supplierName}</p>
                            {/* <p>Submitted By: {GRNData?.submittedBy || 'N/A'}</p> */}
                        </div>
                    </div>
                    <hr className='invoice-line-top' />

                    <div className="GrnDoc-bodyContent">
                        <table className="GrnDoc-bodyContent-table">
                            <thead>
                                <tr>
                                    <th />
                                    <th style={{ textAlign: 'left' }}>Product ID / Name</th>
                                    <th style={{ textAlign: 'left' }}>Batch No</th>
                                    <th style={{ textAlign: 'center' }}>Purchase Qty</th>
                                    <th style={{ textAlign: 'right' }}>Purchase Price</th>
                                    <th style={{ textAlign: 'right' }}>Selling Price</th>
                                    <th>Free Qty</th>
                                    <th style={{ textAlign: 'right' }}>Exp Date</th>
                                    <th style={{ textAlign: 'right' }}>Amount</th>
                                    <th>Comment</th>
                                </tr>
                            </thead>
                            <tbody>
                                {GRNData?.productGRNs.map((productGRN, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}.</td>
                                        <td style={{ textAlign: 'left' }}>{productGRN.productId} {productGRN.productName}</td>
                                        <td style={{ textAlign: 'left' }}>{productGRN.batchNo}</td>
                                        <td style={{ textAlign: 'center' }}>{productGRN.totalQty}</td>
                                        <td style={{ textAlign: 'right' }}>{productGRN.purchasePrice}</td>
                                        <td style={{ textAlign: 'right' }}>{productGRN.sellingPrice}</td>
                                        <td style={{ textAlign: 'center' }}>{productGRN.freeQty}</td>
                                        <td style={{ textAlign: 'right' }}>{new Date(productGRN.expDate).toLocaleDateString('en-GB')}</td>
                                        <td style={{ textAlign: 'right' }}>{productGRN.amount}</td>
                                        <td style={{ textAlign: 'left' }}>{productGRN.comment}</td>
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
                        <p>© Green Leaf Super Mart - {GRNData?.branchName}</p>
                        <small><span className="pageNumber"></span></small>
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
