import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Layout from '../../../../Layout/Layout';
import './StartReturnItems.css';
import { IoChevronBackCircleOutline } from "react-icons/io5";
import InputField from '../../../../Components/InputField/InputField';
import InputLabel from '../../../../Components/Label/InputLabel';
import Buttons from "../../../../Components/Buttons/SquareButtons/Buttons";
import CustomAlert from '../../../../Components/Alerts/CustomAlert/CustomAlert';
import MainSpinner from '../../../../Components/Spinner/MainSpinner/MainSpinner';
import secureLocalStorage from "react-secure-storage";
import { getBilledData, postRefundBillData } from '../../../../Api/Billing/SalesApi';


export const StartReturnItems = () => {
    const { billNo } = useParams();
    const navigate = useNavigate();
    const [billData, setBillData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [returnItems, setReturnItems] = useState([]);
    const [retQtyEditable, setRetQtyEditable] = useState([]);
    const [reason, setReason] = useState("");
    const [alertSuccessOpen, setAlertSuccessOpen] = useState(false);
    const [alertWarningOpen, setAlertWarningtOpen] = useState(false);
    const [userDetails, setUserDetails] = useState({
        username: ""
    });

    useEffect(() => {

        const fetchBillData = async () => {
            try {
                const response = await getBilledData(billNo);
                if (response.data) {
                    setBillData(response.data);
                    setReturnItems(response.data.billProducts.map(product => ({
                        ...product,
                        returnQty: 0
                    })));
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


    useEffect(() => {
        const userJSON = secureLocalStorage.getItem("user");
        if (userJSON) {
            const user = JSON.parse(userJSON);
            setUserDetails({
                username: user?.userName || user?.employeeName || "",
            });
        }
    }, []);

    const handleReturnQtyChange = (index, value) => {
        const updatedItems = [...returnItems];
        updatedItems[index].returnQty = Number(value) || 0;
        setReturnItems(updatedItems);
    };


    const handleSubmitReturn = async () => {
        const selectedItems = returnItems.filter((item, index) => retQtyEditable[index] && item.returnQty > 0);
        if (selectedItems.length === 0 || !reason.trim()) {
            setAlertWarningtOpen(true);
            return;
        }

        const payload = {
            billNo,
            branchName,
            returnedBy: userDetails.username,
            reason,
            refundTotalAmount: calculateTotalRefund(),
            products: selectedItems.map(item => ({
                productId: item.productId,
                returnQty: item.returnQty,
                batchNo: item.batchNo,
                billQty: item.billQty,
                sellingPrice: item.sellingPrice,
                discount: item.discount
            }))
        };

        try {
            const response = await postRefundBillData(payload);
            console.log("Response:", response); // Log response for debugging
            if (response.success) {
                console.log("Form submitted!");
                setAlertSuccessOpen(true);
                navigate(`/work-list/viewbill/${billNo}`);
            } else {
                console.error('Error processing return: Unexpected status', response.status);
                setAlertWarningtOpen(true);// Show warning alert for unexpected status
            }
        } catch (error) {
            console.error('Error processing return:', error);
            setAlertWarningtOpen(true); // Show warning alert for general error
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

    if (loading) {
        return <div><MainSpinner /></div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!billData) {
        return <div>Bill not found</div>;
    }

    const { branchName, customerName, contactNo } = billData;

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
                <div className="return-items-top">
                    <div className='return-items-top-cont'>
                        <div className="cont1">
                            <div className='inputFlex'>
                                <InputLabel for="branchName" color="#0377A8">Branch: <span>{branchName}</span></InputLabel>
                            </div>
                            <div className='inputFlex'>
                                <InputLabel for="billNo" color="#0377A8">Bill No: <span>{billNo} </span></InputLabel>
                            </div>
                        </div>
                        <div className="cont2">
                            <div className='inputFlex'>
                                <InputLabel for="cusName" color="#0377A8">Customer Name: <span>{customerName}</span></InputLabel>
                            </div>
                            <div className='inputFlex'>
                                <InputLabel for="cusContact" color="#0377A8">Contact No: <span>{contactNo} </span></InputLabel>
                            </div>
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
                                <th>Dis</th>
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
                                        />

                                    </td>
                                    <td><InputField id={`billedQty_${index}`} name="billedQty" editable={false} width="100%" value={item.billQty} textAlign='center' /></td>
                                    <td><InputField id={`batchNo_${index}`} name="batchNo" editable={false} width="100%" value={item.batchNo} textAlign='center' /></td>
                                    <td><InputField id={`unitPrice_${index}`} name="unitPrice" editable={false} width="100%" value={item.sellingPrice} textAlign='center' /></td>
                                    <td><InputField id={`discount_${index}`} name="discount" editable={false} width="100%" value={item.discount} textAlign='center' /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {alertWarningOpen && (
                    <CustomAlert
                        open={alertWarningOpen}
                        onClose={() => setAlertWarningtOpen(false)}
                        severity="warning"
                        title="Please add the reason."
                        message="You cannot go forward until you do it."
                        duration={5000}
                    />
                )}

                {alertSuccessOpen && (
                    <CustomAlert
                        open={alertSuccessOpen}
                        onClose={() => setAlertSuccessOpen(false)}
                        severity="success"
                        title="Return items quantity updated successfully!"
                        message="Go to the WorkList Page"
                        duration={3000}
                    />
                )}

            </Layout>
        </>
    );
};

export default StartReturnItems;
