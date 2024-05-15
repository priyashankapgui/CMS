import React, { useState } from 'react';
import Layout from "../../../Layout/Layout";
import "./Sales.css";
import InputField from "../../../Components/InputField/InputField";
import InputDropdown from "../../../Components/InputDropdown/InputDropdown";
import InputLabel from "../../../Components/Label/InputLabel";
import { FiPlus } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { Icon } from "@iconify/react";
import SearchBar from '../../../Components/SearchBar/SearchBar';
import Buttons from '../../../Components/Buttons/SquareButtons/Buttons';
import dropdownOptions from '../../../Components/Data.json';
import InputRadio from '../../../Components/InputRadio/InputRadio';
import radioBtnOptions from '../../../Components/Data.json';


export const Sales = () => {

    const [rows, setRows] = useState([
        { id: 1, productID: '', productName: '', billQty: '', batchNo: '', avbQty: '', unitPrice: '', discount: '', amount: '' }
    ]);

    const handleAddRow = () => {
        const newRow = { id: rows.length + 1, productID: '', productName: '', billQty: '', batchNo: '', avbQty: '', unitPrice: '', discount: '', amount: '' };
        setRows([...rows, newRow]);
    };

    const handleDeleteRow = (id) => {
        if (id === 1) {
            // Clear the entered data in the fields of the first row
            const updatedRows = rows.map(row => {
                if (row.id === 1) {
                    return { ...row, productID: '', productName: '', billQty: '', batchNo: '', avbQty: '', unitPrice: '', discount: '', amount: '' };
                }
                return row;
            });
            setRows(updatedRows);
        } else {
            // Remove the respective row
            const updatedRows = rows.filter(row => row.id !== id);
            setRows(updatedRows);
        }
    };

    const handleInputChange = (id, name, value) => {
        const updatedRows = rows.map(row => {
            if (row.id === id) {
                return { ...row, [name]: value };
            }
            return row;
        });
        setRows(updatedRows);

        if (name === 'productId' || name === 'productName') {
            const productDetails = await fetchProductDetails(value);
            if (productDetails) {
                const { avbQty, batchNo, unitPrice, productName } = productDetails;
                const updatedRows = rows.map(row => {
                    if (row.id === id) {
                        return { ...row, avbQty, batchNo, unitPrice, productName };
                    }
                    return row;
                });
                setRows(updatedRows);
            }
        }
    };

    const [branchName, setBranchName] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [contactNo, setContactNo] = useState('');
    const [grossTotal, setGrossTotal] = useState('');
    const [discountRate, setDiscountRate] = useState('');
    const [netTotal, setNetTotal] = useState('');
    const [received, setReceived] = useState('');
    const [balance, setBalance] = useState('');
    const [error, setError] = useState(null);

    const handleBranchNameChange = (event) => {
        setBranchName(event.target.value);
    };

    const handleCustomerNameChange = (event) => {
        setCustomerName(event.target.value);
    };

    const handleContactNoChange = (event) => {
        setContactNo(event.target.value);
    };

    const handleGrossTotalChange = (event) => {
        setGrossTotal(event.target.value);
    };

    const handleDiscountRateChange = (event) => {
        setDiscountRate(event.target.value);
    };

    const handleReceivedChange = (event) => {
        setReceived(event.target.value);
    };

    return (
        <>
            <div className="top-nav-blue-text">
                <h4>Sales</h4>
            </div>
            <Layout>
                <div className="salesBody">
                    <div className="sales-top-content">
                        <div className="branchName">
                            <InputLabel for="branchName" color="#0377A8">Branch</InputLabel>
                            <InputDropdown id="branchName" name="branchName" editable={true} options={dropdownOptions.dropDownOptions.branchOptions} value={branchName} onChange={handleBranchNameChange} />
                        </div>
                        <div className="customerName">
                            <InputLabel for="customerName" color="#0377A8" fontsize="">Customer Name</InputLabel>
                            <InputField type="text" id="customerName" name="customerName" editable={true} value={customerName} onChange={handleCustomerNameChange} />
                        </div>
                        <div className="contactNo">
                            <InputLabel for="contactNo" color="#0377A8">Contact No</InputLabel>
                            <InputField type="text" id="contactNo" name="contactNo" editable={true} />
                        </div>
                    </div>
                    <div className="billContainer">
                        <table>
                            <thead style={{ backgroundColor: "#E9E9E9", fontSize: "0.875em" }}>
                                <tr >
                                    <th>Product ID</th>
                                    <th>Product Name</th>
                                    <th>Qty</th>
                                    <th>Batch No</th>
                                    <th>Avb. Qty</th>
                                    <th>Unit Price</th>
                                    <th>Dis%</th>
                                    <th>Amount</th>

                                </tr>
                            </thead>
                            <tbody>
                                {rows.map(row => (
                                    <tr key={row.id}>
                                        <td>
                                            <SearchBar fetchSuggestions={fetchSuggestionsProducts} onSuggestionSelect={(productId) => handleInputChange(row.id, 'productId', productId)} />
                                        </td>
                                        <td><InputField type="text" id={`billQty_${row.id}`} name="billQty" editable={true} width="90px" value={row.billQty} onChange={(e) => handleInputChange(row.id, 'billQty', e.target.value)} /></td>
                                        <td><InputDropdown id={`batchNo_${row.id}`} name="batchNo" width="154px" options={['', '', '']} editable={true} value={row.batchNo} onChange={(e) => handleInputChange(row.id, 'batchNo', e.target.value)} /></td>                        {/* <td><InputField type="text" id={`batchNo_${row.id}`} name="batchNo" editable="true" width="154px" value={row.batchNo} onChange={(e) => handleInputChange(row.id, 'batchNo', e.target.value)} /></td> */}
                                        <td><InputField type="text" id={`avbQty_${row.id}`} name="avbQty" editable={false} width="90px" value={row.avbQty} onChange={(e) => handleInputChange(row.id, 'avbQty', e.target.value)} /></td>
                                        <td><InputField type="text" id={`unitPrice_${row.id}`} name="unitPrice" editable={false} width="95px" value={row.unitPrice} onChange={(e) => handleInputChange(row.id, 'unitPrice', e.target.value)} /></td>
                                        <td><InputField type="text" id={`discount_${row.id}`} name="discount" editable={true} width="60px" value={row.discount} onChange={(e) => handleInputChange(row.id, 'discount', e.target.value)} /></td>
                                        <td><InputField type="text" id={`amount_${row.id}`} name="amount" editable={false} width="95px" value={row.amount} onChange={(e) => handleInputChange(row.id, 'amount', e.target.value)} /></td>
                                        <td style={{ paddingRight: '15px', cursor: 'pointer' }}><FiPlus onClick={handleAddRow} style={{ cursor: 'pointer' }} /></td>
                                        <td><AiOutlineDelete onClick={() => handleDeleteRow(row.id)} style={{cursor: 'pointer' }}/></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="paymentContainerWrapper">
                        <div className="paymentContainer">
                            <div className="payment-method-top">
                                <h3>Select Payment Method</h3>
                                <InputRadio options={radioBtnOptions.radioBtnOptions} />
                            </div>
                            <div className="payment-method-middle">
                                <div className="payment-method-middle">
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td><InputLabel for="grossTotal" color="#0377A8">Gross Total</InputLabel></td>
                                                <td><InputField type="text" id="grossTotal" name="grossTotal" editable={false} marginTop="0" value={grossTotal} onChange={handleGrossTotalChange} /></td>
                                            </tr>
                                            <tr>
                                                <td><InputLabel for="discount" color="#0377A8">Discount %</InputLabel></td>
                                                <td>
                                                    <div className="discountFieldsContainer">
                                                        <InputField type="text" id="discountRate" name="discountRate" className="discountRate" editable={true} placeholder="%" width="3em" value={discountRate} onChange={handleDiscountRateChange} />
                                                        <InputField type="text" id="discountAmount" name="discountAmount" className="discountAmount" editable={false} width="23.7em" />
                                                    </div>
                                                </td>

                                            </tr>

                                            <tr>
                                                <td><InputLabel for="netTotal" color="#0377A8" fontSize="1.125em" fontweight="510">Net Total</InputLabel></td>
                                                <td><InputField type="tect" id="netTotal" name="netTotal" editable={false} marginTop="0" value={netTotal} onChange={(e) => setNetTotal(e.target.value)} /></td>
                                            </tr>
                                            <tr>
                                                <td><InputLabel for="received" color="#0377A8">Received</InputLabel></td>
                                                <td><InputField type="text" id="received" name="received" editable={true} marginTop="0" value={received} onChange={handleReceivedChange} /></td>
                                            </tr>
                                            <tr>
                                                <td><InputLabel for="balance" color="#0377A8">Balance</InputLabel></td>
                                                <td><InputField type="text" id="balance" name="balance" editable={false} marginTop="0" value={balance} onChange={(e) => setBalance(e.target.value)} /></td>
                                            </tr>
                                            <tr>
                                                <td><InputLabel for="noQty" color="#0377A8">No Qty:</InputLabel></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="payment-method-bottom">
                                    <Buttons type="submit" id="save-btn" style={{ backgroundColor: "#23A3DA", color: "white" }}> Save </Buttons>
                                    <Buttons type="submit" id="clear-btn" style={{ backgroundColor: "#fafafa", color: "red" }}> Clear </Buttons>
                                </div>
                                <div className="cardLogos">
                                    <Icon icon="fa:cc-visa" />
                                    <Icon icon="logos:mastercard" />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </Layout>
        </>
    );
};
