import React from 'react'
import Layout from "../../../../Layout/Layout";
import "./ViewReturnBill.css";
import { IoChevronBackCircleOutline } from "react-icons/io5";
import { RiPrinterFill } from "react-icons/ri";
import { Link, useParams } from 'react-router-dom';
import InputField from '../../../../Components/InputField/InputField';
import InputDropdown from '../../../../Components/InputDropdown/InputDropdown';
import InputLabel from '../../../../Components/Label/InputLabel';
import RoundButtons from '../../../../Components/Buttons/RoundButtons/RoundButtons';
import jsonData from '../../../../Components/Data.json';

export default function ViewReturnBill() {

    const { RTBNo } = useParams();
    const selectedReturnBillData = jsonData.ReturnBillListTableData.find(RTB => RTB.RTBNo === RTBNo);

    if (!selectedReturnBillData) {
        return <div>Return Bill not found</div>;
    }
    const { branch,billNo, returnedAt, returnedBy, customerName, status,  contactNo } = selectedReturnBillData;
    return (
        <>
            <div className="viewReturnbill">
                <div className="view-returnbill-top-link">
                    <Link to="/work-list/returnbill-list">
                        <IoChevronBackCircleOutline style={{ fontSize: "22px", color: "#0377A8" }} />
                    </Link>
                    <h4>View Return Bill</h4>
                </div>
            </div>

            <Layout>
                <div className="view-returnbill-top">
                    <div className='view-returnbill-top-cont'>
                        <div className="cont1">
                            <div className='inputFlex'>
                                <InputLabel for="branchName" color="#0377A8">Branch: <span>{branch}</span></InputLabel>
                            </div>
                            <div className='inputFlex'>
                                <InputLabel for="rtbNo" color="#0377A8">RTB No: <span>{RTBNo}</span></InputLabel>
                            </div>
                            <div className='inputFlex'>
                                <InputLabel for="billNo" color="#0377A8">Bill No: <span>{billNo}</span></InputLabel>
                            </div>
                        </div>
                        <div className="cont2">
                            <div className='inputFlex'>
                                <InputLabel for="returnedAt" color="#0377A8">Returned At: <span>{returnedAt}</span></InputLabel>
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
                                <InputLabel for="cusName" color="#0377A8">Customer Name: <span>{customerName} </span></InputLabel>
                            </div>
                            <div className='inputFlex'>
                                <InputLabel for="cusContact" color="#0377A8">Contact No: <span>{contactNo} </span></InputLabel>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div className="view-returnbill-top-cont-bottom">
                        <div className="ReturnTotAmount">
                            <InputLabel for="ReturnTotAmount" color="#0377A8">Total Amount: <span>{} </span></InputLabel>
                        </div>
                        <div className="btnSection-viewReturnBill ">
                            <div className="reprintBtn">
                                <InputLabel> Reprint </InputLabel>
                                <RoundButtons id="reprintBtn" type="submit" name="reprintBtn" icon={<RiPrinterFill />} onClick={() => console.log("Reprint Button clicked")} />
                            </div>
                        </div>
                    </div>
                </div>


                <div className="returned-item-container">
                    <table className='returned-item-table'>
                        <thead>
                            <tr >
                                <th>Product ID / Name</th>
                                <th>Ret.Qty</th>
                                <th>Batch No</th>
                                <th>Unit Price</th>
                                <th>Dis%</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedReturnBillData.returnItems.map((item, index) => (
                                <tr key={index}>
                                    <td><InputField id="" name="productName" editable={false} width="300px" value={item.name} /></td>
                                    <td><InputField id="" name="retQty" editable={false} width="100%" value={item.quantity} textAlign='center' /></td>
                                    <td><InputDropdown id="" name="batchNo" width="100%" options={[item.batchNo]} editable={true} /></td>
                                    <td><InputField id="" name="unitPrice" editable={false} width="100%" value={item.rate} textAlign='right' /></td>
                                    <td><InputField id="" name="discount" editable={false} width="100%" value="" textAlign='right' /></td>
                                    <td><InputField id="" name="amount" editable={false} width="100%" value={item.rate * item.quantity} textAlign='right' /></td>
                                </tr>
                            ))}
                        </tbody>


                    </table>
                </div>

            </Layout>

        </>
    );
};
