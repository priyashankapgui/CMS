import { React, useState } from 'react';
import Layout from '../../../../Layout/Layout';
import './StartReturnItems.css';
import { IoChevronBackCircleOutline } from "react-icons/io5";
import { Link, useParams } from 'react-router-dom';
import InputField from '../../../../Components/InputField/InputField';
import InputLabel from '../../../../Components/Label/InputLabel';
import Buttons from "../../../../Components/Buttons/SquareButtons/Buttons";
import jsonData from '../../../../Components/Data.json';
import CustomAlert from '../../../../Components/Alerts/CustomAlert/CustomAlert';


export const StartReturnItems = () => {

    const { billNo } = useParams();
    const selectedBillData = jsonData.worklistTableData.find(bill => bill.billNo === billNo);

    const { branch, billedAt, billedBy, customerName, status, paymentMethod, contactNo } = selectedBillData;

    const [retQtyEditable, setRetQtyEditable] = useState([]);
    const [reason, setReason] = useState("");
    const [alertSuccessOpen, setAlertSuccessOpen] = useState(false);
    const [alertWarningOpen, setAlertWarningtOpen] = useState(false);

    const toggleRetQtyEditable = (index) => {
        const updatedState = [...retQtyEditable];
        updatedState[index] = !updatedState[index];
        setRetQtyEditable(updatedState);
    };

    const handleReasonChange = (event) => {
        const value = event.target.value;
        setReason(value);
    };

    const handleSubmit = () => {
        // Perform form submission if reason is valid
        if (reason.trim() !== "") {
            // Add your logic to submit the form here
            console.log("Form submitted!");
            setAlertSuccessOpen(true);
        } else {
            setAlertWarningtOpen(true); // Show alert if reason is empty
        }
    };

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
                                <InputLabel for="branchName" color="#0377A8">Branch: <span>{branch}</span></InputLabel>
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
                                <InputLabel for="billedAt" color="#0377A8">Billed At: <span>{billedAt} </span></InputLabel>
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
                            <Buttons type="button" onClick={handleSubmit} id="save-btn" style={{ backgroundColor: "#23A3DA", color: "white" }}> Save </Buttons>
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
                            {selectedBillData.billedItems.map((item, index) => (
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
                                    <td><InputField id={`productName_${index}`} name="productName" editable={false} width="300px" value={item.name} /></td>
                                    <td><InputField id={`returnQty_${index}`} name="returnQty" editable={retQtyEditable[index]} width="100%" textAlign='center' placeholder='Type here'/></td>
                                    <td><InputField id={`billedQty_${index}`} name="billedQty" editable={false} width="100%" value={item.quantity} textAlign='center' /></td>
                                    <td><InputField id={`batchNo_${index}`} name="batchNo" editable={false} width="100%" value={item.batchNo} textAlign='center' /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {alertWarningOpen && (
                    <CustomAlert
                        open={alertWarningOpen}
                        onClose={() => alertWarningOpen(false)}
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
