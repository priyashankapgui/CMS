import React, { useState, useEffect, useCallback } from 'react';
import Layout from "../../../Layout/Layout";
import "./Sales.css";
import InputField from "../../../Components/InputField/InputField";
import InputDropdown from "../../../Components/InputDropdown/InputDropdown";
import InputLabel from "../../../Components/Label/InputLabel";
import { FiPlus } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { Icon } from "@iconify/react";
import Buttons from '../../../Components/Buttons/SquareButtons/Buttons';
import InputRadio from '../../../Components/InputRadio/InputRadio';
import radioBtnOptions from '../../../Components/Data.json';
import SearchBar from '../../../Components/SearchBar/SearchBar';
import axios from 'axios';
import CustomAlert from '../../../Components/Alerts/CustomAlert/CustomAlert';

export const Sales = () => {
    const initialRowData = {
        id: 1,
        barcode: '',
        productId: '',
        productName: '',
        billQty: '',
        batchNo: '',
        avbQty: '',
        unitPrice: '',
        discountPerItem: '',
        amount: ''
    };

    const [rows, setRows] = useState([initialRowData]);
    const [grossTotal, setGrossTotal] = useState(0);
    const [discountBillRate, setDiscountBillRate] = useState(0);
    const [discountBillAmount, setDiscountBillAmount] = useState(0);
    const [netTotal, setNetTotal] = useState(0);
    const [receivedAmount, setReceivedAmount] = useState('');
    const [balance, setBalance] = useState('');
    const [noBilledQty, setNoBilledQty] = useState(0);
    const [alert, setAlert] = useState({ show: false, severity: '', title: '', message: '' });
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState('');


    useEffect(() => {
        fetchBranches();
    }, []);

    const fetchBranches = async () => {
        try {
            const response = await axios.get('http://localhost:8080/branches');
            setBranches(response.data);
        } catch (error) {
            console.error('Error fetching branches:', error);
        }
    };

    const handleDropdownChange = (value) => {
        setSelectedBranch(value);
        console.log('Selected Drop Down Value:', value);
    };

    const calculateTotals = useCallback(() => {
        let gross = 0;
        let billedQty = 0;

        rows.forEach(row => {
            const amount = row.billQty * row.unitPrice * ((100 - row.discountPerItem) / 100);
            row.amount = isNaN(amount) ? 0 : amount;
            gross += amount;
            billedQty += parseInt(row.billQty) || 0;
        });

        const discountAmount = gross * (discountBillRate / 100);
        const net = gross - discountAmount;
        const bal = receivedAmount - net;

        setGrossTotal(gross.toFixed(2));
        setDiscountBillAmount(discountAmount.toFixed(2));
        setNetTotal(net.toFixed(2));
        setBalance(isNaN(bal) ? null : bal.toFixed(2));
        setNoBilledQty(billedQty);
    }, [rows, discountBillRate, receivedAmount]);

    useEffect(() => {
        calculateTotals();
    }, [rows, discountBillRate, receivedAmount, calculateTotals]);

    const handleAddRow = () => {
        const lastRow = rows[rows.length - 1];
        if (!lastRow.barcode && !lastRow.productName) {
            setAlert({
                show: true,
                severity: 'warning',
                title: 'Please Add Barcode or Product Name',
                message: 'You cannot go forward'
            });
        }
        else if (!lastRow.billQty) {
            setAlert({
                show: true,
                severity: 'warning',
                title: 'Please Add Bill Qty',
                message: 'You cannot go forward'
            });
        }
        else {
            const newRow = {
                ...initialRowData,
                id: rows.length + 1,
            };
            setRows([...rows, newRow]);
            setAlert({ show: false });
        }
    };

    const handleDeleteRow = (id) => {
        if (id === 1) {
            // Clear data for the first row
            setRows(rows.map(row => (row.id === 1 ? initialRowData : row)));
        } else {
            // Delete other rows
            setRows(rows.filter(row => row.id !== id));
        }
    };

    const handleInputChange = (e, id) => {
        const { name, value } = e.target;
        setRows(rows.map(row => row.id === id ? { ...row, [name]: value } : row));
    };

    const handleCloseAlert = () => {
        setAlert({ show: false, severity: '', title: '', message: '' });
    };




    const fetchDataByBarcode = async (barcode, id) => {
        try {
            const response = await axios.get(`http://localhost:8080/product-batch-sum/barcode/${barcode}`);
            const data = response.data;
            if (data) {
                setRows(rows.map(row =>
                    row.id === id
                        ? {
                            ...row,
                            barcode: data.barcode || "",
                            productId: data.productId || "",
                            productName: data.productName || "",
                            batchNo: data.batchNo || "",
                            unitPrice: data.sellingPrice || "",
                            avbQty: data.totalAvailableQty || "",
                            discount: data.discount || ""
                        }
                        : row
                ));
            }
        } catch (error) {
            console.error('Error fetching product data by barcode:', error);
        }
    };

    const fetchSuggestions = async (searchTerm) => {
        try {
            const response = await axios.get(`http://localhost:8080/product-batch-sum`);
            const data = response.data;
            return data
                .filter(item => {
                    const productText = `${item.productId} ${item.productName}`;
                    return productText.toLowerCase().includes(searchTerm.toLowerCase());
                })
                .map(item => ({
                    productId: item.productId,
                    productName: item.productName,
                    displayText: `${item.productId} ${item.productName}`
                }));
        } catch (error) {
            console.error('Error fetching product suggestions:', error);
            return [];
        }
    };

    const handleBarcodeChange = async (e, id) => {
        const barcode = e.target.value;
        handleInputChange(e, id);
        await fetchDataByBarcode(barcode, id);
    };
    const handleSuggestionSelect = (suggestion, id) => {
        setRows(rows.map(row =>
            row.id === id
                ? {
                    ...row,
                    productId: suggestion.productId,
                    productName: suggestion.productName, 
                    barcode: "",
                    batchNo: "",
                    unitPrice: "",
                    avbQty: "",
                    discount: "",
                }
                : row
        ));
        fetchDataByProductId(suggestion.productId, id);
    };

    const fetchDataByProductId = async (productId, id) => {
        try {
            const response = await axios.get(`http://localhost:8080/product-batch-sum/${productId}`);
            const data = response.data;
            setRows(rows.map(row =>
                row.id === id
                    ? {
                        ...row,
                        productId: data.productId || "",
                        barcode: data.barcode || "",
                        productName: data.productName || "",
                        batchNo: data.batchNo || "",
                        unitPrice: data.sellingPrice || "",
                        avbQty: data.totalAvailableQty || "",
                        discount: data.discount || ""
                    }
                    : row
            ));
        } catch (error) {
            console.error('Error fetching product data by productId:', error);
        }
    };


    return (
        <>
            {alert.show && (
                <CustomAlert
                    severity={alert.severity}
                    title={alert.title}
                    message={alert.message}
                    duration={3000}
                    onClose={handleCloseAlert}
                />
            )}
            <div className="top-nav-blue-text">
                <h4>Sales</h4>
            </div>
            <Layout>
                <div className="salesBody">
                    <div className="sales-top-content">
                        <div className="branchName">
                            <InputLabel for="branchName" color="#0377A8">Branch</InputLabel>
                            <InputDropdown
                                id="branchName"
                                name="branchName"
                                editable={true}
                                options={branches.map(branch => branch.branchName)}
                                onChange={handleDropdownChange}
                            />
                        </div>
                        <div className="customerName">
                            <InputLabel for="customerName" color="#0377A8">Customer Name</InputLabel>
                            <InputField type="text" id="customerName" name="customerName" editable={true} />
                        </div>
                        <div className="contactNo">
                            <InputLabel for="contactNo" color="#0377A8">Contact No</InputLabel>
                            <InputField type="text" id="contactNo" name="contactNo" editable={true} />
                        </div>
                    </div>

                    <div className="billContainer">
                        <table className='billContainerTable'>
                            <thead>
                                <tr>
                                    <th>Barcode</th>
                                    <th>Product ID / Name</th>
                                    <th>Qty</th>
                                    <th>Batch No</th>
                                    <th>Avb. Qty</th>
                                    <th>Unit Price</th>
                                    <th>Dis%</th>
                                    <th>Amount</th>
                                    <th />
                                    <th />
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map(row => (
                                    <tr key={row.id}>
                                        <td>
                                            <InputField
                                                type="text"
                                                id={`barcode_${row.id}`}
                                                name="barcode"
                                                editable={true}
                                                width="100%"
                                                value={row.barcode}
                                                onChange={(e) => handleBarcodeChange(e, row.id)}
                                            />
                                        </td>
                                        <td>
                                            <SearchBar
                                                searchTerm={row.productName}
                                                setSearchTerm={(term) => setRows(rows.map(r => r.id === row.id ? { ...r, productName: term } : r))}
                                                onSelectSuggestion={(suggestion) => handleSuggestionSelect(suggestion, row.id)}
                                                fetchSuggestions={fetchSuggestions}
                                            />
                                        </td>
                                        <td>
                                            <InputField
                                                type="number"
                                                id={`billQty_${row.id}`}
                                                name="billQty"
                                                editable={true}
                                                width="100%"
                                                value={row.billQty}
                                                onChange={(e) => handleInputChange(e, row.id)}
                                            />
                                        </td>
                                        <td>
                                            <InputField
                                                type="text"
                                                id={`batchNo_${row.id}`}
                                                name="batchNo"
                                                editable={false}
                                                width="100%"
                                                value={row.batchNo}
                                            />
                                        </td>
                                        <td>
                                            <InputField
                                                type="number"
                                                id={`avbQty_${row.id}`}
                                                name="avbQty"
                                                editable={false}
                                                width="100%"
                                                value={row.avbQty}
                                            />
                                        </td>
                                        <td>
                                            <InputField
                                                type="number"
                                                id={`unitPrice_${row.id}`}
                                                name="unitPrice"
                                                editable={false}
                                                width="100%"
                                                value={row.unitPrice}
                                            />
                                        </td>
                                        <td>
                                            <InputField
                                                type="text"
                                                id={`discountPerItem_${row.id}`}
                                                name="discountPerItem"
                                                editable={false}
                                                width="100%"
                                                value={row.discount}
                                               
                                            />
                                        </td>
                                        <td>
                                            <InputField
                                                type="number"
                                                id={`amount_${row.id}`}
                                                name="amount"
                                                editable={false}
                                                width="100%"
                                                value={(row.billQty * row.unitPrice * ((100 - row.discountPerItem) / 100)).toFixed(2)}
                                            />
                                        </td>
                                        <td>
                                            <FiPlus onClick={handleAddRow} style={{ cursor: 'pointer', marginRight: '12px' }} />
                                        </td>
                                        <td>
                                            <AiOutlineDelete onClick={() => handleDeleteRow(row.id)} style={{ cursor: 'pointer' }} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="paymentContainerWrapper">
                        <div className="paymentContainer">
                            <div className="payment-method-top">
                                <h3>Select Payment Method</h3>
                                <InputRadio name="paymentMethod" options={radioBtnOptions.radioBtnOptions} />
                            </div>
                            <div className="payment-method-middle">
                                <table>
                                    <tbody>
                                        <tr>
                                            <td><InputLabel for="grossTotal" color="#0377A8">Gross Total</InputLabel></td>
                                            <td><InputField type="text" id="grossTotal" name="grossTotal" editable={false} marginTop="0" value={grossTotal} /></td>
                                        </tr>
                                        <tr>
                                            <td><InputLabel for="discountBill" color="#0377A8">Discount %</InputLabel></td>
                                            <td>
                                                <div className="discountFieldsContainer">
                                                    <InputField
                                                        type="text"
                                                        id="discountBillRate"
                                                        name="discountBillRate"
                                                        className="discountBillRate"
                                                        editable={true}
                                                        placeholder="%"
                                                        width="3em"
                                                        value={discountBillRate}
                                                        onChange={(e) => setDiscountBillRate(e.target.value)}
                                                    />
                                                    <InputField
                                                        type="text"
                                                        id="discountBillAmount"
                                                        name="discountBillAmount"
                                                        className="discountBillAmount"
                                                        editable={false}
                                                        width="23.7em"
                                                        value={discountBillAmount}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><InputLabel for="netTotal" color="#0377A8" fontSize="1.125em" fontWeight="510">Net Total</InputLabel></td>
                                            <td><InputField type="text" id="netTotal" name="netTotal" editable={false} marginTop="0" value={netTotal} /></td>
                                        </tr>
                                        <tr>
                                            <td><InputLabel for="receivedAmount" color="#0377A8">Received</InputLabel></td>
                                            <td><InputField type="text" id="receivedAmount" name="receivedAmount" editable={true} placeholder={"0.00"} marginTop="0" value={receivedAmount} onChange={(e) => setReceivedAmount(e.target.value)} /></td>
                                        </tr>
                                        {receivedAmount > 0 && (
                                            <tr>
                                                <td><InputLabel for="balance" color="#0377A8">Balance</InputLabel></td>
                                                <td><InputField type="text" id="balance" name="balance" editable={false} marginTop="0" value={balance} /></td>
                                            </tr>
                                        )}
                                        <tr>
                                            <td><InputLabel for="noBilledQty" color="#0377A8">No Qty:</InputLabel></td>
                                            <td><InputField type="text" id="noBilledQty" name="noBilledQty" editable={false} marginTop="0" value={noBilledQty} /></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="payment-method-bottom">
                                <Buttons type="submit" id="save-btn" style={{ backgroundColor: "#23A3DA", color: "white" }}> Save </Buttons>
                                <Buttons type="submit" id="clear-btn" style={{ backgroundColor: "#fafafa", color: "red" }}> Clear </ Buttons>
                            </div>
                            <div className="cardLogos">
                                <Icon icon="fa:cc-visa" />
                                <Icon icon="logos:mastercard" />
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
};
