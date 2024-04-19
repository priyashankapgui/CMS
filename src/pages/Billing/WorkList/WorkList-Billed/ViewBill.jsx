import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Layout from "../../../../Layout/Layout";
import "./ViewBill.css";
import InputLabel from '../../../../Components/Label/InputLabel';
import { RiPrinterFill } from "react-icons/ri";
import { MdOutlineAssignmentReturn } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";
import InputField from '../../../../Components/InputField/InputField';
import InputDropdown from '../../../../Components/InputDropdown/InputDropdown';
import RoundButtons from '../../../../Components/Buttons/RoundButtons/RoundButtons';
import { IoChevronBackCircleOutline } from "react-icons/io5";
import jsonData from '../../../../Components/Data.json';

export const ViewBill = () => {
    const { billNo } = useParams();
    const selectedBillData = jsonData.worklistTableData.find(bill => bill.billNo === billNo);

    if (!selectedBillData) {
        return <div>Bill not found</div>;
    }

    const { branch, billedAt, billedBy, customerName, status, paymentMethod, contactNo } = selectedBillData;

    return (
        <>
            <div className="viewbill">
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
                                <InputLabel for="branchName" color="#0377A8">Branch: <span>{branch}</span></InputLabel>
                            </div>
                            <div className='inputFlex'>
                                <InputLabel for="billNo" color="#0377A8">Bill No: <span>{billNo}</span></InputLabel>
                            </div>
                            <div className='inputFlex'>
                                <InputLabel for="status" color="#0377A8">Status: <span>{status}</span></InputLabel>
                            </div>
                        </div>
                        <div className="cont2">
                            <div className='inputFlex'>
                                <InputLabel for="billedAt" color="#0377A8">Billed At: <span>{billedAt}</span></InputLabel>
                            </div>
                            <div className='inputFlex'>
                                <InputLabel for="billedBy" color="#0377A8">Billed By: <span>{billedBy}</span></InputLabel>
                            </div>
                            <div className='inputFlex'>
                                <InputLabel for="paymentMethod" color="#0377A8">Payment Method: <span>{paymentMethod}</span></InputLabel>
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
                    <div className="btnSection-viewBill">
                        <div className="returnBtn">
                            <InputLabel> Return </InputLabel>
                            <RoundButtons id="returnBtn" type="submit" name="returnBtn" icon={<MdOutlineAssignmentReturn />} onClick={() => console.log("Return Button clicked")} />
                        </div>

                        <div className="reprintBtn">
                            <InputLabel> Reprint </InputLabel>
                            <RoundButtons id="reprintBtn" type="submit" name="reprintBtn" icon={<RiPrinterFill />} onClick={() => console.log("Reprint Button clicked")} />
                        </div>

                        <div className="cancelBillBtn">
                            <InputLabel> Cancel Bill </InputLabel>
                            <RoundButtons id="cancelBillBtn" type="submit" name="cancelBillBtn" backgroundColor="#EB1313" icon={<AiOutlineClose style={{ color: 'white' }} onClick={() => console.log("Cancel Bill Button clicked")} />} />
                        </div>
                    </div>
                </div>
                <div className="billed-item-container">
                    <table className='billed-item-table'>
                        <thead>
                            <tr >
                                <th>Product ID / Name</th>
                                <th>Qty</th>
                                <th>Batch No</th>
                                <th>Unit Price</th>
                                <th>Dis%</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedBillData.billedItems.map((item, index) => (
                                <tr key={index}>
                                    <td><InputField id="" name="productName" editable={false} width="300px" value={item.name} /></td>
                                    <td><InputField id="" name="billQty" editable={false} width="100%" value={item.quantity} textAlign='center' /></td>
                                    <td><InputDropdown id="" name="batchNo" width="100%" options={[item.batchNo]} editable={true} /></td>
                                    <td><InputField id="" name="unitPrice" editable={false} width="100%" value={item.rate} textAlign='right' /></td>
                                    <td><InputField id="" name="discount" editable={false} width="100%" value={""} textAlign='right' /></td>
                                    <td><InputField id="" name="amount" editable={false} width="100%" value={(item.rate * item.quantity).toFixed(2)} textAlign='right' /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="payment-container-viewbill">
                    <div className="payment-container-viewbill-middle">
                        <table className='payment-container-viewbill-table'>
                            <tbody>
                                <tr>
                                    <td><InputLabel for="grossTotal" color="#0377A8">Gross Total</InputLabel></td>
                                    <td><InputField type="text" id="grossTotal" name="grossTotal" editable={false} marginTop="0" textAlign='right' value={""} /></td>
                                </tr>
                                <tr>
                                    <td><InputLabel for="discount" color="#0377A8">Discount %</InputLabel></td>
                                    <td>
                                        <div className="discount-fields-container-viewbill">
                                            <InputField type="text" id="discountRate" name="discountRate" className="discountRate" editable={true} placeholder="%" width="3em" textAlign='right' value={""} />
                                            <InputField type="text" id="discountAmount" name="discountAmount" className="discountAmount" editable={false} width="23.7em" textAlign='right' value={""}/>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td><InputLabel for="netTotal" color="#0377A8" fontsize="1.125em" fontweight="510">Net Total</InputLabel></td>
                                    <td><InputField type="text" id="netTotal" name="netTotal" editable={false} marginTop="0" textAlign='right' value={""} /></td>
                                </tr>
                                <tr>
                                    <td><InputLabel for="received" color="#0377A8">Received</InputLabel></td>
                                    <td><InputField type="text" id="received" name="received" editable={false} marginTop="0" textAlign='right' value={""} /></td>
                                </tr>
                                <tr>
                                    <td><InputLabel for="balance" color="#0377A8">Balance</InputLabel></td>
                                    <td><InputField type="text" id="balance" name="balance" editable={false} marginTop="0" textAlign='right' value={""} /></td>
                                </tr>
                                <tr>
                                    <td colSpan="2"><InputLabel for="noQty" color="#0377A8">No Qty:<span> </span></InputLabel></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>




            </Layout>
        </>
    );
};

export default ViewBill;
