import React from 'react';
import "./SalesReceipt.css";
import greenleaf from "../../Assets/greenleaf.svg";
import itemsData from "../../Components/Data.json"; 

function SalesReceipt() {
    return (
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
                    <div className="date"><span style={{ fontWeight: "500" }}>Date: </span>14.03.2023 18:02</div>
                    <div className="bill-number"><span style={{ fontWeight: "500" }}>Bill No: </span>1172-22230039</div>
                    <div className="user-details"><span style={{ fontWeight: "500" }}>User: </span>Pramu Alwis</div>
                </div>
                <div className="info-section">
                    <div className="customer-name"><span style={{ fontWeight: "500" }}>Customer Name: </span>  </div>
                    <div className="customer-contact"><span style={{ fontWeight: "500" }}>Contact No: </span>    </div>
                    <div className="payment-method"><span style={{ fontWeight: "500" }}>Payment Method: </span>Cash    </div>
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
                        {itemsData.biiReceiptsData.map((item, index) => (
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
            <div className="total">
                <table>
                    <tbody>
                        <tr>
                            <td>No Qty: </td>
                            <td style={{ textAlign: 'left' }}>04</td>
                        </tr>
                        <tr>
                            <td>Gross Total: </td>
                            <td style={{ textAlign: 'left' }}>4811.00</td>
                        </tr>
                        <tr>
                            <td>Discount: </td>
                            <td style={{ textAlign: 'left' }}>0.00</td>
                        </tr>
                        <tr style={{ fontSize: "16px", fontWeight: "bold" }}>
                            <td>Net Total: </td>
                            <td style={{ textAlign: 'left' }}>4811.00</td>
                        </tr>
                        <tr>
                            <td>Received: </td>
                            <td style={{ textAlign: 'left' }}>5000.00</td>
                        </tr>
                        <tr>
                            <td>Balance: </td>
                            <td style={{ textAlign: 'left' }}>189.00</td>
                        </tr>
                    </tbody>
                </table>
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
}

export default SalesReceipt;
