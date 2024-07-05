import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Layout from '../../../../Layout/Layout';
import './StartReturnItems.css';
import { IoChevronBackCircleOutline } from "react-icons/io5";
import InputField from '../../../../Components/InputField/InputField';
import InputLabel from '../../../../Components/Label/InputLabel';
import Buttons from "../../../../Components/Buttons/SquareButtons/Buttons";
import CustomAlert from '../../../../Components/Alerts/CustomAlert/CustomAlert';
import MainSpinner from '../../../../Components/Spinner/MainSpinner/MainSpinner';
import SubSpinner from '../../../../Components/Spinner/SubSpinner/SubSpinner';
import secureLocalStorage from "react-secure-storage";
import { getBilledData, postRefundBillData } from '../../../../Api/Billing/SalesApi';
import RefundReceipt from '../../../../Components/SalesReceiptTemp/RefundReceipt/RefundReceipt';

export const StartReturnItems = () => {
    const { billNo } = useParams();
    const [billData, setBillData] = useState(null)
    const [test, setTest] = useState([]);
    const [loading, setLoading] = useState(true);
    const [RTBNo, setRTBNo] = useState(null);
    const [showRefundReceipt, setShowRefundReceipt] = useState(false);
    const [error, setError] = useState(null);
    const [returnItems, setReturnItems] = useState([]);
    const [retQtyEditable, setRetQtyEditable] = useState([]);
    const [reason, setReason] = useState("");
    const [alert, setAlert] = useState({
        severity: '',
        title: '',
        message: '',
        open: false
    });
    const navigate = useNavigate();

    const [userDetails, setUserDetails] = useState({
        username: ""
    });

    useEffect(() => {
        const fetchBillData = async () => {
            try {
                const response = await getBilledData(billNo);
                console.log("data:", response);
                if (response.data) {
                    setBillData(response.data);
                    setReturnItems(response.data.billProducts.map(product => ({
                        ...product,
                        returnQty: 0,
                        remainingQty: product.billQty // Assuming refundedQty is part of product object from API
                    })));
                    setRetQtyEditable(response.data.billProducts.map(() => false)); // Initialize retQtyEditable state
                } else {
                    setError('Bill not found');
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBillData();
    }, [billNo]);


    const fetchRefundBilDataTest = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/refund/bill/${billNo}`);
            console.log("fetchRefundBilDataTest", response);
            setTest(response.data.refundBillProducts)
        }
        catch (error) {
            console.error('Error fetchRefundBilDataTest:', error);
        }
    };

    useEffect(() => {
        const userJSON = secureLocalStorage.getItem("user");
        if (userJSON) {
            const user = JSON.parse(userJSON);
            setUserDetails({
                username: user?.userName || user?.employeeName || "",
            });
        }

        fetchRefundBilDataTest();
    }, [billNo]);



    const testData = (productId, batchNo) => {
        console.log("testData", test);
        for (let testItem of test) {
            if (testItem.productId === productId && testItem.batchNo === batchNo) {
                console.log('RE', testItem.returnQty);
                return testItem.returnQty;
            }
        }
        return undefined;
    };


    const handleReturnQtyChange = (index, value) => {
        const updatedItems = [...returnItems];
        const returnQty = Number(value) || 0;

        if (returnQty > updatedItems[index].remainingQty) {
            setAlert({
                severity: 'warning',
                title: 'Warning',
                message: `Return quantity cannot exceed remaining quantity for ${updatedItems[index].productName}.`,
                open: true
            });
            updatedItems[index].returnQty = updatedItems[index].remainingQty;
        } else {
            updatedItems[index].returnQty = returnQty;
        }

        setReturnItems(updatedItems);
    };

    const handleSubmitReturn = async () => {
        const refundTotalAmount = calculateTotalRefund();
        if (refundTotalAmount <= 0 && !reason) {
            setAlert({
                severity: 'warning',
                title: 'Warning',
                message: 'Fill required things.',
                open: true
            });
            return;
        } else if (refundTotalAmount > 0 && !reason) {
            setAlert({
                severity: 'warning',
                title: 'Warning',
                message: 'Please add the reason.',
                open: true
            });
            return;
        } else if (reason && refundTotalAmount <= 0) {
            setAlert({
                severity: 'warning',
                title: 'Warning',
                message: 'Please select the items to return.',
                open: true
            });
            return;
        }

        const selectedItems = returnItems.filter((item, index) => retQtyEditable[index] && item.returnQty > 0);

        const payload = {
            billNo,
            branchName: billData.branchName,
            returnedBy: userDetails.username,
            reason,
            refundTotalAmount,
            products: selectedItems.map(item => ({
                productId: item.productId,
                returnQty: item.returnQty,
                batchNo: item.batchNo,
                billQty: item.billQty,
                sellingPrice: item.sellingPrice,
                discount: item.discount
            }))
        };
        setLoading(true);
        try {
            const response = await postRefundBillData(payload);
            console.log("Response:", response);

            if (response && response.message && response.message.includes("Refund Bill and refund_Bill_Product entries created successfully")) {
                console.log("Form submitted!");
                setAlert({
                    severity: 'success',
                    title: 'Success',
                    message: 'Return processed successfully.',
                    open: true
                });
                const RTBNo = response.newRefundBill.RTBNo;
                setRTBNo(RTBNo);
                setShowRefundReceipt(true);
                console.log('RTB No set:', RTBNo);
            } else {
                console.error('Error processing return: Unexpected status', response ? response.message : 'No response');
                setAlert({
                    severity: 'warning',
                    title: 'Warning',
                    message: response && response.message ? response.message : 'Unexpected status occurred.',
                    open: true
                });
            }
        } catch (error) {
            console.error('Error processing return:', error);
            setAlert({
                severity: 'error',
                title: 'Error',
                message: 'An error occurred while processing the return.',
                open: true
            });
        } finally {
            setLoading(false);
        }
    };

    const handleReasonChange = (event) => {
        const value = event.target.value;
        setReason(value);
        console.log("Reason set to:", value);
    };

    const toggleRetQtyEditable = (index) => {
        const updatedState = [...retQtyEditable];
        updatedState[index] = !updatedState[index];
        if (!updatedState[index]) {
            handleReturnQtyChange(index, 0);
        }
        setRetQtyEditable(updatedState);
    };

    const calculateTotalRefund = () => {
        return returnItems.reduce((total, item) => {
            if (item.returnQty > 0) {
                const discountMultiplier = 1 - (item.discount / 100);
                const itemTotal = item.returnQty * item.sellingPrice * discountMultiplier;
                return total + itemTotal;
            }
            return total;
        }, 0).toFixed(2);
    };

    const handleCloseRefundReceipt = () => {
        setShowRefundReceipt(false);
        navigate(`/work-list/returnbill-list`);
    };

    if (loading) {
        return <div><MainSpinner /></div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!billData) {
        return <div>Bill not found</div>;
    }

    const { branchName, customerName, contactNo, createdAt } = billData;

    return (
        <>
            <div className="top-nav-blue-text">
                <div className="return-itmes-top-link">
                    <Link to={`/work-list/viewbill/${billNo}`}>
                        <IoChevronBackCircleOutline style={{ fontSize: "22px", color: "#0377A8" }} />
                    </Link>
                    <h4>Start Return Items</h4>
                </div>
            </div>

            <Layout>
                {loading && (
                    <div className="loading-overlay">
                        <SubSpinner spinnerText='Saving' />
                    </div>
                )}
                <div className="return-items-top">
                    {showRefundReceipt && <RefundReceipt RTBNo={RTBNo} onClose={handleCloseRefundReceipt} />}
                    <div className='return-items-top-cont'>
                        <div className='inputFlex'>
                            <InputLabel for="branchName" color="#0377A8">Branch: <span>{branchName}</span></InputLabel>
                        </div>
                        <div className='inputFlex'>
                            <InputLabel for="billNo" color="#0377A8">Bill No: <span>{billNo} </span></InputLabel>
                        </div>

                        <div className='inputFlex'>
                            <InputLabel for="billedAt" color="#0377A8">Billed At: <span>{new Date(createdAt).toLocaleString('en-GB')}</span></InputLabel>
                        </div>

                        <div className='inputFlex'>
                            <InputLabel for="cusName" color="#0377A8">Customer Name: <span>{customerName}</span></InputLabel>
                        </div>
                        <div className='inputFlex'>
                            <InputLabel for="cusContact" color="#0377A8">Contact No: <span>{contactNo} </span></InputLabel>
                        </div>

                    </div>
                    <hr />
                    <div className="return-items-reason-cont-btm">
                        <div className="return-items-reason-cont2">
                            <h4>Total Refund Amount: Rs {calculateTotalRefund()}</h4>
                        </div>
                        <div className="return-items-reason-cont1">
                            <InputLabel for="return-items-reason-text" color="red">Reason:</InputLabel>
                            <InputField id="return-items-reason" name="return-items-reason" value={reason} onChange={handleReasonChange} editable={true} width="400px" height="60px" placeholder="Type the reason here..." />
                            <div className="btnSection-return-items">
                                <Buttons type="button" onClick={handleSubmitReturn} id="save-btn" style={{ backgroundColor: "#23A3DA", color: "white" }}> Save </Buttons>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="return-items-container">
                    <table className='return-items-table'>
                        <thead>
                            <tr>
                                <th />
                                <th>Product ID / Name</th>
                                <th>Return Qty</th>
                                <th>Billed Qty</th>
                                <th>Batch No</th>
                                <th>Unit Price</th>
                                <th>Dis%</th>
                            </tr>
                        </thead>
                        <tbody>
                            {returnItems.map((item, index) => (
                                <tr key={index}>
                                    <td>
                                        <label className="checkbox-container">
                                            <input
                                                type="checkbox"
                                                className="checkbox-input"
                                                disabled={item.billQty === testData(item.productId, item.batchNo)}
                                                checked={retQtyEditable[index]}
                                                onChange={() => toggleRetQtyEditable(index)}
                                            />
                                            <span className="checkmark"></span>
                                        </label>
                                    </td>
                                    <td><InputField id={`productName_${index}`} name="productName" editable={false} width="300px" value={`${item.productId} ${item.productName}`} /></td>
                                    <td>
                                        <InputField
                                            id={`returnQty_${index}`}
                                            name="returnQty"
                                            editable={retQtyEditable[index]}
                                            width="100%"
                                            textAlign='center'
                                            placeholder='Type here'
                                            className={retQtyEditable[index] ? 'blue-border' : ''}
                                            onChange={(e) => handleReturnQtyChange(index, e.target.value)}
                                            value={item.returnQty}
                                        />
                                    </td>
                                    <td><InputField type="number" id={`billedQty_${index}`} name="billedQty" editable={false} width="100%" value={(item.billQty).toFixed(2)} textAlign='center' /></td>
                                    <td><InputField id={`batchNo_${index}`} name="batchNo" editable={false} width="100%" value={item.batchNo} textAlign='center' /></td>
                                    <td><InputField id={`unitPrice_${index}`} name="unitPrice" editable={false} width="100%" value={item.sellingPrice.toFixed(2)} textAlign='center' /></td>
                                    <td><InputField id={`discount_${index}`} name="discount" editable={false} width="100%" value={item.discount.toFixed(2)} textAlign='center' /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {alert.open && (
                    <CustomAlert
                        severity={alert.severity}
                        title={alert.title}
                        message={alert.message}
                        duration={4000}
                        onClose={() => setAlert({ ...alert, open: false })}
                    />
                )}
            </Layout>
        </>
    );
};

export default StartReturnItems;
