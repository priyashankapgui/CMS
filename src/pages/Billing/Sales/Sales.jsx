import React, { useState, useEffect, useCallback } from 'react';
import Layout from "../../../Layout/Layout";
import "./Sales.css";
import InputField from "../../../Components/InputField/InputField";
import BranchDropdown from '../../../Components/InputDropdown/BranchDropdown';
import InputDropdown from "../../../Components/InputDropdown/InputDropdown";
import InputLabel from "../../../Components/Label/InputLabel";
import { FiPlus } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { Icon } from "@iconify/react";
import Buttons from '../../../Components/Buttons/SquareButtons/Buttons';
import InputRadio from '../../../Components/InputRadio/InputRadio';
import SearchBar from '../../../Components/SearchBar/SearchBar';
import axios from 'axios';
import CustomAlert from '../../../Components/Alerts/CustomAlert/CustomAlert';
import SubSpinner from '../../../Components/Spinner/SubSpinner/SubSpinner'
import secureLocalStorage from "react-secure-storage";
import SalesReceipt from '../../../Components/SalesReceiptTemp/SalesReceipt/SalesReceipt';

const productByBarcodeUrl = process.env.REACT_APP_PRODUCTS_BY_BARCODE_API;
const productByBranchUrl = process.env.REACT_APP_PRODUCTS_BY_BRANCH_API;
const sendBillDataUrl = process.env.REACT_APP_SENDBILL_DATA_API;


export const Sales = () => {

    const [selectedBranch, setSelectedBranch] = useState('');
    const [rows, setRows] = useState([createEmptyRow()]);
    const [grossTotal, setGrossTotal] = useState(0);
    const [netTotal, setNetTotal] = useState(0);
    const [receivedAmount, setReceivedAmount] = useState();
    const [balance, setBalance] = useState(0);
    const [noItems, setNoItems] = useState(0);
    const [discountBillRate, setDiscountBillRate] = useState(0);
    const [alert, setAlert] = useState({
        severity: '',
        title: '',
        message: '',
        open: false
    });
    const [loading, setLoading] = useState(false);
    const [billNo, setBillNo] = useState(null);
    const [showSalesReceipt, setShowSalesReceipt] = useState(false);
    const [userDetails, setUserDetails] = useState({
        username: ""
    });

    const calculateTotals = useCallback(() => {
        let totalGross = 0;
        let totalNet = 0;
        let itemCount = 0;

        rows.forEach((row) => {
            const { billQty = 0, sellingPrice = 0, discount = 0 } = row.productDetails;
            const amount = billQty * sellingPrice * (1 - discount / 100);
            row.productDetails.amount = amount.toFixed(2);

            totalGross += billQty * sellingPrice;
            totalNet += amount;
            if (billQty > 0) itemCount++;
        });

        setGrossTotal(totalGross.toFixed(2));
        setNetTotal(totalNet.toFixed(2));
        setNoItems(itemCount);

        if (discountBillRate > 0) {
            const additionalDiscount = totalNet * (discountBillRate / 100);
            const newNetTotal = totalNet - additionalDiscount;

            setNetTotal(newNetTotal.toFixed(2));
        }

        const calculatedBalance = receivedAmount - netTotal;
        setBalance(calculatedBalance.toFixed(2));
    }, [rows, discountBillRate, receivedAmount, netTotal]);

    useEffect(() => {
        calculateTotals();
    }, [rows, discountBillRate, receivedAmount, calculateTotals]);

    useEffect(() => {
        const userJSON = secureLocalStorage.getItem("user");
        if (userJSON) {
            const user = JSON.parse(userJSON);
            setUserDetails({
                username: user?.userName || user?.employeeName || "",
            });
        }
    }, []);

    const handleBranchDropdownChange = (value) => {
        setSelectedBranch(value);
    };

    const fetchProductsSuggestions = async (searchTerm) => {
        if (!selectedBranch) {
            console.error('Branch not selected');
            return [];
        }
        try {
            const response = await axios.get(`${productByBranchUrl}?searchTerm=${searchTerm}&branchName=${selectedBranch}`);
            const productMap = new Map();

            response.data.forEach((product) => {
                if (!productMap.has(product.productId)) {
                    productMap.set(product.productId, {
                        barcode: product.barcode,
                        productId: product.productId,
                        productName: product.productName,
                        branchName: product.branchName,
                        displayText: `${product.productId} ${product.productName}`,
                    });
                }
            });

            return Array.from(productMap.values());
        } catch (error) {
            console.error('Error fetching product suggestions:', error);
            return [];
        }
    };

    const handleProductSelection = async (suggestion, rowIndex) => {
        try {
            const response = await axios.get(`${productByBranchUrl}?searchTerm=${suggestion.productId}&branchName=${selectedBranch}`);
            const productData = response.data;

            const updatedRows = [...rows];
            const batchNumbers = productData.map((product) => product.batchNo);

            updatedRows[rowIndex] = {
                ...updatedRows[rowIndex],
                selectedProduct: suggestion.displayText,
                suggestions: productData,
                batchOptions: batchNumbers,
                productDetails: productData[0] || {
                    barcode: '',
                    batchNo: '',
                    totalAvailableQty: '',
                    sellingPrice: '',
                    discount: ''
                }
            };

            setRows(updatedRows);
        } catch (error) {
            console.error('Error fetching product by ID for batch details:', error);
        }
    };

    const fetchProductsByBarcode = async (barcode, rowIndex) => {
        try {
            const response = await axios.get(`${productByBarcodeUrl}?barcode=${barcode}&branchName=${selectedBranch}`);
            if (response.data.length > 0) {
                const product = response.data[0];
                const updatedRows = [...rows];
                updatedRows[rowIndex].productDetails = product;
                updatedRows[rowIndex].selectedProduct = `${product.productId} ${product.productName}`;
                updatedRows[rowIndex].suggestions = response.data.map((product) => ({
                    productId: product.productId,
                    productName: product.productName,
                    batchNo: product.batchNo,
                    barcode: product.barcode,
                    totalAvailableQty: product.totalAvailableQty,
                    discount: product.discount,
                    branchId: product.branchId,
                    branchName: product.branchName,
                    expDate: product.expDate,
                    sellingPrice: product.sellingPrice,
                    displayText: `${product.productId} ${product.productName}`,
                }));

                const batchOptions = response.data.map((product) => product.batchNo);
                updatedRows[rowIndex].batchOptions = batchOptions;

                if (batchOptions.length === 1) {
                    const singleProduct = response.data[0];
                    updatedRows[rowIndex].productDetails = {
                        ...singleProduct,
                        batchNo: singleProduct.batchNo,
                        totalAvailableQty: singleProduct.totalAvailableQty,
                        sellingPrice: singleProduct.sellingPrice,
                        discount: singleProduct.discount,
                    };
                } else {
                    updatedRows[rowIndex].productDetails = {
                        ...product,
                        batchNo: '',
                        totalAvailableQty: '',
                        sellingPrice: '',
                        discount: '',
                    };
                }

                setRows(updatedRows);
            } else {
                clearRow(rowIndex);
            }
        } catch (error) {
            console.error('Error fetching products by barcode:', error);
            clearRow(rowIndex);
        }
    };

    const handleBarcodeChange = (e, rowIndex) => {
        const barcode = e.target.value;
        const updatedRows = [...rows];
        updatedRows[rowIndex].productDetails.barcode = barcode;
        setRows(updatedRows);

        if (barcode.length >= 3) {
            fetchProductsByBarcode(barcode, rowIndex);
        }
    };

    const handleBatchChange = (selectedBatch, rowIndex) => {
        const updatedRows = [...rows];
        const product = updatedRows[rowIndex].suggestions.find((suggestion) => suggestion.batchNo === selectedBatch);
        if (product) {
            updatedRows[rowIndex].productDetails = product;
        } else {
            updatedRows[rowIndex].productDetails = {
                barcode: '',
                batchNo: '',
                totalAvailableQty: '',
                sellingPrice: '',
                discount: ''
            };
        }
        setRows(updatedRows);
    };

    const handleQtyChange = (e, rowIndex) => {
        const billQty = parseFloat(e.target.value) || 0;
        const { totalAvailableQty } = rows[rowIndex].productDetails;

        if (billQty < 0) {
            console.error('Bill Qty cannot be negative.');
            return;
        }

        if (billQty > totalAvailableQty) {
            console.error('Bill Qty cannot exceed available quantity.');
            setAlert({
                severity: 'error',
                title: 'Invalid Quantity',
                message: 'Billing quantity cannot exceed available quantity.',
                open: true
            });
            return;
        }

        const updatedRows = [...rows];
        updatedRows[rowIndex].productDetails.billQty = billQty;

        const { sellingPrice = 0, discount = 0 } = updatedRows[rowIndex].productDetails;
        const amount = billQty * sellingPrice * (1 - discount / 100);
        updatedRows[rowIndex].productDetails.amount = amount.toFixed(2);

        setRows(updatedRows);
    };

    const handleDiscountRateChange = (e) => {
        const rate = parseFloat(e.target.value) || 0;
        setDiscountBillRate(rate);
    };


    const addRow = () => {
        const isInvalid = rows.some(row => (
            !row.selectedProduct ||
            !row.productDetails.billQty ||
            !row.productDetails.totalAvailableQty ||
            !row.productDetails.sellingPrice ||
            row.productDetails.billQty > row.productDetails.totalAvailableQty
        ));

        if (isInvalid) {
            setAlert({
                severity: 'warning',
                title: 'Warning',
                message: 'Please fill the required fields',
                open: true
            });
        } else {
            setRows([...rows, createEmptyRow()]);
        }
    };
    const deleteRow = (index) => {
        if (rows.length > 1) {
            const updatedRows = [...rows];
            updatedRows.splice(index, 1);
            setRows(updatedRows);
        } else {
            clearRow(0);
        }
    };

    const clearRow = (index) => {
        const updatedRows = [...rows];
        updatedRows[index] = createEmptyRow();
        setRows(updatedRows);
    };

    const handleReceivedAmountChange = (e) => {
        const amount = parseFloat(e.target.value) || 0;
        setReceivedAmount(amount);
    };
    function createEmptyRow() {
        return {
            selectedProduct: '',
            productDetails: {
                barcode: '',
                batchNo: '',
                totalAvailableQty: '',
                sellingPrice: '',
                discount: '',
                billQty: '',
                amount: '',
            },
            suggestions: [],
            batchOptions: [],
        };
    }

    const handleCloseAlert = () => {
        setAlert({
            ...alert,
            open: false
        });
    };
    const handleSave = async () => {
        const customerNameElement = document.getElementById('customerName');
        const contactNoElement = document.getElementById('contactNo');
        const paymentMethodElement = document.querySelector('input[name="paymentMethod"]:checked');
        const receivedAmountElement = document.getElementById('receivedAmount');

        if (netTotal > 0 && !paymentMethodElement) {
            setAlert({
                severity: 'warning',
                title: 'Payment Method & Received Amount Missing',
                message: 'Please add the required things',
                open: true
            });
            return;
        } else if (paymentMethodElement && !receivedAmountElement.value) {
            setAlert({
                severity: 'warning',
                title: 'Received Amount Missing',
                message: 'Please add the received amount',
                open: true
            });
            return;
        } else if (parseFloat(receivedAmountElement.value) < parseFloat(netTotal)) {
            setAlert({
                severity: 'warning',
                title: 'Received Amount Error',
                message: 'Received amount cannot be less than Net Total',
                open: true
            });
            return;
        }

        const data = {
            branchName: selectedBranch,
            customerName: customerNameElement ? customerNameElement.value : '',
            contactNo: contactNoElement ? contactNoElement.value : '',
            paymentMethod: paymentMethodElement.value,
            billedBy: userDetails.username,
            billTotalAmount: parseFloat(netTotal) || 0,
            receivedAmount: parseFloat(receivedAmountElement.value) || 0,
            products: rows.map(row => ({
                productId: row.productDetails.productId,
                barcode: row.productDetails.barcode,
                batchNo: row.productDetails.batchNo,
                sellingPrice: parseFloat(row.productDetails.sellingPrice) || 0,
                discount: parseFloat(row.productDetails.discount) || 0,
                billQty: parseFloat(row.productDetails.billQty) || 0,
                amount: parseFloat(row.productDetails.amount) || 0,
            }))
        };
        console.log("Backend Data:", data);
        setLoading(true);

        try {
            const response = await axios.post(sendBillDataUrl, data);
            console.log('API Response:', response);

            if (response.status === 200 && response.data.success) {
                setAlert({
                    severity: 'success',
                    title: 'Success',
                    message: 'Bill generated successfully!',
                    open: true
                });

                const billNo = response.data.data.newBill.billNo;
                setBillNo(billNo);
                setShowSalesReceipt(true);
                resetForm();
                console.log('Bill number set:', billNo);

            } else {
                setAlert({
                    severity: 'error',
                    title: 'Error',
                    message: 'Error saving data!',
                    open: true
                });
            }
        } catch (error) {
            console.error('Error saving data:', error);
            setAlert({
                severity: 'error',
                title: 'Error',
                message: 'Error saving data!',
                open: true
            });
        } finally {
            setLoading(false);
        }
    };


    const resetForm = () => {
        setRows([createEmptyRow()]);
        setGrossTotal(0);
        setNetTotal(0);
        setReceivedAmount('');
        setBalance(0);
        setNoItems(0);
        setDiscountBillRate(0);

        // Clear customerName and contactNo fields
        const customerNameElement = document.getElementById('customerName');
        if (customerNameElement) customerNameElement.value = '';

        const contactNoElement = document.getElementById('contactNo');
        if (contactNoElement) contactNoElement.value = '';
        // Clear payment method radio buttons
        const paymentMethodElements = document.querySelectorAll('input[name="paymentMethod"]');
        paymentMethodElements.forEach(element => {
            element.checked = false;
        });

        // Recalculate totals
        calculateTotals();

    };

    const handleClear = () => {
        setReceivedAmount('');
        setBalance(0);
        setAlert({
            severity: 'info',
            title: 'Cleared',
            message: 'Payment container data cleared',
            open: true
        });

        // Clear discount related fields
        setDiscountBillRate(0);

        // Clear discount rate input field
        const discountBillRateElement = document.getElementById('discountBillRate');
        if (discountBillRateElement) discountBillRateElement.value = '';

        // Clear payment method radio buttons
        const paymentMethodElements = document.querySelectorAll('input[name="paymentMethod"]');
        paymentMethodElements.forEach(element => {
            element.checked = false;
        });

        // Recalculate totals
        calculateTotals();
    };

    const handleCloseReceipt = () => {
        setShowSalesReceipt(false);
    };

    return (
        <>
            {alert.open && (
                <CustomAlert
                    severity={alert.severity}
                    title={alert.title}
                    message={alert.message}
                    duration={4000}
                    onClose={handleCloseAlert}
                />
            )}
            <div className="top-nav-blue-text">
                <h4>Sales</h4>
            </div>
            <Layout>
                {loading && (
                    <div className="loading-overlay">
                        <SubSpinner spinnerText='Saving' />
                    </div>
                )}
                <div className="salesBody">
                    {showSalesReceipt && <SalesReceipt billNo={billNo} onClose={handleCloseReceipt} />}
                    <div className="sales-top-content">
                        <div className="branchName">
                            <InputLabel htmlFor="branchName" color="#0377A8">Branch<span style={{ color: 'red' }}>*</span></InputLabel>
                            <BranchDropdown
                                id="branchName"
                                name="branchName"
                                editable={true}
                                onChange={(e) => handleBranchDropdownChange(e)}
                            />
                        </div>
                        <div className="customerName">
                            <InputLabel htmlFor="customerName" color="#0377A8">Customer Name</InputLabel>
                            <InputField type="text" id="customerName" name="customerName" editable={true} />
                        </div>
                        <div className="contactNo">
                            <InputLabel htmlFor="contactNo" color="#0377A8">Contact No</InputLabel>
                            <InputField type="text" id="contactNo" name="contactNo" editable={true} />
                        </div>
                    </div>
                    <div className='mainBody'>

                        <>
                            <div className="billContainer">
                                <table className='billContainerTable'>
                                    <thead>
                                        <tr>
                                            <th>Barcode</th>
                                            <th>Product ID / Name</th>
                                            <th>Batch No</th>
                                            <th>Bill Qty</th>
                                            <th>Unit Price</th>
                                            <th>Avb. Qty</th>
                                            <th>Dis</th>
                                            <th>Amount</th>
                                            <th />
                                            <th />
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rows.map((row, rowIndex) => (
                                            <tr key={rowIndex}>
                                                <td>
                                                    <InputField
                                                        type="text"
                                                        id={`barcode-${rowIndex}`}
                                                        name="barcode"
                                                        editable={true}
                                                        width="100%"
                                                        value={row.productDetails.barcode || ''}
                                                        onChange={(e) => handleBarcodeChange(e, rowIndex)}
                                                    />
                                                </td>
                                                <td>
                                                    <SearchBar
                                                        searchTerm={row.selectedProduct}
                                                        setSearchTerm={(term) => {
                                                            const updatedRows = [...rows];
                                                            updatedRows[rowIndex].selectedProduct = term;
                                                            setRows(updatedRows);
                                                        }}
                                                        onSelectSuggestion={(suggestion) => handleProductSelection(suggestion, rowIndex)}
                                                        fetchSuggestions={fetchProductsSuggestions}
                                                    />
                                                </td>
                                                <td>
                                                    {row.batchOptions.length > 1 ? (
                                                        <InputDropdown
                                                            id={`batchNo-${rowIndex}`}
                                                            name="batchNo"
                                                            editable={true}
                                                            width="100%"
                                                            value={row.productDetails.batchNo || ''}
                                                            onChange={(e) => handleBatchChange(e, rowIndex)}
                                                            options={row.batchOptions}
                                                        />
                                                    ) : (
                                                        <InputField
                                                            type="text"
                                                            id={`batchNo-${rowIndex}`}
                                                            name="batchNo"
                                                            editable={false}
                                                            width="100%"
                                                            textAlign="center"
                                                            value={row.productDetails.batchNo || ''}
                                                        />
                                                    )}
                                                </td>
                                                <td>
                                                    <InputField
                                                        type="number"
                                                        id={`billQty-${rowIndex}`}
                                                        name="billQty"
                                                        editable={true}
                                                        width="100%"
                                                        textAlign="center"
                                                        value={row.productDetails.billQty || ''}
                                                        onChange={(e) => handleQtyChange(e, rowIndex)}
                                                    />
                                                </td>
                                                <td>
                                                    <InputField
                                                        type="number"
                                                        id={`unitPrice-${rowIndex}`}
                                                        name="unitPrice"
                                                        editable={false}
                                                        textAlign="right"
                                                        width="100%"
                                                        value={row.productDetails.sellingPrice || ''}
                                                    />
                                                </td>
                                                <td>
                                                    <InputField
                                                        type="number"
                                                        id={`avbQty-${rowIndex}`}
                                                        name="avbQty"
                                                        editable={false}
                                                        width="100%"
                                                        textAlign="center"
                                                        value={row.productDetails.totalAvailableQty || ''}
                                                    />
                                                </td>
                                                <td>
                                                    <InputField
                                                        type="text"
                                                        id={`discountPerItem-${rowIndex}`}
                                                        name="discountPerItem"
                                                        editable={false}
                                                        width="100%"
                                                        textAlign="center"
                                                        value={row.productDetails.discount || ''}
                                                    />
                                                </td>
                                                <td>
                                                    <InputField
                                                        type="text"
                                                        id={`amount-${rowIndex}`}
                                                        name="amount"
                                                        editable={false}
                                                        width="100%"
                                                        textAlign="right"
                                                        value={row.productDetails.amount || ''}
                                                    />
                                                </td>
                                                <td>
                                                    <FiPlus onClick={addRow} style={{ cursor: 'pointer', marginRight: '12px' }} />
                                                </td>
                                                <td>
                                                    <AiOutlineDelete onClick={() => deleteRow(rowIndex)} style={{ cursor: 'pointer' }} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="paymentContainerWrapper">
                                <div className="paymentContainer">
                                    <div className="payment-method-top">
                                        <h3>Select Payment Method<span style={{ color: 'red' }}>*</span></h3>
                                        <div className='paymentRadio'>
                                            <InputRadio
                                                name="paymentMethod"
                                                options={[
                                                    { value: 'Cash', label: 'Cash' },
                                                    { value: 'Card', label: 'Card' }
                                                ]}
                                            />
                                        </div>
                                    </div>
                                    <div className="payment-method-middle">
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <td><InputLabel htmlFor="noItems" color="#0377A8">No Items:</InputLabel></td>
                                                    <td><InputField type="text" id="noItems" name="noItems" editable={false} value={noItems} /></td>
                                                </tr>
                                                <tr>
                                                    <td><InputLabel htmlFor="grossTotal" color="#0377A8">Gross Total</InputLabel></td>
                                                    <td><InputField type="text" id="grossTotal" name="grossTotal" editable={false} value={grossTotal} /></td>
                                                </tr>
                                                <tr>
                                                    <td><InputLabel htmlFor="discountBill" color="#0377A8">Discount %</InputLabel></td>
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
                                                                onChange={handleDiscountRateChange}
                                                            />
                                                            <InputField
                                                                type="text"
                                                                id="discountBillAmount"
                                                                name="discountBillAmount"
                                                                className="discountBillAmount"
                                                                editable={false}
                                                                value={(grossTotal - netTotal).toFixed(2)}
                                                                width="23.7em"
                                                            />
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td><InputLabel htmlFor="netTotal" color="#0377A8" fontSize="18px" fontWeight="510">Net Total</InputLabel></td>
                                                    <td><InputField type="text" id="netTotal" name="netTotal" editable={false} value={netTotal} /></td>
                                                </tr>
                                                <tr>
                                                    <td><InputLabel htmlFor="receivedAmount" color="#0377A8">Received</InputLabel></td>
                                                    <td><InputField type="number" id="receivedAmount" name="receivedAmount" editable={true} placeholder="0.00" value={receivedAmount} onChange={(e) => handleReceivedAmountChange(e)} /></td>
                                                </tr>
                                                {receivedAmount > 0 && (
                                                    <tr>
                                                        <td><InputLabel htmlFor="balance" color="#0377A8">Balance</InputLabel></td>
                                                        <td><InputField type="text" id="balance" name="balance" editable={false} value={balance} /></td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="payment-method-bottom">
                                        <Buttons type="button" id="save-btn" style={{ backgroundColor: "#23A3DA", color: "white" }} onClick={handleSave}> Save </Buttons>
                                        <Buttons type="button" id="clear-btn" style={{ backgroundColor: "#fafafa", color: "red" }} onClick={handleClear}> Clear </Buttons>
                                    </div>
                                    <div className="cardLogos">
                                        <Icon icon="game-icons:cash" />
                                        <Icon icon="fa:cc-visa" />
                                        <Icon icon="logos:mastercard" />
                                    </div>
                                </div>
                            </div>
                        </>
                    </div>
                </div>
            </Layout>
        </>
    );
}