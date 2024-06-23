import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../../../../Layout/Layout';
import './StartReturnItems.css';
import { IoChevronBackCircleOutline } from "react-icons/io5";
import InputField from '../../../../Components/InputField/InputField';
import InputLabel from '../../../../Components/Label/InputLabel';
import Buttons from "../../../../Components/Buttons/SquareButtons/Buttons";
import CustomAlert from '../../../../Components/Alerts/CustomAlert/CustomAlert';

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

    useEffect(() => {
        const fetchBillData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/bills-all?billNo=${billNo}`);
                const responseData = response.data.data;
                if (responseData) {
                    setBillData(responseData);
                    setReturnItems(responseData.billProducts.map(product => ({
                        ...product,
                        returnQty: 0
                    })));
                } else {
                    setError('Bill not found');
                }
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchBillData();
    }, [billNo]);

    const handleReturnQtyChange = (index, value) => {
        const updatedItems = [...returnItems];
        updatedItems[index].returnQty = value;
        setReturnItems(updatedItems);
    };

    const handleSubmitReturn = async () => {
        try {
            const response = await axios.post('http://localhost:8080/returns', {
                billNo,
                returnItems: returnItems.filter(item => item.returnQty > 0),
                reason // Make sure to include the reason in the request payload
            });
            if (response.status === 200) {
                console.log("Form submitted!");
                setAlertSuccessOpen(true);
                navigate(`/work-list/viewbill/${billNo}`);
            } else {
                alert('Error processing return');
            }
        } catch (error) {
            console.error('Error processing return:', error);
            setAlertWarningtOpen(true);
        }

    };

    const handleReasonChange = (event) => {
        const value = event.target.value;
        setReason(value);
    };

    const toggleRetQtyEditable = (index) => {
        const updatedState = [...retQtyEditable];
        updatedState[index] = !updatedState[index];
        setRetQtyEditable(updatedState);
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

    const { branchName, billedBy, createdAt, customerName, status, paymentMethod, contactNo, billTotalAmount, billProducts } = billData;

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
                            <div className='inputFlex'>
                                <InputLabel for="status" color="#0377A8">Status: <span>{status}</span></InputLabel>
                            </div>
                        </div>
                        <div className="cont2">
                            <div className='inputFlex'>
                                <InputLabel for="billedAt" color="#0377A8">Billed At: <span>{createdAt} </span></InputLabel>
                            </div>
                            <div className='inputFlex'>
                                <InputLabel for="billedBy" color="#0377A8">Billed By: <span> {billedBy}</span></InputLabel>
                            </div>
                            <div className='inputFlex'>
                                <InputLabel for="paymentMethod" color="#0377A8">Payment Method: <span>{paymentMethod} </span></InputLabel>
                            </div>
                        </div>
                        <div className="cont3">
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
                        <div className="return-items-reason-cont">
                            <InputLabel for="return-items-reason-text" color="red">Reason:</InputLabel>
                            <InputField id="" name="return-items-reason" value={reason} onChange={handleReasonChange} editable={true} width="400px" height="60px" placeholder="Type the reason here..." />
                        </div>
                        <div className="btnSection-return-items">
                            <Buttons type="button" onClick={handleSubmitReturn} id="save-btn" style={{ backgroundColor: "#23A3DA", color: "white" }}> Save </Buttons>
                            <Link to={`/work-list/viewbill/${billNo}`}>
                                <Buttons type="close" id="close-btn" style={{ backgroundColor: "#fafafa", color: "black" }}> Close </Buttons>
                            </Link>
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
