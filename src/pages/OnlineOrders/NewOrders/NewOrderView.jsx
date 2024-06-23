import React, { useState } from 'react';
import Layout from "../../../Layout/Layout";
import "./NewOrderView.css";
import { IoChevronBackCircleOutline } from "react-icons/io5";
import { Link } from 'react-router-dom';
import InputField from '../../../Components/InputField/InputField';
import InputLabel from '../../../Components/Label/InputLabel';
import RoundButtons from '../../../Components/Buttons/RoundButtons/RoundButtons';
import { MdDone, MdOutlineCancel } from "react-icons/md";
import WorkOrderReceipt from '../../../Components/WorkOrderReceipt/WorkOrderReceipt';

export function NewOrderView() {
    const [showPopup, setShowPopup] = useState(false);

    const handleAcceptClick = () => {
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    return (
        <>
            <div className='top-nav-blue-text'>
                <div className='ViewOnlineDetails'>
                    <Link to="/online-orders">
                        <IoChevronBackCircleOutline style={{ fontSize: "22px", color: "#0377A8" }} />
                    </Link>
                    <h4>View Order</h4>
                </div>
            </div>
            <Layout>
                <div className='View-onlineorder-top'>
                    <div className='View-onlineorder-top-cont'>
                        <div className='detail1'>
                            <div className='inputFlex'>
                                <InputLabel for="branchName" color="#0377A8">Branch: <span>{''}</span></InputLabel>
                            </div>
                            <div className='inputFlex'>
                                <InputLabel for="ordNo" color="#0377A8">ORD No: <span>{''}</span></InputLabel>
                            </div>
                            <div className='inputFlex'>
                                <InputLabel for="orderedat" color="#0377A8">Ordered At: <span>{''}</span></InputLabel>
                            </div>
                        </div>
                        <div className='detail2'>
                            <div className='inputFlex'>
                                <InputLabel for="customerName:" color="#0377A8">Customer Name: <span>{''}</span></InputLabel>
                            </div>
                            <div className='inputFlex'>
                                <InputLabel for="paymentMethod: " color="#0377A8">Payment Method:  <span>{''}</span></InputLabel>
                            </div>
                            <div className='inputFlex'>
                                <InputLabel for="HopetoPickUp:" color="#0377A8">Hope to Pick Up: <span>{''}</span></InputLabel>
                            </div>
                        </div>
                    </div>
                    <hr/>
                    <div className='View-onlineorder-bottom-cont'>
                        <div className='onlineOrderRBtn'>
                            <InputLabel> Accept </InputLabel>
                            <RoundButtons id="acceptbtn" type="submit" name="acceptbtn" icon={<MdDone />} onClick={handleAcceptClick} />
                        </div>
                        
                    </div>
                </div>
                <div className='viewOnlineOrderItem'>
                    <table className='viewonlineitemtable'>
                        <thead>
                            <tr>
                                <th>Product ID </th>
                                <th>Product Name</th>
                                <th>Qty</th>
                                <th>Unit Price</th>
                                <th>Dis%</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr key={''}>
                                <td><InputField id="" name="productId" editable={false} width="100%" value={''} /></td>
                                <td><InputField id="" name="productName" editable={false} width="300px" value={''} /></td>
                                <td><InputField id="" name="qty" editable={false} width="100%" value={''} /></td>
                                <td><InputField id="" name="unitPrice" editable={false} width="100%" value={''} /></td>
                                <td><InputField id="" name="discount" editable={false} width="100%" value={''} /></td>
                                <td><InputField id="" name="amount" editable={false} width="100%" value={''} /></td>
                            </tr>
                            <tr>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th>Gross Total</th>
                                <td><InputField id="" name="grossTotal" editable={false} width="100%" value={''} /></td>
                            </tr>
                            <tr>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th>Dicount % </th>
                                <td><InputField id="" name="discount" editable={false} width="100%" value={''} /></td>
                            </tr>
                            <tr>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th>Net Total</th>
                                <td><InputField id="" name="netTotal" editable={false} width="100%" value={''} /></td>
                            </tr>
                            <tr>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th>Number of Items :</th>
                                <td><InputField id="" name="itemCount" editable={false} width="100%" value={''} /></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Layout>
            {showPopup && <WorkOrderReceipt onlineOrdNo={''} onClose={handleClosePopup} />}
        </>
    );
}
