import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReceiptPopup from '../../SalesReceiptTemp/ReceiptPopup/ReceiptPopup';
import './StockTraIn.css';
import greenleaf from "../../../Assets/greenleaf.svg";
import SubSpinner from '../../../Components/Spinner/SubSpinner/SubSpinner';

const StockTranIn = ({ STN_NO, onClose }) => {
    const [stockTransferData, setStockTransferData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStockTransferData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:8080/stock-transferAllDetails?STN_NO=${STN_NO}`);
                setStockTransferData(response.data.data);
            } catch (error) {
                console.error("Error fetching stock transfer data:", error);
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

    const StockTranInContent = (
        <div className="StockTranIn-paper-frame">
            {loading ? (
                <div className="loading-container"><SubSpinner /></div>
            ) : (
                <>
                    <div className="StockTranIn-paper-header">
                        <div className="logo">
                            <img className="StockTranIn-paper-sys-logo" src={greenleaf} alt="greenmart logo" />
                            <h4 className='shopName'>Green Leaf Super Mart</h4>
                        </div>
                    </div>
                    <h5 className='StockTranIn-paper-title'>Stock Transfer Note</h5>
                    <div className="StockTranIn-top-details">
                        <div className="StockTranIn-top-details-left">
                            <p>STN No: {stockTransferData?.STN_NO}</p>
                            <p>Request Branch: {stockTransferData?.requestBranch}</p>
                            <p>Created At: {new Date(stockTransferData?.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="StockTranIn-top-details-right">
                            <p>Supplying Branch: {stockTransferData?.supplyingBranch}</p>
                            <p>Submitted By: {stockTransferData?.submittedBy}</p>
                            <p>Status: {stockTransferData?.status}</p>
                        </div>
                    </div>
                    <hr className='invoice-line-top' />

                    <div className="StockTranIn-bodyContent">
                        <table className="StockTranIn-bodyContent-table">
                            <thead>
                                <tr>
                                    <th>Product ID / Name</th>
                                    <th>Requested Qty</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stockTransferData?.products.map((product, index) => (
                                    <tr key={index}>
                                        <td>{product.productId} / {product.productName}</td>
                                        <td>{product.requestedQty}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="StockTranIn-bottomContent">
                        <h5>Total Quantity: {calculateTotalQuantity()}</h5>
                    </div>
                    <div className="StockTranIn-paper-footer">
                        <hr className='invoice-line-top' />
                        <p>© Green Leaf Super Mart - Galle</p>
                        <small>- Page <span className="pageNumber"></span> -</small>
                    </div>
                </>
            )}
        </div>
    );

    return (
        <ReceiptPopup bodyContent={StockTranInContent} onClose={onClose} onPrint={handleReprintReceipt} />
    );
};

export default StockTranIn;
