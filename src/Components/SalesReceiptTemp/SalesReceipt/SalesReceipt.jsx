import React, { useState } from 'react';
import "./SalesReceipt.css";
import { useParams } from 'react-router-dom';
import greenleaf from "../../../Assets/greenleaf.svg";
import SugesstionQR from "../../../Assets/qr-code.svg";
import ReceiptPopup from '../ReceiptPopup/ReceiptPopup';
import jsonData from '../../Data.json';

function SalesReceipt() {
    const [isPopupOpen, setIsPopupOpen] = useState(true);
    const { billNo } = useParams();
    const selectedBillData = jsonData.worklistTableData.find(bill => bill.billNo === billNo);
    const { billedAt, billedBy, customerName, paymentMethod, contactNo } = selectedBillData;
    const closePopup = () => {
        setIsPopupOpen(false);
    };
    const printReceipt = () => {
        // Select the body content of the ReceiptPopup and print it
        const bodyContent = document.querySelector(".bodyContent");
        if (bodyContent) {
            const contentToPrint = bodyContent.innerHTML;
            const originalDocument = document.body.innerHTML;
            document.body.innerHTML = contentToPrint;
            window.print();
            document.body.innerHTML = originalDocument;
        }
    };

    // Calculate total quantity, gross total, discount, net total, and balance
    let totalQuantity = 0;
    let grossTotal = 0;
    let discount = 0;
    let netTotal = 0;
    let received = 5000.00; // Assuming received amount is fixed for now
    let balance = 0;

    selectedBillData.billedItems.forEach(item => {
        totalQuantity += item.quantity;
        grossTotal += item.rate * item.quantity;
    });

    // Calculation of discount, net total, and balance depends on your business logic
    // For now, let's assume some fixed values
    discount = 0.00;
    netTotal = grossTotal - discount;
    balance = received - netTotal;

    return (
        <>
            {isPopupOpen && (
                <ReceiptPopup onClose={closePopup} printReceipt={printReceipt} bodyContent={(
                    <div className="sales-receipt">
                        <div className="header">
                            <div className="logo">
                                <img className="sys-logo" src={greenleaf} alt="greenmart logo" />
                            </div>
                            <div className="store-details">
                                <h3 className='shopName'>Green Leaf Super Mart</h3>
                                <p className='branchAddress'>No: 30, Main Street, Galle</p>
                                <p className='branchPhone'>091 222 223 1</p>
                                <p className='branchEmail'>galle@greenleaf.com</p>
                            </div>
                        </div>
                        <hr className='invoice-line-top' />
                        <div className="info">
                            <div className="info-section">
                                <div className="date"><span>Date: </span>{billedAt}</div>
                                <div className="bill-number"><span>Bill No: </span>{billNo}</div>
                                <div className="user-details"><span>User: </span>{billedBy}</div>
                            </div>
                            <div className="info-section">
                                <div className="customer-name"><span>Customer Name: </span> {customerName} </div>
                                <div className="customer-contact"><span>Contact No: </span>{contactNo}</div>
                                <div className="payment-method"><span>Payment Method: </span>{paymentMethod}</div>
                            </div>
                        </div>
                        <hr className='invoice-line' />
                        <div className="items">
                            <table className='item-table'>
                                <thead>
                                    <tr>
                                        <th>Item</th>
                                        <th style={{ textAlign: 'center' }}>Price</th>
                                        <th style={{ textAlign: 'center' }}>Qty</th>
                                        <th style={{ textAlign: 'right' }}>Amount(Rs)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedBillData.billedItems.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.name}</td>
                                            <td style={{ textAlign: 'right' }}>{item.rate}</td>
                                            <td style={{ textAlign: 'right' }}>{item.quantity}</td>
                                            <td style={{ textAlign: 'right' }}>{(item.rate * item.quantity).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <hr className='invoice-line' />
                        <div className="billMiddle">
                            <div className="inquaryQR">
                                For any  inquiry
                                <small>Scan me</small>
                                <img className="qrImg" src={SugesstionQR} alt="Sugession QR" />
                            </div>
                            <div className="total">
                                <table className='total-table'>
                                    <tbody>
                                        <tr>
                                            <td>No Qty </td>
                                            <td style={{ textAlign: 'left' }}>{totalQuantity}</td>
                                        </tr>
                                        <tr>
                                            <td>Gross Total </td>
                                            <td style={{ textAlign: 'left' }}>{grossTotal.toFixed(2)}</td>
                                        </tr>
                                        <tr>
                                            <td>Discount </td>
                                            <td style={{ textAlign: 'left' }}>{discount.toFixed(2)}</td>
                                        </tr>
                                        <tr style={{ fontSize: "16px", fontWeight: "bold" }}>
                                            <td>Net Total </td>
                                            <td style={{ textAlign: 'left' }}>{netTotal.toFixed(2)}</td>
                                        </tr>
                                        <tr>
                                            <td>Received </td>
                                            <td style={{ textAlign: 'left' }}>{received.toFixed(2)}</td>
                                        </tr>
                                        <tr>
                                            <td>Balance </td>
                                            <td style={{ textAlign: 'left' }}>{balance.toFixed(2)}</td>
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
                )} />
            )}
        </>
    );
}

export default SalesReceipt;
