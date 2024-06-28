import React, { useState, useEffect } from 'react';
import ReceiptPopup from '../ReceiptPopup/ReceiptPopup';
import './RefundReceipt.css';
import { getRefundedBillData } from '../../../Api/Billing/SalesApi';


const RefundReceipt = ({ RTBNo, onClose }) => {

    console.log('Refund Receipt component rendered');

    const [refundBillData, setRefundBillData] = useState(null);
;

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!RTBNo) {
                    return;
                }

                const response = await getRefundedBillData(RTBNo);
                console.log('Refund Bill Data', response);

                if (response.data) {
                    setRefundBillData(response.data);
                } else {
                    console.error('Refund Bill not found');
                }
            } catch (error) {
                console.error(error.message);
            }
        };

        fetchData();
    }, [RTBNo]);


    if (!refundBillData) {
        return null;
    }

    const { RTBNo: selectedRTBNo, billNo, branchAddress, branchPhone, branchEmail, returnedBy, createdAt, customerName, contactNo, refundTotalAmount, refundBillProducts } = refundBillData;


    const handleReprintReceipt = () => {
        window.print();
    };

    const refundReceiptContent = (
        <div className="refund-receipt">
            <div className="refund-receipt-header">
                <div className="logo">
                    <img className="refund-receipt-sys-logo" src={`${process.env.PUBLIC_URL}/Images/greenleaf.svg`} alt="greenmart logo" />
                </div>
                <div className="refund-receipt-store-details">
                    <h5 className='shopName'>Green Leaf Super Mart</h5>
                    <p className='branchAddress'>{branchAddress}</p>
                    <p className='branchPhone'>{branchPhone}</p>
                    <p className='branchEmail'>{branchEmail}</p>
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
                            <td className='receipt-details-value'>{selectedRTBNo}</td>
                        </tr>
                        <tr>
                            <td className='receipt-details-label'>Bill No:</td>
                            <td className='receipt-details-value'>{billNo}</td>
                        </tr>
                        <tr>
                            <td className='receipt-details-label'>User:</td>
                            <td className='receipt-details-value'>{returnedBy}</td>
                        </tr>
                        <tr>
                            <td className='receipt-details-label'>Returned At:</td>
                            <td className='receipt-details-value'>{new Date(createdAt).toLocaleString()}</td>
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
                <div className="refund-items">
                    <table className='refund-items-table'>
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th style={{ textAlign: 'center' }}>Qty</th>
                                <th style={{ textAlign: 'right' }}>Dis%</th>
                                <th style={{ textAlign: 'right' }}>Amount(Rs)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {refundBillProducts.map((item, index) => (
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
            <div className="refundBillMiddle">
                <div className="receipt-total">
                    <table className='refund-total-table'>
                        <tbody>
                            <tr>
                                <td>No Items </td>
                                <td style={{ textAlign: 'right' }}>{refundBillProducts.length}</td>
                            </tr>

                            <tr style={{ fontSize: "14px", fontWeight: "bold" }}>
                                <td>Refund Amount </td>
                                <td style={{ textAlign: 'right' }}>{refundTotalAmount.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <hr className='invoice-line-top' />
            <div className="refund-receipt-footer">
                <h5> Thank you, Come again!</h5>
                <p> © <span style={{ fontFamily: "Princess Sofia, cursive" }}> Flex Flow -</span>Powered By HexaCode Solutions Pvt Ltd.</p>
                <hr className='invoice-line' />
                <p className='special-note'> Please use this bill as a reference if you have any price discrepancies, refunds or product returns. Only applicable for 7 days from today.</p>
            </div>
        </div>
    );

    return (
        <ReceiptPopup bodyContent={refundReceiptContent} onClose={onClose} onPrint={handleReprintReceipt} />
    );
};

export default RefundReceipt;
