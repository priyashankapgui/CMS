import React, { useState, useEffect } from 'react';
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
import { ClipLoader } from 'react-spinners';

export const Sales = () => {

    const [selectedBranch, setSelectedBranch] = useState('');
    const [rows, setRows] = useState([createEmptyRow()]);
    const [grossTotal, setGrossTotal] = useState(0);
    const [netTotal, setNetTotal] = useState(0);
    const [receivedAmount, setReceivedAmount] = useState('');
    const [balance, setBalance] = useState(0);
    const [noItems, setNoItems] = useState(0);
    const [alert, setAlert] = useState({
        severity: '',
        title: '',
        message: '',
        open: false
    });
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        calculateTotals();
    }, [rows]);

    const handleDropdownChange = (value) => {
        setSelectedBranch(value);
    };

    const fetchProductsSuggestions = async (searchTerm) => {
        try {
            const response = await axios.get(`http://localhost:8080/products-by-branch?searchTerm=${searchTerm}&branchName=${selectedBranch}`);
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
            const response = await axios.get(`http://localhost:8080/products-by-branch?searchTerm=${suggestion.productId}&branchName=${selectedBranch}`);
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
            const response = await axios.get(`http://localhost:8080/products-by-barcode?barcode=${barcode}&branchName=${selectedBranch}`);
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
        const updatedRows = [...rows];
        updatedRows[rowIndex].productDetails.billQty = billQty;

        const { sellingPrice = 0, discount = 0 } = updatedRows[rowIndex].productDetails;
        const amount = billQty * sellingPrice * (1 - discount / 100);
        updatedRows[rowIndex].productDetails.amount = amount.toFixed(2);

        setRows(updatedRows);
    };

    const addRow = () => {
        const isInvalid = rows.some(row => !row.selectedProduct || !row.productDetails.billQty);

        if (isInvalid) {
            setAlert({
                severity: 'warning',
                title: 'Please fill the required fields',
                message: 'Barcode or Product Name and Bill Qty',
                open: true
            });
        } else {
            setRows([...rows, createEmptyRow()]);
        }
    };

    const deleteRow = (rowIndex) => {
        if (rowIndex === 0) {
            clearRow(rowIndex);
        } else {
            setRows(rows.filter((_, index) => index !== rowIndex));
        }
    };

    const clearRow = (rowIndex) => {
        const updatedRows = [...rows];
        updatedRows[rowIndex] = createEmptyRow();
        setRows(updatedRows);
    };

    const calculateTotals = () => {
        let total = 0;
        let itemCount = 0;

        rows.forEach((row) => {
            if (row.productDetails.amount) {
                total += parseFloat(row.productDetails.amount);
                itemCount++;
            }
        });

        setGrossTotal(total.toFixed(2));
        setNoItems(itemCount);
        calculateNetTotal(total);
    };

    const calculateNetTotal = (total) => {
        if (total === 0) {
            setNetTotal(0);
        } else {
            const discountPercentage = parseFloat(document.getElementById('discountBillRate').value) || 0;
            const net = total - (total * discountPercentage / 100);
            setNetTotal(net.toFixed(2));
        }
    };

    const handleReceivedAmountChange = (e) => {
        const received = parseFloat(e.target.value) || 0;
        setReceivedAmount(received);
        calculateBalance(received);
    };

    const calculateBalance = (received) => {
        const balanceAmount = received - parseFloat(netTotal);
        setBalance(balanceAmount.toFixed(2));
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
        const user = JSON.parse(sessionStorage.getItem("user"));
        console.log("name", user);

        if (netTotal > 0 && !paymentMethodElement) {
            setAlert({
                severity: 'warning',
                title: 'Payment Method & Received Amount Missing',
                message: 'Please add the required things',
                open: true
            });
            return;
        }
        else if (paymentMethodElement && !receivedAmount) {
            setAlert({
                severity: 'warning',
                title: 'Received Amount Missing',
                message: 'Please add the received amount',
                open: true
            });
            return;
        }

        const payload = {
            branchName: selectedBranch,
            customerName: customerNameElement ? customerNameElement.value : '',
            contactNo: contactNoElement ? contactNoElement.value : '',
            paymentMethod: paymentMethodElement.value,
            billedBy: user.userName,
            billTotalAmount: parseFloat(netTotal) || 0,
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
        console.log("Back Data:", payload)
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:8080/bills', payload);
            console.log("Back Data:", payload)

            if (response.status === 200) {
                setAlert({
                    severity: 'success',
                    title: 'Success',
                    message: 'Bill generated successfully!',
                    open: true
                });

                resetForm();
            } else {
                setAlert({
                    severity: 'error',
                    title: 'Error',
                    message: 'Error saving bill data!',
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
        }
        finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setSelectedBranch('');
        setRows([createEmptyRow()]);
        setGrossTotal(0);
        setNetTotal(0);
        setReceivedAmount(0);
        setBalance(0);
        setNoItems(0);

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
        const discountBillRateElement = document.getElementById('discountBillRate');
        if (discountBillRateElement) discountBillRateElement.value = '';
        const paymentMethodElements = document.querySelectorAll('input[name="paymentMethod"]');
        paymentMethodElements.forEach(element => {
            element.checked = false;
        });
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
                    <div className="sales-top-content">
                        <div className="branchName">
                            <InputLabel htmlFor="branchName" color="#0377A8">Branch</InputLabel>
                            <BranchDropdown
                                id="branchName"
                                name="branchName"
                                editable={true}
                                onChange={(e) => handleDropdownChange(e)}
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
                                        <h3>Select Payment Method</h3>
                                        <InputRadio
                                            name="paymentMethod"
                                            options={[
                                                { value: 'cash', label: 'Cash' },
                                                { value: 'card', label: 'Card' }
                                            ]}
                                        />
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
                                                                onChange={() => calculateNetTotal(grossTotal)}
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
                                                    <td><InputField type="text" id="receivedAmount" name="receivedAmount" editable={true} placeholder="0.00" value={receivedAmount} onChange={(e) => handleReceivedAmountChange(e)} /></td>
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