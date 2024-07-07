import React, { useState, useEffect, useRef } from 'react';
import './AddNewGRN.css';
import Layout from "../../../Layout/Layout";
import Buttons from '../../../Components/Buttons/SquareButtons/Buttons';
import InputLabel from "../../../Components/Label/InputLabel";
import InputField from "../../../Components/InputField/InputField";
import SearchBar from '../../../Components/SearchBar/SearchBar';
import DatePicker from '../../../Components/DatePicker/DatePicker';
import CustomAlert from '../../../Components/Alerts/CustomAlert/CustomAlert';
import BranchDropdown from '../../../Components/InputDropdown/BranchDropdown';
import { Link, useNavigate } from 'react-router-dom';
import { IoChevronBackCircleOutline } from "react-icons/io5";
import { FiPlus } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { getBranchOptions } from '../../../Api/BranchMgmt/BranchAPI';
import { getSuppliers } from '../../../Api/Inventory/Supplier/SupplierAPI';
import { getProducts } from '../../../Api/Inventory/Product/ProductAPI';
import { getSupplierById } from '../../../Api/Inventory/Supplier/SupplierAPI';
import { createGRN } from '../../../Api/Inventory/GoodReceive/GoodReceiveAPI';

export function AddNewGRN() {

    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState('');
    const [productsData, setProductsData] = useState([]);
    const [invoiceNo, setInvoiceNo] = useState('');
    const [supplierId, setSupplierId] = useState('');
    const [selectedSupplier, setSelectedSupplier] = useState('');
    const [branchName, setBranchName] = useState('');
    const [grnDate, setGrnDate] = useState(new Date());
    const [rows, setRows] = useState([{ id: 1, productId: '', batchNo: '', totalQty: '', purchasePrice: '', sellingPrice: '', freeQty: '', expDate: '', comment: '', amount: '' }]);
    const [alert, setAlert] = useState({ show: false, severity: '', title: '', message: '' });
    const navigate = useNavigate();
    const branchDropdownRef = useRef(null);

    const initialRowData = {
        id: 1,
        productId: '',
        batchNo: '',
        totalQty: '',
        purchasePrice: '',
        sellingPrice: '',
        freeQty: '',
        expDate: '',
        comment: '',
        amount: ''
    };

    useEffect(() => {
        fetchBranches();
    }, []);

    const fetchBranches = async () => {
        try {
            const response = await getBranchOptions();
            setBranches(response.data);
        } catch (error) {
            console.error('Error fetching branches:', error);
        }
    };

    const handleDropdownChange = (value) => {
        setSelectedBranch(value);
    };

    const fetchSupplierIdByName = async () => {
        try {
            const response = await getSupplierById(supplierId);
            const data = await response.json();
            if (data.length > 0) {
                setSupplierId(data[0].id);
            }
        } catch (error) {
            console.error('Error fetching Supplier ID:', error);
        }
    };

    const handleDateChange = (date) => {
        setGrnDate(date);
    };
    

    const handleSave = async (e) => {
        e.preventDefault();

        if (!supplierId) {
            await fetchSupplierIdByName();
        }

        const grnData = {
            invoiceNo,
            branchName: selectedBranch,
            supplierId: selectedSupplier.split(' ')[0], // Only send supplierId
            products: rows.map(row => ({
                productId: row.productId.split(' ')[0],
                batchNo: row.batchNo,
                totalQty: row.totalQty,
                purchasePrice: row.purchasePrice,
                sellingPrice: row.sellingPrice,
                freeQty: row.freeQty,
                expDate: row.expDate,
                comment: row.comment,
                amount: row.amount,
            }))
        };

        try {
            await createGRN(grnData);
            setAlert({
                show: true,
                severity: 'success',
                title: 'Success',
                message: 'GRN saved successfully!'
            });
            setInvoiceNo('');
            setSupplierId('');
            setSelectedSupplier('');
            setBranchName('');
            branchDropdownRef.current.reset();
            setRows([{ id: 1, productId: '', batchNo: '', totalQty: '', purchasePrice: '', sellingPrice: '', freeQty: '', expDate: '', comment: '', amount: '' }]);
        } catch (error) {
            console.error('Error:', error.response);
            setAlert({
                show: true,
                severity: 'error',
                title: 'Error',
                message: 'Failed to save GRN.'
            });
        }
    };

    const handleAddRow = () => {
        if (rows[rows.length - 1].productId.trim() === '') {
            setAlert({
                show: true,
                severity: 'warning',
                title: 'Please add a Product ID',
                message: 'You cannot go forward'
            });
        } else {
            const newRow = { id: rows.length + 1, productId: '', batchNo: '', totalQty: '', purchasePrice: '', sellingPrice: '', freeQty: '', expDate: '', comment: '', amount: '' };
            setRows([...rows, newRow]);
        }
    };

    const handleDeleteRow = (id) => {
        if (id === 1) {
            setRows(rows.map(row => (row.id === 1 ? initialRowData : row)));
        } else {
            setRows(rows.filter(row => row.id !== id));
        }
    };

    const fetchSuppliersSuggestions = async (query) => {
        try {
            const response = await getSuppliers();
            if (response.data && response.data) {
                return response.data.map(supplier => ({
                    id: supplier.supplierId,
                    displayText: `${supplier.supplierId} ${supplier.supplierName}`
                }));
            }
            return [];
        } catch (error) {
            console.error('Error fetching supplier suggestions:', error);
            return [];
        }
    };

    const handleInputChange = (id, name, value) => {
        const updatedRows = rows.map(row => {
            if (row.id === id) {
                row[name] = value;
                if (name === 'totalQty' || name === 'freeQty' || name === 'purchasePrice') {
                    const totalQty = parseFloat(row.totalQty || 0);
                    const freeQty = parseFloat(row.freeQty || 0);
                    const purchasePrice = parseFloat(row.purchasePrice || 0);
                    row.amount = ((totalQty - freeQty) * purchasePrice).toFixed(2);
                }
            }
            return row;
        });
        setRows(updatedRows);
    };

    useEffect(() => {
        const fetchProductsData = async () => {
            try {
                const response = await getProducts();
                setProductsData(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProductsData();
    }, []);

    const fetchProductsSuggestions = async (query) => {
        try {
            const response = await getProducts();
            if (response.data && response.data) {
                return response.data.map(product => ({
                    id: product.productId,
                    displayText: `${product.productId} ${product.productName}`
                }));
            }
            return [];
        } catch (error) {
            console.error('Error fetching product:', error);
            return [];
        }
    };

    const handleButtonClick = () => {
        navigate('/good-receive');
    };

    const handleCloseAlert = () => {
        setAlert({ show: false, severity: '', title: '', message: '' });
    };

    const calculateTotalAmount = () => {
        return rows.reduce((total, row) => total + parseFloat(row.amount || 0), 0).toFixed(2);
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
                <div className="new-grn-top-link">
                    <Link to="/good-receive">
                        <IoChevronBackCircleOutline style={{ fontSize: "22px", color: "#0377A8" }} />
                    </Link>
                    <h4>Good Receive Note - New</h4>
                </div>
            </div>
            <Layout>
                <div className="AddNewGRN-bodycontainer">
                    <div className="new-grn-filter-container">
                        <div className="branchField">
                            <InputLabel htmlFor="branchName" color="#0377A8">Branch ID / Name<span style={{ color: 'red' }}>*</span></InputLabel>
                            <BranchDropdown
                                    id="branchName"
                                    name="branchName"
                                    editable={true}
                                    onChange={(e) => handleDropdownChange(e)}
                                    addOptions={["All"]}
                                    value={selectedBranch}
                                    ref={branchDropdownRef}
                                    />
                        </div>
                        <div className="InvoiceNoField">
                            <InputLabel htmlFor="invoiceNo" color="#0377A8">Invoice No<span style={{ color: 'red' }}>*</span></InputLabel>
                            <InputField type="text" id="invoiceNo" name="invoiceNo" editable={true} value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)} width="250px" required />
                        </div>
                        <div className="SupplierField">
                            <InputLabel htmlFor="supplierName" color="#0377A8">Supplier ID / Name<span style={{ color: 'red' }}>*</span></InputLabel>
                            <SearchBar
                                searchTerm={selectedSupplier}
                                setSearchTerm={setSelectedSupplier}
                                onSelectSuggestion={(suggestion) => setSelectedSupplier(`${suggestion.displayText}`)} // Only set supplier ID
                                fetchSuggestions={fetchSuppliersSuggestions}
                            />
                        </div>
                    </div>
                    <div className="grn-content-middle">
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
                                {rows.map((row, index) => (
                                    <tr key={index}>
                                        <td>
                                            <SearchBar
                                                searchTerm={row.productId}
                                                setSearchTerm={(value) => handleInputChange(row.id, 'productId', value)}
                                                onSelectSuggestion={(suggestion) => handleInputChange(row.id, 'productId', `${suggestion.displayText}`)}
                                                fetchSuggestions={fetchProductsSuggestions}
                                            />
                                        </td>
                                        <td><InputField type="text" id="batchNo" name="batchNo" editable={true} value={row.batchNo} onChange={(e) => handleInputChange(row.id, 'batchNo', e.target.value)} width="100%" /></td>
                                        <td><InputField type="number" id="totalQty" name="totalQty" textAlign="center" editable={true} value={row.totalQty} onChange={(e) => handleInputChange(row.id, 'totalQty', e.target.value)} width="100%" /></td>
                                        <td><InputField type="text" id="purchasePrice" name="purchasePrice" textAlign="right" editable={true} value={row.purchasePrice} onChange={(e) => handleInputChange(row.id, 'purchasePrice', e.target.value)} width="100%" /></td>
                                        <td><InputField type="text" id="sellingPrice" name="sellingPrice" textAlign="right" editable={true} value={row.sellingPrice} onChange={(e) => handleInputChange(row.id, 'sellingPrice', e.target.value)} width="100%" /></td>
                                        <td><InputField type="number" id="freeQty" name="freeQty" textAlign="center" editable={true} value={row.freeQty} onChange={(e) => handleInputChange(row.id, 'freeQty', e.target.value)} width="100%" /></td>
                                        <td> <DatePicker
                                                selectedDate={row.expDate}
                                                onDateChange={(date) => handleInputChange(row.id, 'expDate', date)}
                                            /></td>
                                        <td><InputField type="text" id="amount" name="amount" textAlign="right" editable={false} value={row.amount} width="100%" /></td>
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
                        <p className='tot-amount-txt'>Total Amount: <span className="totalAmountValue">Rs: {calculateTotalAmount()}</span> </p>
                    </div>
                </div>
            </Layout>
        </>
    );
};

export default AddNewGRN;
