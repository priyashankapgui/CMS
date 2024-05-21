import React, { useState, useEffect } from 'react';
import './AddNewGRN.css';
import Layout from "../../../Layout/Layout";
import Buttons from '../../../Components/Buttons/SquareButtons/Buttons';
import { Link } from 'react-router-dom';
import { IoChevronBackCircleOutline } from "react-icons/io5";
import axios from 'axios';
import InputLabel from "../../../Components/Label/InputLabel";
import InputField from "../../../Components/InputField/InputField";
import InputDropdown from "../../../Components/InputDropdown/InputDropdown";
import dropdownOptions from '../../../Components/Data.json';
import SearchBar from '../../../Components/SearchBar/SearchBar';
import { FiPlus } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';

export function AddNewGRN() {

    const url = 'http://localhost:8080/grn'; 

    const [branch, setBranch] = useState(null);
    const [invoiceNo, setInvoiceNo] = useState('');
    const [supplierId, setSupplierId] = useState('');
    const [supplierName, setSupplierName] = useState('');
    const [branchName, setBranchName] = useState('');
    const [productId, setProductId] = useState('');
    const [productName, setProductName] = useState('');
    const [batchNo, setBatchNo] = useState('');
    const [totalQty, setTotalQty] = useState('');
    const [purchasePrice, setPurchasePrice] = useState('');
    const [sellingPrice, setSellingPrice] = useState('');
    const [freeQty, setFreeQty] = useState('');
    const [expDate, setExpDate] = useState('');
    const [amount, setAmount] = useState('');
    const [comment, setComment] = useState('');
    const [rows, setRows] = useState([{ id: 1, productId: '', productName: '', batchNo: '', qty: '', purchasePrice: '', sellingPrice: '', freeQty: '', expDate: '', comment: '', amount: '' }]);

    useEffect(() => {
        fetchSupplierIdByName(); // Fetch supplier ID when supplier name changes
    }, [supplierId]);

    const fetchSupplierIdByName = async () => {
        try {
            const response = await fetch('http://localhost:8080/suppliers?query=${encodeURIComponent(supplierId)}');
            const data = await response.json();
            if (data.length > 0) {
                setSupplierId(data[0].id);
            }
        } catch (error) {
            console.error('Error fetching Supplier ID:', error);
        }
    };



    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (!supplierId) {
                await fetchSupplierIdByName();
            }
            const resp = await axios.post(url, {
                invoiceNo: invoiceNo,
                supplierId: supplierId,
                branchName: branchName,
                products: rows.map(row => ({
                    productId: row.productId,
                    productName: row.productName,
                    batchNo: row.batchNo,
                    totalQty: row.qty,
                    purchasePrice: row.purchasePrice,
                    sellingPrice: row.sellingPrice,
                    freeQty: row.freeQty,
                    expDate: row.expDate,
                    amount: row.amount,
                    comment: row.comment
                }))
            });
            console.log("Response:", resp.data);
            // Clear form after successful save
            setInvoiceNo('');
            setSupplierId('');
            setBranchName('');
            setRows([{ id: 1, productId: '', productName: '', batchNo: '', qty: '', purchasePrice: '', sellingPrice: '', freeQty: '', expDate: '', comment: '', amount: '' }]);
        } catch (error) {
            console.log("Error:", error.response)
        }
    };

    const handleAddRow = () => {
        const newRow = { id: rows.length + 1, productId: '', productName: '', batchNo: '', qty: '', purchasePrice: '', sellingPrice: '', freeQty: '', expDate: '', comment: '', amount: '' };
        setRows([...rows, newRow]);
    };

    // const handleDeleteRow = (id) => {
    //     if (id === 1) {
    //         // Reset all field values if deleting the first row
    //         setInvoiceNo('');
    //         setSupplierId('');
    //         setSupplierName('');
    //         setBranchName('');
    //     } else {
    //         const updatedRows = rows.filter(row => row.id !== id);
    //         setRows(updatedRows);
    //     }
    // };

    const handleDeleteRow = (id) => {
        if (id === 1) {
            const updatedRows = rows.map(row => {
                if (row.id === 1) {
                    return { ...row, productId: '', productName: '', batchNo: '', qty: '', purchasePrice: '', sellingPrice: '', freeQty: '', expDate: '', comment: '', amount: '' };
                }
                return row;
            });
            setRows(updatedRows);
        } else {
            const updatedRows = rows.filter(row => row.id !== id);
            setRows(updatedRows);
        }
    };

        const fetchSuggestionsProducts = async (searchTerm) => {
            try {
                const response = await fetch('http://localhost:8080/products?query=${encodeURIComponent(searchTerm)}');
                const data = await response.json();
                const formattedSuggestions = data.map(item => ({
                    id: item.productId,
                    name: `${item.productId} ${item.productName}` // Add a comma here
                }));
            return formattedSuggestions;
        } catch (error) {
            console.error('Error fetching Product suggestions:', error);
            return [];
        }
    };

const fetchSuggestionsSuppliers = async (searchTerm) => {
    try {
        const response = await fetch('http://localhost:8080/suppliers?query=${encodeURIComponent(searchTerm)}');
        const data = await response.json();
        const formattedSuggestions = data.map(item => ({
            id: item.supplierId,
            name: `${item.supplierId} ${item.supplierName}` // Add a comma here
        }));
        return formattedSuggestions;
    } catch (error) {
        console.error('Error fetching Supplier suggestions:', error);
        return [];
    }
};

const fetchSuggestionsBranches = async (searchTerm) => {
    try {
        const response = await axios.get(`http://localhost:8080/branches?query=${encodeURIComponent(searchTerm)}`);
        return response.data.map(item => ({
            id: item.branchId,
            name: `${item.branchId} ${item.branchName}`
        }));
    } catch (error) {
        console.error('Error fetching branch suggestions:', error);
        return [];
    }
};

const handleSupplierSelect = (id, name) => {
    setSupplierId(id);
    setSupplierName(name);
};

const handleProductSelect = (id, name, rowId) => {
    const updatedRows = rows.map(row => {
        if (row.id === rowId) {
            return { ...row, productId: id, productName: name };
        }
        return row;
    });
    setRows(updatedRows);
};

const handleBranchSelect = (selectedBranch) => {
    setBranch(selectedBranch);
};

const handleInputChange = async (id, name, value) => {
    const updatedRows = rows.map(row => {
        if (row.id === id) {
            return { ...row, [name]: value };
        }
        return row;
    });
    setRows(updatedRows);

    if (name === 'qty' || name === 'freeQty' || name === 'purchasePrice') {
        const qty = parseFloat(updatedRows.find(row => row.id === id).qty || 0);
        const freeQty = parseFloat(updatedRows.find(row => row.id === id).freeQty || 0);
        const purchasePrice = parseFloat(updatedRows.find(row => row.id === id).purchasePrice || 0);
        const calculatedAmount = (qty - freeQty) * purchasePrice;
        updatedRows.find(row => row.id === id).amount = calculatedAmount.toFixed(2);
        setRows(updatedRows);
    }
    if (name === 'productId' || name === 'productName') {
        const productDetails = await fetchProductDetails(value);
        if (productDetails) {
            const { productId, productName, batchNo, qty, purchasePrice, sellingPrice, freeQty, expDate, comment, amount } = productDetails;
            const updatedRows = rows.map(row => {
                if (row.id === id) {
                    return { ...row, productId, productName, batchNo, qty, purchasePrice, sellingPrice, freeQty, expDate, comment, amount };
                }
                return row;
            });
            setRows(updatedRows);
        }
    }

    if (name === 'supplierId' || name === 'supplierName') {
        const supplierDetails = await fetchSupplierDetails(value);
        if (supplierDetails) {
            const { supplierId } = supplierDetails;
            const updatedRows = rows.map(row => {
                if (row.id === id) {
                    return { ...row, supplierId };
                }
                return row;
            });
            setRows(updatedRows);
        }
    }
};

const fetchProductDetails = async (productId) => {
    try {
        const response = await fetch('http://localhost:8080/products/${productId}');
        const data = await response.json();
        console.log("Fetched Product Details:", data);
        return data;
    } catch (error) {
        console.error('Error fetching product details:', error);
        return {};
    }
};

const fetchSupplierDetails = async (supplierId) => {
    try {
        const response = await fetch('http://localhost:8080/suppliers/${supplierId}');
        const data = await response.json();
        console.log("Fetched Supplier Details:", data);
        return data;
    } catch (error) {
        console.error('Error fetching supplier details:', error);
        return {};
    }
};



const navigate = useNavigate();
const handleButtonClick = () => {
    navigate('/good-receive');
};

return (
    <>
        <div className="top-nav-blue-text">
            <div className="new-grn-top-link">
                <Link to="/good-receive">
                    <IoChevronBackCircleOutline style={{ fontSize: "22px", color: "#0377A8" }} />
                </Link>
                <h4>Good Receive Note - New</h4>
            </div>
        </div>
        <Layout>
            <div className="addNewGRN-bodycontainer">
                <div className="new-grn-filter-container">
                    <div className="branchField">
                    <InputLabel htmlFor="branchName" color="#0377A8">Branch ID / Name</InputLabel>
                                <SearchBar
                                    fetchSuggestions={fetchSuggestionsBranches}
                                    onSelect={handleBranchSelect}
                                />
                    </div>
                    <div className="InvoiceNoField">
                        <InputLabel htmlFor="invoiceNo" color="#0377A8">Invoice No</InputLabel>
                        <InputField type="text" id="invoiceNo" name="invoiceNo" editable={true} value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)} width="250px" />
                    </div>
                    <div className="supplierField">
                        <InputLabel htmlFor="supplierId" color="#0377A8">Supplier ID / Name</InputLabel>
                        <SearchBar fetchSuggestions={fetchSuggestionsSuppliers} onSelect={handleSupplierSelect} />
                    </div>
                </div>
                <div className="GRN-content-middle">
                    <table className="grn-container-table">
                        <thead>
                            <tr>
                                <th>Product ID / Name</th>
                                <th>Batch No</th>
                                <th>Qty</th>
                                <th>Purchase Price</th>
                                <th>Selling Price</th>
                                <th>Free Qty</th>
                                <th>Exp Date</th>
                                <th>Amount</th>
                                <th>Comment</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map(row => (
                                <tr key={row.id}>
                                    <td><SearchBar fetchSuggestions={fetchSuggestionsProducts} onSelect={(productId, productName) => handleProductSelect(row.id, 'productId', productName)} /></td>
                                    <td><InputField type="text" id="batchNo" name="batchNo" editable={true} value={row.batchNo} onChange={(e) => handleInputChange(row.id, 'batchNo', e.target.value)} width="100%" /></td>
                                    <td><InputField type="text" id="qty" name="qty" editable={true} value={row.qty} onChange={(e) => handleInputChange(row.id, 'qty', e.target.value)} width="100%" /></td>
                                    <td><InputField type="text" id="purchasePrice" name="purchasePrice" editable={true} value={row.purchasePrice} onChange={(e) => handleInputChange(row.id, 'purchasePrice', e.target.value)} width="100%" /></td>
                                    <td><InputField type="text" id="sellingPrice" name="sellingPrice" editable={true} value={row.sellingPrice} onChange={(e) => handleInputChange(row.id, 'sellingPrice', e.target.value)} width="100%" /></td>
                                    <td><InputField type="text" id="freeQty" name="freeQty" editable={true} value={row.freeQty} onChange={(e) => handleInputChange(row.id, 'freeQty', e.target.value)} width="100%" /></td>
                                    <td><InputField type="text" id="expDate" name="expDate" editable={true} value={row.expDate} onChange={(e) => handleInputChange(row.id, 'expDate', e.target.value)} width="100%" /></td>
                                    <td><InputField type="text" id="amount" name="amount" editable={true} value={row.amount} width="100%" /></td>
                                    <td><InputField type="text" id="comment" name="comment" editable={true} value={row.comment} onChange={(e) => handleInputChange(row.id, 'comment', e.target.value)} width="100%" /></td>
                                    <td style={{ paddingRight: '12px', cursor: 'pointer' }}><FiPlus onClick={handleAddRow} style={{ cursor: 'pointer' }} /></td>
                                    <td><AiOutlineDelete onClick={() => handleDeleteRow(row.id)} style={{ cursor: 'pointer' }} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="Grn-BtnSection">
                    <Buttons type="button" id="save-btn" style={{ backgroundColor: "#23A3DA", color: "white" }} onClick={handleSave}> Save </Buttons>
                    <Buttons type="button" id="close-btn" style={{ backgroundColor: "white", color: "black" }} onClick={handleButtonClick}> Close </Buttons>
                    <p className='tot-amount-txt'>Total Amount:  </p>
                </div>
            </div>
        </Layout>
    </>
);
};

export default AddNewGRN;
