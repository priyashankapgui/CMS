import React, { useState, useEffect } from 'react';
import './NewStockTransfer.css';
import axios from 'axios';
import Layout from "../../../Layout/Layout";
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import Buttons from '../../../Components/Buttons/SquareButtons/Buttons';
import { IoChevronBackCircleOutline } from "react-icons/io5";
import InputDropdown from '../../../Components/InputDropdown/InputDropdown';
import InputLabel from '../../../Components/Label/InputLabel';
import InputField from '../../../Components/InputField/InputField';
import BranchDropdown from '../../../Components/InputDropdown/BranchDropdown';
import SearchBar from '../../../Components/SearchBar/SearchBar';
import CustomAlert from '../../../Components/Alerts/CustomAlert/CustomAlert';

export function NewStockTransfer() {

    const [selectedBranch, setSelectedBranch] = useState('');
    const [branches, setBranches] = useState([]);
    const [requestBranch, setRequestBranch] = useState('');
    const [rows, setRows] = useState([{ id: 1, productId: '', Qty: '', comment: '' }]);
    const [alert, setAlert] = useState({ show: false, severity: '', title: '', message: '' });
    const navigate = useNavigate();

    const initialRowData = {
        id: 1,
        productId: '',
        Qty: '',
        comment: '',
    };

    useEffect(() => {
        fetchBranches();
    }, []);

    const handleButtonClick = () => {
        navigate('/stock-transfer');
    };

    const fetchProductsSuggestions = async (query) => {
        try {
            const response = await axios.get(`http://localhost:8080/products?search=${query}`);
            if (response.data && response.data.data) {
                return response.data.data.map(product => ({
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

    const fetchBranches = async () => {
        try {
            const response = await axios.get('http://localhost:8080/branchesWeb');
            setBranches(response.data);
        } catch (error) {
            console.error('Error fetching branches:', error);
        }
    };

    const handleDropdownChange = (value) => {
        setSelectedBranch(value);
    };

    const handleRequestBranchChange = (value) => {
        setRequestBranch(value);
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
            const newRow = { id: rows.length + 1, productId: '', Qty: '', comment: '' };
            setRows([...rows, newRow]);
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

    const handleCloseAlert = () => {
        setAlert({ show: false, severity: '', title: '', message: '' });
    };

    const handleSave = async (e) => {
        e.preventDefault();

        // Get the currently logged-in user's username from session storage
        const user = JSON.parse(sessionStorage.getItem("user"));
        console.log("name", user);

        // Prepare data to be sent to the backend
        const stockTransferData = {
            requestedBy: user.userName,
            requestBranch,
            supplyingBranch: selectedBranch,
            products: rows.map(row => ({
                productId: row.productId.split(' ')[0],
                requestedQty: row.Qty,
                comment: row.comment
            }))
        };

        try {
            await axios.post('http://localhost:8080/stockTransferOUT', stockTransferData);
            setAlert({
                show: true,
                severity: 'success',
                title: 'Success',
                message: 'Stock Transfer saved successfully!'
            });
            // Reset form fields
            setRequestBranch('');
            setSelectedBranch('');
            setRows([{ id: 1, productId: '', Qty: '', comment: '' }]);
        } catch (error) {
            console.error('Error:', error.response);
            setAlert({
                show: true,
                severity: 'error',
                title: 'Error',
                message: 'Failed to save Stock Transfer.'
            });
        }
    };

    const handleInputChange = (id, name, value) => {
        const updatedRows = rows.map(row => {
            if (row.id === id) {
                row[name] = value;
            }
            return row;
        });
        setRows(updatedRows);
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
                <div className="new-st-top-link">
                    <Link to="/stock-transfer">
                        <IoChevronBackCircleOutline style={{ fontSize: "22px", color: "#0377A8" }} />
                    </Link>
                    <h4>Stock Transfer - New</h4>
                </div>
            </div>
            <Layout>
            <div className="addNewStock-bodycontainer">
                    <div className="new-stock-filter-container">
                            <div className="SupplyingbranchField">
                                <InputLabel htmlFor="requestBranch" color="#0377A8">Request Branch</InputLabel>
                                <BranchDropdown
                                    id="requestBranch"
                                    name="requestBranch"
                                    editable={true}
                                    onChange={(e) => handleRequestBranchChange(e)}
                                    addOptions={["All"]}
                                />
                            </div>
                        <div className="branchField">
                            <InputLabel htmlFor="branchName" color="#0377A8">Supplying Branch</InputLabel>
                            <InputDropdown
                                id="branchName"
                                name="branchName"
                                editable={true}
                                options={branches.map(branch => branch.branchName)}
                                onChange={handleDropdownChange}
                            />
                        </div>

                    </div>
                    <div className="Stock-content-middle">
                        <table className="Stock-container-table">
                            <thead>
                                <tr>
                                    <th>Product ID / Name</th>
                                    <th>Qty</th>
                                    <th>Comment</th>
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
                                        <td><InputField type="number" id="Qty" name="Qty" textAlign="center" editable={true} value={row.Qty} onChange={(e) => handleInputChange(row.id, 'Qty', e.target.value)} width="100%" /></td>
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
                    </div>
                </div>
            </Layout>
        </>
    );
}
export default NewStockTransfer;
