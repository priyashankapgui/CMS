// import React, { useState } from 'react';
// import "./RefundReceipt.css";
// import { useParams } from 'react-router-dom';
// import greenleaf from "../../../Assets/greenleaf.svg";
// import SugesstionQR from "../../../Assets/qr-code.svg";
// import ReceiptPopup from '../ReceiptPopup/ReceiptPopup';
// import jsonData from '../../Data.json';

// function RefundReceipt() {
//     const [isPopupOpen, setIsPopupOpen] = useState(true);
//     const { RTBNo } = useParams();
//     const selectedReturnBillData = jsonData.ReturnBillListTableData.find(RTB => RTB.RTBNo === RTBNo);
//     const { billNo, returnedAt, returnedBy, customerName, contactNo } = selectedReturnBillData;
//     const closePopup = () => {
//         setIsPopupOpen(false);
//     };
//     const printReceipt = () => {
//         // Select the body content of the ReceiptPopup and print it
//         const bodyContent = document.querySelector(".bodyContent");
//         if (bodyContent) {
//             const contentToPrint = bodyContent.innerHTML;
//             const originalDocument = document.body.innerHTML;
//             document.body.innerHTML = contentToPrint;
//             window.print();
//             document.body.innerHTML = originalDocument;
//         }
//     };

//     // Calculate total quantity and total amount
//     let totalQuantity = 0;
//     let totalAmount = 0;
//     selectedReturnBillData.returnItems.forEach(item => {
//         totalQuantity += item.quantity;
//         totalAmount += item.rate * item.quantity;
//     });

//     return (
//         <>
//             {isPopupOpen && (
//                 <ReceiptPopup onClose={closePopup} printReceipt={printReceipt} bodyContent={(
//                     <div className="sales-receipt">
//                         <div className="header">
//                             <div className="logo">
//                                 <img className="sys-logo" src={greenleaf} alt="greenmart logo" />
//                             </div>
//                             <div className="store-details">
//                                 <h3 className='shopName'>Green Leaf Super Mart</h3>
//                                 <p className='branchAddress'>No: 30, Main Street, Galle</p>
//                                 <p className='branchPhone'>091 222 223 1</p>
//                                 <p className='branchEmail'>galle@greenleaf.com</p>
//                             </div>
//                         </div>
//                         <hr className='invoice-line-top' />
//                         <h4 className='refund-Txt'>Refund - Receipt</h4>
//                         <hr className='invoice-line-top' />
//                         <div className="info">
//                             <div className="info-section">
//                                 <div className="date"><span>Date: </span>{returnedAt}</div>
//                                 <div className="return-bill-number"><span>RTB No: </span>{RTBNo}</div>
//                                 <div className="bill-number"><span>Bill No: </span>{billNo}</div>
//                             </div>
//                             <div className="info-section">
//                                 <div className="user-details"><span>User: </span>{returnedBy}</div>
//                                 <div className="customer-name"><span>Customer Name: </span>{customerName} </div>
//                                 <div className="customer-contact"><span>Contact No: </span> {contactNo} </div>
//                             </div>
//                         </div>
//                         <hr className='invoice-line' />
//                         <div className="items">
//                             <table className='item-table'>
//                                 <thead>
//                                     <tr>
//                                         <th>Item</th>
//                                         <th style={{ textAlign: 'center' }}>Price</th>
//                                         <th style={{ textAlign: 'center' }}>Qty</th>
//                                         <th style={{ textAlign: 'right' }}>Amount(Rs)</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {selectedReturnBillData.returnItems.map((item, index) => (
//                                         <tr key={index}>
//                                             <td>{item.name}</td>
//                                             <td style={{ textAlign: 'right' }}>{item.rate}</td>
//                                             <td style={{ textAlign: 'right' }}>{item.quantity}</td>
//                                             <td style={{ textAlign: 'right' }}>{(item.rate * item.quantity).toFixed(2)}</td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                         <hr className='invoice-line' />
//                         <div className="billMiddle">
//                             <div className="inquaryQR">
//                                 For any  inquiry
//                                 <small>Scan me</small>
//                                 <img className="qrImg" src={SugesstionQR} alt="Sugession QR" />
//                             </div>
//                             <div className="total">
//                                 <table className='total-table'>
//                                     <tbody>
//                                         <tr>
//                                             <td>No Qty </td>
//                                             <td style={{ textAlign: 'left' }}>{totalQuantity}</td>
//                                         </tr>
//                                         <tr style={{ fontSize: "16px", fontWeight: "bold" }}>
//                                             <td>Total</td>
//                                             <td style={{ textAlign: 'left' }}>{totalAmount.toFixed(2)}</td>
//                                         </tr>
//                                     </tbody>
//                                 </table>
//                             </div>
//                         </div>
//                         <hr className='invoice-line-top' />
//                         <div className="footer">
//                             <h5> Sorry for the inconvenience.</h5>
//                             <p> © <span style={{ fontFamily: "Princess Sofia, cursive" }}> Flex Flow -</span>Powered By HexaCode Solutions Pvt Ltd.</p>
//                             <hr className='invoice-line' />
//                             <p className='special-note'> Please use this bill as a reference if you have any price discrepancies, refunds or product returns. Only applicable for 7 days from today.</p>
//                         </div>
//                     </div>
//                 )} />
//             )}
//         </>
//     );
// }

// export default RefundReceipt;


import React from 'react';
import ReceiptPopup from '../ReceiptPopup/ReceiptPopup';
import './RefundReceipt.css';
import greenleaf from "../../../Assets/greenleaf.svg";
import SugesstionQR from "../../../Assets/qr-code.svg";

const RefundReceipt = ({ ReturnBillData, onClose }) => {
    if (!ReturnBillData) {
        return null;
    }

    const { billNo,RTBNo , returnedAt, returnedBy, customerName, contactNo,ReturnedItems } = ReturnBillData;

    let totalQuantity = 0;
    let grossTotal = 0;
    let discount = 0;
    let netTotal = 0;
    let received = 5000.00;
    let balance = 0;

    ReturnBillData.forEach(item => {
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
            <h5 className='payemnt-receipt-Txt'>Refund - Receipt</h5>
            <hr className='invoice-line-top' />
            <div className="receipt-content">
                <table className='receipt-details-table'>
                    <tbody>
                        <tr>
                            <td className='receipt-details-label'>RTB No:</td>
                            <td className='receipt-details-value'>{RTBNo}</td>
                        </tr>
                        <tr>
                            <td className='receipt-details-label'>Bill No:</td>
                            <td className='receipt-details-value'>{billNo}</td>
                        </tr>
                        <tr>
                            <td className='receipt-details-label'>Returned At:</td>
                            <td className='receipt-details-value'>{returnedAt}</td>
                        </tr>
                        <tr>
                            <td className='receipt-details-label'>User:</td>
                            <td className='receipt-details-value'>{returnedBy}</td>
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
                            {ReturnBillData.returnItems.map((item, index) => (
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

                            <tr style={{ fontSize: "14px", fontWeight: "bold" }}>
                                <td>Total Amount </td>
                                <td style={{ textAlign: 'right' }}></td>
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

export default RefundReceipt;
