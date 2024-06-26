import React, { useState, useEffect } from 'react';
import ReceiptPopup from '../ReceiptPopup/ReceiptPopup';
import './SalesReceipt.css';
import axios from 'axios';


// const mybill = process.env.REACT_APP_BILLRECEIPT_DATA_API;


const SalesReceipt = ({ billNo, onClose }) => {
    console.log('SalesReceipt component rendered');
    const [billData, setBillData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!billNo) {
                    return;
                }

                const response = await axios.get(`http://localhost:8080/bills-all?billNo=${billNo}`);
                console.log('Bill', response);
                const responseData = response.data.data;

                if (responseData) {
                    setBillData(responseData);
                } else {
                    console.error('Bill not found');
                }
            } catch (error) {
                console.error(error.message);
            }
        };

        fetchData();
    }, [billNo]);

    if (!billData) {
        return null;
    }

    const { billNo: selectedBillNo, branchAddress, branchPhone, branchEmail, billedBy, createdAt, customerName, paymentMethod, contactNo, billTotalAmount, receivedAmount, billProducts } = billData;

    let grossTotal = 0;
    let balance = 0;

    billProducts.forEach(item => {
        grossTotal += (item.sellingPrice || 0) * (item.billQty || 0);
    });

    balance = receivedAmount - billTotalAmount;

    const handleReprintReceipt = () => {
        window.print();
    };

    const receiptContent = (
        <div className="sales-receipt">
            <div className="sales-receipt-header">
                <div className="logo">
                    <img className="sales-receipt-sys-logo" src={`${process.env.PUBLIC_URL}/Images/greenleaf.svg`} alt="greenmart logo" />
                </div>
                <div className="sales-receipt-store-details">
                    <h5 className='shopName'>Green Leaf Super Mart</h5>
                    <p className='branchAddress'>{branchAddress}</p>
                    <p className='branchPhone'>{branchPhone}</p>
                    <p className='branchEmail'>{branchEmail}</p>
                </div>
            </div>
            <hr className='invoice-line-top' />
            <h5 className='payemnt-receipt-Txt'>Payment - Receipt</h5>
            <hr className='invoice-line-top' />
            <div className="receipt-content">
                <table className='receipt-details-table'>
                    <tbody>
                        <tr>
                            <td className='receipt-details-label'>Bill No:</td>
                            <td className='receipt-details-value'>{selectedBillNo}</td>
                        </tr>
                        <tr>
                            <td className='receipt-details-label'>Billed At:</td>
                            <td className='receipt-details-value'>{new Date(createdAt).toLocaleString()}</td>
                        </tr>
                        <tr>
                            <td className='receipt-details-label'>User:</td>
                            <td className='receipt-details-value'>{billedBy}</td>
                        </tr>
                        <tr>
                            <td className='receipt-details-label'>Payment Method:</td>
                            <td className='receipt-details-value'>{paymentMethod}</td>
                        </tr>
                        <tr>
                            <td className='receipt-details-label'>Name:</td>
                            <td className='receipt-details-value'>{customerName}</td>
                        </tr>
                        <tr>
                            <td className='receipt-details-label'>Phone:</td>
                            <td className='receipt-details-value'>{contactNo}</td>
                        </tr>
                    </tbody>
                </table>

                <hr className='invoice-line' />
                <div className="items">
                    <table className='item-table'>
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th style={{ textAlign: 'center' }}>Qty</th>
                                <th style={{ textAlign: 'right' }}>Dis%</th>
                                <th style={{ textAlign: 'right' }}>Amount(Rs)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {billProducts.map((item, index) => (
                                <React.Fragment key={index}>
                                    <tr>
                                        <td colSpan={4}>{index + 1}. {item.productName}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ textAlign: 'left' }}>{(item.sellingPrice || 0).toFixed(2)}</td>
                                        <td style={{ textAlign: 'center' }}>{(item.billQty || 0).toFixed(3)}</td>
                                        <td style={{ textAlign: 'right' }}>{(item.discount || 0).toFixed(2)}</td>
                                        <td style={{ textAlign: 'right' }}>{((item.sellingPrice || 0) * (item.billQty || 0) * (1 - (item.discount) / 100)).toFixed(2)}</td>
                                    </tr>
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <hr className='invoice-line' />
            <div className="billMiddle">
                <div className="inquaryQR">
                    For any inquiry
                    <small>Scan me</small>
                    <img className="qrImg" src={`${process.env.PUBLIC_URL}/Images/qr-code.svg`}  alt="Sugession QR" />
                </div>
                <div className="total">
                    <table className='total-table'>
                        <tbody>
                            <tr>
                                <td>No Items </td>
                                <td style={{ textAlign: 'right' }}>{billProducts.length}</td>
                            </tr>
                            <tr>
                                <td>Gross Total </td>
                                <td style={{ textAlign: 'right' }}>{grossTotal.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td>Discount </td>
                                <td style={{ textAlign: 'right' }}>{(grossTotal - billTotalAmount).toFixed(2)}</td>
                            </tr>
                            <tr style={{ fontSize: "14px", fontWeight: "bold" }}>
                                <td>Net Total </td>
                                <td style={{ textAlign: 'right' }}>{billTotalAmount.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td>Received </td>
                                <td style={{ textAlign: 'right' }}>{receivedAmount.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td>Balance </td>
                                <td style={{ textAlign: 'right' }}>{balance.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <hr className='invoice-line-top' />
            <div className="footer">
                <h5> Thank you, Come again!</h5>
                <p> © <span style={{ fontFamily: "Princess Sofia, cursive" }}> Flex Flow -</span>Powered By HexaCode Solutions Pvt Ltd.</p>
                <hr className='invoice-line' />
                <p className='special-note'> Please use this bill as a reference if you have any price discrepancies, refunds or product returns. Only applicable for 7 days from today.</p>
            </div>
        </div>
    );

    return (
        <ReceiptPopup bodyContent={receiptContent} onClose={onClose} onPrint={handleReprintReceipt} />
    );
};

export default SalesReceipt;
