import React, { useEffect, useState } from 'react';
import './StockSummeryDoc.css';
import ReceiptPopup from '../../SalesReceiptTemp/ReceiptPopup/ReceiptPopup';
import SubSpinner from '../../Spinner/SubSpinner/SubSpinner';
import secureLocalStorage from "react-secure-storage";
import { getStockSummeryDocDataByBranch } from '../../../Api//Reporting/ReportingApi';

const StockSummeryDoc = ({ selectedBranch, onClose }) => {
    const [stockSummeryData, setStockSummeryData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userDetails, setUserDetails] = useState({
        username: ""
    });

    useEffect(() => {
        const fetchStockData = async () => {
            if (selectedBranch) {
                setIsLoading(true);
                setError(null);
                try {
                    const response = await getStockSummeryDocDataByBranch(selectedBranch);
                    console.log('Stock data:', response.data);
                    setStockSummeryData(response.data || []); // Assuming response.data is an array
                } catch (error) {
                    console.error('Error fetching stock data:', error);
                    setError(error.response ? error.response.data : { message: error.message });
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchStockData();
    }, [selectedBranch]);

    useEffect(() => {
        const userJSON = secureLocalStorage.getItem("user");
        if (userJSON) {
            const user = JSON.parse(userJSON);
            setUserDetails({
                username: user?.userName || user?.employeeName || "",
            });
        }
    }, []);

    const handleReprintReceipt = () => {
        window.print();
    };

    const renderTableContent = () => {
        if (isLoading) {
            return <SubSpinner />;
        }
        if (error) {
            return (
                <div>
                    <p>Error fetching data: {error.message}</p>
                    {error.error && <p>Details: {error.error}</p>}
                </div>
            );
        }
        if (stockSummeryData.length === 0) {
            return <p>No stock data available.</p>;
        }
        return (
            <table className="stockSummeryDoc-bodyContent-table">
                <thead>
                    <tr>
                        <th />
                        <th style={{ textAlign: 'left' }}>Product ID / Name</th>
                        <th style={{ textAlign: 'left' }}>Batch No</th>
                        <th>Available Qty</th>
                        <th style={{ textAlign: 'center' }}>Unit Price</th>
                        <th>Exp Date</th>
                        <th>Dis% </th>
                        <th style={{ textAlign: 'right' }}>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {stockSummeryData.map((item, index) => (
                        <tr key={index}>
                            <td>{index + 1}.</td>
                            <td>{item.productId} {item.productName}</td>
                            <td>{item.batchNo}</td>
                            <td style={{ textAlign: 'center' }}>{item.totalAvailableQty.toFixed(3)}</td>
                            <td style={{ textAlign: 'center' }}>{item.sellingPrice.toFixed(2)}</td>
                            <td style={{ textAlign: 'center' }}>
                                {new Date(item.expDate).toLocaleDateString('en-GB')}
                            </td>
                            <td style={{ textAlign: 'center' }}>{item.discount}</td>
                            <td style={{ textAlign: 'right' }}>
                                {(item.totalAvailableQty * item.sellingPrice * (1 - item.discount / 100)).toFixed(2)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    const totalAmount = stockSummeryData.reduce((total, item) => total + (item.totalAvailableQty * item.sellingPrice) * (1 - item.discount / 100), 0).toFixed(2);

    const StockSummeryDocContent = (
        <div className="stockSummeryDoc-paper-frame">
            <div className="stockSummeryDoc-paper-header">
                <div className="logo">
                    <img className="stockSummeryDoc-paper-sys-logo" src={`${process.env.PUBLIC_URL}/Images/greenleaf.svg`} alt="greenmart logo" />
                    <h4 className='shopName'>Green Leaf Super Mart</h4>
                </div>
            </div>
            <h5 className='stockSummeryDoc-paper-title'>Stock Summary</h5>
            <div className="stockSummeryDoc-top-details">
                <div className="stockSummeryDoc-top-details-left">
                    <p>Branch: {selectedBranch}</p>
                    <p>Generated At: {new Date().toLocaleString('en-GB')}</p>
                    <p>Generated By: {userDetails.username}</p>
                </div>
            </div>
            <hr className='invoice-line-top' />
            <div className="stockSummeryDoc-bodyContent">
                {renderTableContent()}
            </div>
            <div className="stockSummeryDoc-bottomContent">
                <h5>Total Amount: {totalAmount}</h5>
            </div>
            <div className="stockSummeryDoc-paper-footer">
                <hr className='invoice-line-top' />
                <p>© Green Leaf Super Mart - {selectedBranch}</p>
                <small><span className="pageNumber"></span></small>
            </div>

        </div>
    );

    return (
        <ReceiptPopup bodyContent={StockSummeryDocContent} onClose={onClose} onPrint={handleReprintReceipt} />
    );
};

export default StockSummeryDoc;
