import React, { useEffect, useState } from 'react';
import './ExpiaryStockDoc.css';
import ReceiptPopup from '../../SalesReceiptTemp/ReceiptPopup/ReceiptPopup';
import SubSpinner from '../../Spinner/SubSpinner/SubSpinner';
import secureLocalStorage from "react-secure-storage";
import { getAlreadyExpStockDocDataByBranch } from '../../../Api//Reporting/ReportingApi';

const ExpiaryStockDoc = ({ selectedBranch, onClose }) => {
    const [expiaryStockData, setExpiaryStockData] = useState([]);
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
                    const response = await getAlreadyExpStockDocDataByBranch(selectedBranch);
                    console.log('Expiry Stock data:', response.data);
                    // Check if response.data is defined and an array
                    const sortedData = response.data && Array.isArray(response.data) ? response.data.sort((a, b) => new Date(a.expDate) - new Date(b.expDate)) : [];
                    setExpiaryStockData(sortedData);
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
        if (expiaryStockData.length === 0) {
            return (
                <div>
                    <p>Good news!. There are no expired items...</p>
                </div>
            );
        }

        const groupedData = expiaryStockData.reduce((acc, item) => {
            if (!acc[item.productId]) {
                acc[item.productId] = [];
            }
            acc[item.productId].push(item);
            return acc;
        }, {});

        let rowNumber = 0;

        return (
            <table className="expiaryStockDoc-bodyContent-table">
                <thead>
                    <tr>
                        <th />
                        <th style={{ textAlign: 'left' }}>Product ID / Name</th>
                        <th style={{ textAlign: 'left' }}>Batch No</th>
                        <th>Available Qty</th>
                        <th style={{ textAlign: 'center' }}>Unit Price</th>
                        <th>Exp Date</th>
                        <th>Dis</th>
                        <th style={{ textAlign: 'right' }}>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(groupedData).map((productId) => {
                        rowNumber += 1;
                        return groupedData[productId].map((item, index) => {
                            const displayNumber = index === 0 ? `${rowNumber}.` : `${rowNumber}.${index + 1}`;
                            return (
                                <tr key={`${item.productId}-${item.batchNo}`}>
                                    <td>{displayNumber}</td>
                                    <td>{item.productId} {item.productName}</td>
                                    <td>{item.batchNo}</td>
                                    <td style={{ textAlign: 'center' }}>{item.totalAvailableQty.toFixed(2)}</td>
                                    <td style={{ textAlign: 'center' }}>{item.sellingPrice.toFixed(2)}</td>
                                    <td style={{ textAlign: 'center' }}>
                                        {new Date(item.expDate).toLocaleDateString('en-GB')}
                                    </td>
                                    <td style={{ textAlign: 'center' }}>{item.discount.toFixed(2)}</td>
                                    <td style={{ textAlign: 'right' }}>
                                        {(item.totalAvailableQty * item.sellingPrice * (1 - item.discount / 100)).toFixed(2)}
                                    </td>
                                </tr>
                            );
                        });
                    })}
                </tbody>
            </table>
        );
    };

    const totalAmount = expiaryStockData.reduce((total, item) => total + (item.totalAvailableQty * item.sellingPrice) * (1 - item.discount / 100), 0).toFixed(2);

    const currentDate = new Date();
    const sixMonthsLater = new Date();
    sixMonthsLater.setMonth(currentDate.getMonth() + 6);

    const expiaryStockDocContent = (
        <div className="expiaryStockDoc-paper-frame">
            <div className="expiaryStockDoc-paper-header">
                <div className="logo">
                    <img className="expiaryStockDoc-paper-sys-logo" src={`${process.env.PUBLIC_URL}/Images/greenleaf.svg`} alt="greenmart logo" />
                    <h4 className='shopName'>Green Leaf Super Mart</h4>
                </div>
            </div>
            <h5 className='expiaryStockDoc-paper-title'>Already Expired Items</h5>
            <div className="expiaryStockDoc-top-details">
                <div className="expiaryStockDoc-top-details-left">
                    <p>Branch: {selectedBranch}</p>
                    <p>Generated At: {currentDate.toLocaleString('en-GB')}</p>
                    <p>Generated By: {userDetails.username}</p>
                </div>
            </div>
            <hr className='invoice-line-top' />
            <div className="expiaryStockDoc-bodyContent">
                {renderTableContent()}
            </div>
            <div className="expiaryStockDoc-bottomContent">
                <h5>Total Amount: {totalAmount}</h5>
            </div>
            <div className="expiaryStockDoc-paper-footer">
                <hr className='doc-line-top' />
                <p>© Green Leaf Super Mart - {selectedBranch}</p>
                <small><span className="pageNumber"></span></small>
            </div>
        </div>
    );

    return (
        <ReceiptPopup bodyContent={expiaryStockDocContent} onClose={onClose} onPrint={handleReprintReceipt} />
    );
};

export default ExpiaryStockDoc;
