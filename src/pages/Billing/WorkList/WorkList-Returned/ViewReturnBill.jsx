import React, { useState, useEffect } from 'react';
import Layout from "../../../../Layout/Layout";
import "./ViewReturnBill.css";
import { IoChevronBackCircleOutline } from "react-icons/io5";
import { RiPrinterFill } from "react-icons/ri";
import { Link, useParams } from 'react-router-dom';
import InputField from '../../../../Components/InputField/InputField';
import InputLabel from '../../../../Components/Label/InputLabel';
import RoundButtons from '../../../../Components/Buttons/RoundButtons/RoundButtons';
import RefundReceipt from '../../../../Components/SalesReceiptTemp/RefundReceipt/RefundReceipt';
import MainSpinner from '../../../../Components/Spinner/MainSpinner/MainSpinner';
import { getRefundedBillData } from '../../../../Api/Billing/SalesApi';

export function ViewReturnBill() {

    const { RTBNo } = useParams();
    const [refundBillData, setRefundBillData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showRefundReceipt, setShowRefundReceipt] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await getRefundedBillData(RTBNo);
                console.log('Refund Bill', response);
                const responseData = response.data || {};
                setRefundBillData(responseData);
            } catch (error) {
                console.error('Error fetching refunded bill data:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (RTBNo) {
            fetchData();
        } else {
            setLoading(false);
        }
    }, [RTBNo]);

    const handleReprintClick = () => {
        console.log("Reprint button clicked");
        setShowRefundReceipt(true);
    };

    const handleCloseRefundReceipt = () => {
        setShowRefundReceipt(false);
    };

    if (loading) {
        return <div><MainSpinner /></div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!refundBillData) {
        return <div>Refund Bill not found</div>;
    }

    const { RTBNo: selectedRTBNo, branchName, billNo, createdAt, returnedBy, customerName, status, contactNo, refundTotalAmount, refundBillProducts = [] } = refundBillData;

    return (
        <>
            <div className="top-nav-blue-text">
                <div className="view-returnbill-top-link">
                    <Link to="/work-list/returnbill-list">
                        <IoChevronBackCircleOutline style={{ fontSize: "22px", color: "#0377A8" }} />
                    </Link>
                    <h4>View Refund Bill</h4>
                </div>
            </div>

            <Layout>
                <div className="view-returnbill-top">
                    <div className='view-returnbill-top-cont'>
                        <div className="cont1">
                            <div className='inputFlex'>
                                <InputLabel for="branchName" color="#0377A8">Branch: <span>{branchName}</span></InputLabel>
                            </div>
                            <div className='inputFlex'>
                                <InputLabel for="rtbNo" color="#0377A8">RTB No: <span>{selectedRTBNo}</span></InputLabel>
                            </div>
                            <div className='inputFlex'>
                                <InputLabel for="billNo" color="#0377A8">Bill No: <span>{billNo}</span></InputLabel>
                            </div>
                        </div>
                        <div className="cont2">
                            <div className='inputFlex'>
                                <InputLabel for="returnedAt" color="#0377A8">Returned At: <span>{new Date(createdAt).toLocaleString('en-GB')}</span></InputLabel>
                            </div>
                            <div className='inputFlex'>
                                <InputLabel for="returnedBy" color="#0377A8">Returned By: <span>{returnedBy}</span></InputLabel>
                            </div>
                            <div className='inputFlex'>
                                <InputLabel for="status" color="#0377A8">Status: <span>{status}</span></InputLabel>
                            </div>
                        </div>
                        <div className="cont3">
                            <div className='inputFlex'>
                                <InputLabel for="cusName" color="#0377A8">Customer Name: <span>{customerName}</span></InputLabel>
                            </div>
                            <div className='inputFlex'>
                                <InputLabel for="cusContact" color="#0377A8">Contact No: <span>{contactNo}</span></InputLabel>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div className="view-returnbill-top-cont-bottom">
                        <div className="ReturnTotAmount">
                            <InputLabel for="ReturnTotAmount" color="#0377A8">Refund Total Amount: <span>Rs {refundTotalAmount.toFixed(2)}</span></InputLabel>
                        </div>
                        <div className="btnSection-viewReturnBill">
                            <div className="reprintBtn">
                                <InputLabel> Reprint </InputLabel>
                                <RoundButtons id="reprintBtn" type="submit" name="reprintBtn" icon={<RiPrinterFill />} onClick={handleReprintClick} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="returned-item-container">
                    <table className='returned-item-table'>
                        <thead>
                            <tr>
                                <th>Product ID / Name</th>
                                <th>Ret.Qty</th>
                                <th>Batch No</th>
                                <th>Unit Price</th>
                                <th>Dis%</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {refundBillProducts.map((item, index) => (
                                <tr key={index}>
                                    <td><InputField id={`productId-${index}`} name={`productId-${index}`} editable={false} width="300px" value={`${item.productId} ${item.productName}`} /></td>
                                    <td><InputField id={`retQty-${index}`} name={`retQty-${index}`} editable={false} width="100%" value={item.returnQty.toFixed(3)} textAlign='center' /></td>
                                    <td><InputField id={`batchNo-${index}`} name={`batchNo-${index}`} editable={false} width="100%" value={item.batchNo} textAlign='center' /></td>
                                    <td><InputField id={`unitPrice-${index}`} name={`unitPrice-${index}`} editable={false} width="100%" value={item.sellingPrice.toFixed(2)} textAlign='right' /></td>
                                    <td><InputField id={`discount-${index}`} name={`discount-${index}`} editable={false} width="100%" value={item.discount.toFixed(2)} textAlign='center' /></td>
                                    <td><InputField id={`amount-${index}`} name={`amount-${index}`} editable={false} width="100%" value={(item.sellingPrice * item.returnQty) * (1 - item.discount / 100).toFixed(2)} textAlign='right' /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Layout>
            {showRefundReceipt && (
                <RefundReceipt RTBNo={RTBNo} onClose={handleCloseRefundReceipt} />
            )}
        </>
    );
}
