import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Layout from "../../../../Layout/Layout";
import "./ViewBill.css";
import { RiPrinterFill } from "react-icons/ri";
import { MdOutlineAssignmentReturn } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";
import InputField from '../../../../Components/InputField/InputField';
import InputLabel from '../../../../Components/Label/InputLabel';
import RoundButtons from '../../../../Components/Buttons/RoundButtons/RoundButtons';
import { IoChevronBackCircleOutline } from "react-icons/io5";
import SalesReceipt from '../../../../Components/SalesReceiptTemp/SalesReceipt/SalesReceipt';

export const ViewBill = () => {
    const { billNo } = useParams();
    const [billData, setBillData] = useState(null);
    const [showSalesReceipt, setShowSalesReceipt] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/bills-all?billNo=${billNo}`);
                console.log('Bill', response);
                const responseData = response.data.data;
                if (responseData) {
                    setBillData(responseData);
                } else {
                    setError('Bill not found');
                }
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchData();
    }, [billNo]);

    const handleReprintClick = () => {
        console.log("Reprint button clicked");
        setShowSalesReceipt(true);
    };

    const handleCloseSalesReceipt = () => {
        setShowSalesReceipt(false);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!billData) {
        return <div>Bill not found</div>;
    }

    const { billNo: selectedBillNo, branchName, billedBy, createdAt, customerName, status, paymentMethod, contactNo, billTotalAmount, billProducts } = billData;

    return (
        <>
            <div className="top-nav-blue-text">
                <div className="viewbill-top-link">
                    <Link to="/work-list">
                        <IoChevronBackCircleOutline style={{ fontSize: "22px", color: "#0377A8" }} />
                    </Link>
                    <h4>View Bill</h4>
                </div>
            </div>
            <Layout>
                <div className="view-bill-top">
                    <div className='view-bill-top-cont'>
                        <div className="cont1">
                            <div className='inputFlex'>
                                <InputLabel htmlFor="branchName" color="#0377A8">Branch: <span>{branchName}</span></InputLabel>
                            </div>
                            <div className='inputFlex'>
                                <InputLabel htmlFor="billNo" color="#0377A8">Bill No: <span>{selectedBillNo}</span></InputLabel>
                            </div>
                            <div className='inputFlex'>
                                <InputLabel htmlFor="status" color="#0377A8">Status: <span>{status}</span></InputLabel>
                            </div>
                        </div>
                        <div className="cont2">
                            <div className='inputFlex'>
                                <InputLabel htmlFor="billedAt" color="#0377A8">Billed At: <span>{new Date(createdAt).toLocaleString()}</span></InputLabel>
                            </div>
                            <div className='inputFlex'>
                                <InputLabel htmlFor="billedBy" color="#0377A8">Billed By: <span>{billedBy}</span></InputLabel>
                            </div>
                            <div className='inputFlex'>
                                <InputLabel htmlFor="paymentMethod" color="#0377A8">Payment Method: <span>{paymentMethod}</span></InputLabel>
                            </div>
                        </div>
                        <div className="cont3">
                            <div className='inputFlex'>
                                <InputLabel htmlFor="cusName" color="#0377A8">Customer Name: <span>{customerName}</span></InputLabel>
                            </div>
                            <div className='inputFlex'>
                                <InputLabel htmlFor="cusContact" color="#0377A8">Contact No: <span>{contactNo}</span></InputLabel>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div>
                        <div className='TotAmountBar-viewbill'>
                            <h4>Total Amount: <span>Rs. {billTotalAmount.toFixed(2)}</span></h4>
                        </div>
                        <div className="btnSection-viewBill">
                            <div className="returnBtn">
                                <InputLabel> Return Items</InputLabel>
                                <Link to={`/work-list/viewbill/start-return-items/${selectedBillNo}`}>
                                    <RoundButtons id="returnBtn" type="submit" name="returnBtn" icon={<MdOutlineAssignmentReturn />} onClick={() => console.log("Return Button clicked")} />
                                </Link>
                            </div>
                            <div className="reprintBtn">
                                <InputLabel> Reprint </InputLabel>
                                <RoundButtons id="reprintBtn" type="submit" name="reprintBtn" icon={<RiPrinterFill />} onClick={handleReprintClick} />
                            </div>
                            <div className="cancelBillBtn">
                                <InputLabel> Cancel Bill </InputLabel>
                                <RoundButtons id="cancelBillBtn" type="submit" name="cancelBillBtn" backgroundColor="#EB1313" icon={<AiOutlineClose style={{ color: 'white' }} onClick={() => console.log("Cancel Bill Button clicked")} />} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="billed-item-container">
                    <table className='billed-item-table'>
                        <thead>
                            <tr>
                                <th>Product ID / Name</th>
                                <th>Qty</th>
                                <th>Batch No</th>
                                <th>Unit Price</th>
                                <th>Dis%</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {billProducts.map((item, index) => (
                                <tr key={index}>
                                    <td><InputField id={`productId-${index}`} name={`productId-${index}`} editable={false} width="100%" value={`${item.productId} ${item.productName}`} /></td>
                                    <td><InputField id={`billQty-${index}`} name={`billQty-${index}`} editable={false} width="100%" value={item.billQty} textAlign='center' /></td>
                                    <td><InputField id={`batchNo-${index}`} name={`batchNo-${index}`} editable={false} width="100%" value={item.batchNo} textAlign='center' /></td>
                                    <td><InputField id={`sellingPrice-${index}`} name={`sellingPrice-${index}`} editable={false} width="100%" value={item.sellingPrice} textAlign='right' /></td>
                                    <td><InputField id={`discount-${index}`} name={`discount-${index}`} editable={false} width="100%" value={item.discount} textAlign='right' /></td>
                                    <td><InputField id={`amount-${index}`} name={`amount-${index}`} editable={false} width="100%" value={item.amount.toFixed(2)} textAlign='right' /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Layout>
            {showSalesReceipt && (
                <SalesReceipt billNo={billNo} onClose={handleCloseSalesReceipt} />
            )}
        </>
    );
};

export default ViewBill;
