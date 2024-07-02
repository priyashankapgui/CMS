import './StockTraOut.css';
import React, { useEffect, useState } from 'react';
import ReceiptPopup from '../../SalesReceiptTemp/ReceiptPopup/ReceiptPopup';
import SubSpinner from '../../../Components/Spinner/SubSpinner/SubSpinner'; 
import { getStockTransferBySTN_NO } from '../../../Api/Inventory/StockTransfer/StockTransferAPI';

const StockTraOut = ({ STN_NO, onClose }) => {
    const [stockTransferData, setStockTransferData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStockTransferData = async () => {
            try {
                setLoading(true);
                const response = await getStockTransferBySTN_NO(STN_NO);
                setStockTransferData(response.data);

            } catch (error) {
                console.error("Error fetching StockTransferData data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStockTransferData();
    }, [STN_NO]);

    const handleReprintReceipt = () => {
        window.print();
    };

    const calculateTotalQuantity = () => {
        return stockTransferData?.products.reduce((total, product) => total + parseFloat(product.requestedQty || 0), 0);
    };

    const StockTranOutContent = (
        <div className="StockTranOut-paper-frame">
            {loading ? (
                <div className="loading-container"><SubSpinner /></div>
            ) : (
                <>
                    <div className="StockTranOut-paper-header">
                        <div className="logo">
                            <img className="StockTranOut-paper-sys-logo" src={`${process.env.PUBLIC_URL}/Images/greenleaf.svg`} alt="greenmart logo" />
                            <h4 className='shopName'>Green Leaf Super Mart</h4>
                        </div>
                    </div>
                    <h5 className='StockTranOut-paper-title'>Good Receive Note</h5>
                    <div className="StockTranOut-top-details">
                        <div className="StockTranOut-top-details-left">
                            <p>STN No: {stockTransferData?.STN_NO}</p>
                            <p>Request Branch: {stockTransferData?.requestBranch}</p>
                            <p>Created At: {new Date(stockTransferData?.createdAt).toLocaleDateString('en-GB')}</p>
                        </div>
                        <div className="StockTranOut-top-details-right">
                            <p>Supplying Branch: {stockTransferData?.supplyingBranch}</p>
                            <p>Status: {stockTransferData?.status}</p>
                            <p>Submitted By: {stockTransferData?.submittedBy || 'N/A'}</p>
                        </div>
                    </div>
                    <hr className='invoice-line-top' />

                    <div className="StockTranOut-bodyContent">
                        <table className="StockTranOut-bodyContent-table">
                            <thead>
                                <tr>
                                    <th />
                                    <th style={{ textAlign: 'left' }}>Product ID / Name</th>
                                    <th style={{ textAlign: 'center' }}>Requested Qty</th>
                                    <th style={{ textAlign: 'center' }}>Batch No</th>
                                    <th style={{ textAlign: 'center' }}>Transfer Qty</th>
                                    <th style={{ textAlign: 'center' }}>Unit Price</th>
                                    <th style={{ textAlign: 'center' }}>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stockTransferData?.products.map((product, index) => (
                                    product.batches.map((batch, batchIndex) => (
                                        <tr key={`${index}-${batchIndex}`}>
                                            <td>{index + 1}.</td>
                                            <td style={{ textAlign: 'left' }}>{product.productId} {product.productName}</td>
                                            <td style={{ textAlign: 'center' }}>{product.requestedQty}</td>
                                            <td style={{ textAlign: 'center' }}>{batch.batchNo}</td>
                                            <td style={{ textAlign: 'center' }}>{batch.transferQty}</td>
                                            <td style={{ textAlign: 'center' }}>{batch.unitPrice}</td>
                                            <td style={{ textAlign: 'center' }}>{batch.amount}</td>
                                        </tr>
                                    ))
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="StockTranOut-bottomContent">
                        <h5>Total Qty:  {calculateTotalQuantity()}</h5>
                    </div>
                    <div className="StockTranOut-paper-footer">
                        <hr className='invoice-line-top' />
                        <p>© Green Leaf Super Mart - {stockTransferData?.branchName}</p>
                        <small><span className="pageNumber"></span></small>
                    </div>
                </>
            )}
        </div>
    );

    return (
        <ReceiptPopup bodyContent={StockTranOutContent} onClose={onClose} onPrint={handleReprintReceipt} />
    );
};

export default StockTraOut;
