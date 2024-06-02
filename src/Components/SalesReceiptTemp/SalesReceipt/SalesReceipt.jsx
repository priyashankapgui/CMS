import React from 'react';
import ReceiptPopup from '../ReceiptPopup/ReceiptPopup';
import './SalesReceipt.css';
import greenleaf from "../../../Assets/greenleaf.svg";
import SugesstionQR from "../../../Assets/qr-code.svg";

const SalesReceipt = ({ billData, onClose }) => {
    if (!billData) {
        return null;
    }

    const { billNo, billedAt, billedBy, customerName, paymentMethod, contactNo, billedItems } = billData;
    
    let totalQuantity = 0;
    let grossTotal = 0;
    let discount = 0;
    let netTotal = 0;
    let received = 5000.00;
    let balance = 0;

    billedItems.forEach(item => {
        totalQuantity += item.quantity;
        grossTotal += item.rate * item.quantity;
    });

    discount = 0.00;
    netTotal = grossTotal - discount;
    balance = received - netTotal;

    const handleReprintReceipt = () => {
        window.print();
    };

    const receiptContent = (
        <div className="sales-receipt">
            <div className="sales-receipt-header">
                <div className="logo">
                    <img className="sales-receipt-sys-logo" src={greenleaf} alt="greenmart logo" />
                </div>
                <div className="sales-receipt-store-details">
                    <h5 className='shopName'>Green Leaf Super Mart</h5>
                    <p className='branchAddress'>No: 30, Main Street, Galle</p>
                    <p className='branchPhone'>091 222 223 1</p>
                    <p className='branchEmail'>galle@greenleaf.com</p>
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
                            <td className='receipt-details-value'>{billNo}</td>
                        </tr>
                        <tr>
                            <td className='receipt-details-label'>Billed At:</td>
                            <td className='receipt-details-value'>{billedAt}</td>
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
                                <th style={{ textAlign: 'center' }}>Price</th>
                                <th style={{ textAlign: 'right' }}>Qty</th>
                                <th style={{ textAlign: 'right' }}>Amount(Rs)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {billedItems.map((item, index) => (
                                <React.Fragment key={index}>
                                    <tr>
                                        <td colSpan={4}>{item.name}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ textAlign: '' }}>{item.productId}</td>
                                        <td style={{ textAlign: 'left' }}>{(item.rate).toFixed(2)}</td>
                                        <td style={{ textAlign: 'right' }}>{(item.quantity).toFixed(2)}</td>
                                        <td style={{ textAlign: 'right' }}>{(item.rate * item.quantity).toFixed(2)}</td>
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
                    <img className="qrImg" src={SugesstionQR} alt="Sugession QR" />
                </div>
                <div className="total">
                    <table className='total-table'>
                        <tbody>
                            <tr>
                                <td>No Qty </td>
                                <td style={{ textAlign: 'right' }}>{totalQuantity}</td>
                            </tr>
                            <tr>
                                <td>Gross Total </td>
                                <td style={{ textAlign: 'right' }}>{grossTotal.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td>Discount </td>
                                <td style={{ textAlign: 'right' }}>{discount.toFixed(2)}</td>
                            </tr>
                            <tr style={{ fontSize: "14px", fontWeight: "bold" }}>
                                <td>Net Total </td>
                                <td style={{ textAlign: 'right' }}>{netTotal.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td>Received </td>
                                <td style={{ textAlign: 'right' }}>{received.toFixed(2)}</td>
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
