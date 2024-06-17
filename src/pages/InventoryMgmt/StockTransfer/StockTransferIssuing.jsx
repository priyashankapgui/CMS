import Layout from "../../../Layout/Layout";
import React, { useState, useEffect } from 'react';
import './StockTransferIssuing.css';
import Buttons from '../../../Components/Buttons/SquareButtons/Buttons';
import { Link , useNavigate, useParams } from 'react-router-dom';
import { IoChevronBackCircleOutline } from "react-icons/io5";
import axios from 'axios';
import InputLabel from "../../../Components/Label/InputLabel";
import TableWithPagi from '../../../Components/Tables/TableWithPagi';
import SearchBar from '../../../Components/SearchBar/SearchBar';
import { FiPlus } from "react-icons/fi"; // Import all icons
import { AiOutlineDelete } from "react-icons/ai";
import ConfirmationPopup from "../../../Components/PopupsWindows/ConfirmationPopup";

export const StockTransferIssuing = () => {
    const { STN_NO } = useParams();
    const navigate = useNavigate();

    const [stockTransferDetails, setStockTransferDetails] = useState(null);
    const [rows, setRows] = useState([]);
    const [submittedBy, setSubmittedBy] = useState(""); // Assuming you have a way to get the currently logged in user

    useEffect(() => {
        const fetchStockTransferDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/stock-transferDetails/${STN_NO}`);
                setStockTransferDetails(response.data.data);
                const products = response.data.data.products.map((product, index) => ({
                    id: index + 1,
                    productId: `${product.productId} / ${product.productName}`,
                    reqQty: product.requestedQty,
                    batchNo: '', // Initialize batchNo as empty
                    transferQty: '',
                    unitPrice: 0,
                    amount: 0,
                }));
                setRows(products);
            } catch (error) {
                console.error("Error fetching stock transfer details:", error);
            }
        };

        fetchStockTransferDetails();
    }, [STN_NO]);

    const fetchBatchSuggestions = async (productId, branchName, searchTerm) => {
        try {
            const response = await axios.get(`http://localhost:8080/batchNumbers`, {
                params: { productId, branchName, searchTerm }
            });
            console.log("Batch suggestions response:", response.data.data);
            return response.data.data.map(batch => ({
                value: batch.batchNo,
                displayText: `${batch.batchNo} (Available: ${batch.totalAvailableQty})`,
                unitPrice: batch.sellingPrice // Include unitPrice in the suggestions
            }));
        } catch (error) {
            console.error("Error fetching batch suggestions:", error);
            return [];
        }
    };

    const handleBatchSelect = (id, selectedBatch) => {
        const updatedRows = rows.map(row => {
            if (row.id === id) {
                return { ...row, batchNo: selectedBatch.value, unitPrice: selectedBatch.unitPrice, amount: (row.transferQty * selectedBatch.unitPrice).toFixed(2) };
            }
            return row;
        });
        setRows(updatedRows);
    };

    const handleSave = async () => {
        try {
            const user = JSON.parse(sessionStorage.getItem("user"));

            const data = {
                STN_NO: stockTransferDetails?.STN_NO,
                submittedBy: user.userName,
                supplyingBranch: stockTransferDetails?.supplyingBranch,
                products: rows.map(row => ({
                    productId: row.productId.split(' / ')[0], // Assuming productId is split by ' / ' and first part is the ID
                    batchNo: row.batchNo,
                    transferQty: row.transferQty,
                    unitPrice: row.unitPrice,
                    amount: row.amount
                }))
            };

            console.log("Data to be sent:", data);

            const response = await axios.post(`http://localhost:8080/stockTransferIN`, data);
            console.log("Save response:", response.data);

            // Navigate to the desired page after successful save
            navigate('/stock-transfer');
        } catch (error) {
            console.error("Error saving stock transfer:", error);
        }
    };

    const calculateTotalAmount = () => {
        return rows.reduce((total, row) => total + (row.transferQty * row.unitPrice || 0), 0).toFixed(2);
    };

    const handleInputChange = (id, field, value) => {
        const updatedRows = rows.map(row => {
            if (row.id === id) {
                const updatedRow = { ...row, [field]: value };
                if (field === 'transferQty' || field === 'unitPrice') {
                    updatedRow.amount = (updatedRow.transferQty * updatedRow.unitPrice).toFixed(2);
                }
                return updatedRow;
            }
            return row;
        });
        setRows(updatedRows);
    };

    const handleAddRow = (selectedRow) => {
        const newRow = {
            id: rows.length + 1,
            productId: selectedRow.productId,
            reqQty: selectedRow.reqQty,
            batchNo: '', // Initialize batchNo as empty
            transferQty: '',
            unitPrice: 0,
            amount: 0,
        };
        setRows([...rows, newRow]);
    };

    const handleDeleteRow = (id) => {
        if (id === 1 && rows.length === 1) {
            // Clear data for the first row
            setRows([{ id: 1, productId: '', reqQty: '', batchNo: '', transferQty: '', unitPrice: 0, amount: 0 }]);
        } else {
            // Delete other rows
            setRows(rows.filter(row => row.id !== id));
        }
    };


    const columns = [
        "Product ID / Name",
        "Req. Qty",
        "Batch No",
        "Transfer Qty",
        "Unit Price",
        "Amount",
        "Actions"
    ];

    const tableRows = rows.map(row => ({
        productId: row.productId,
        reqQty: row.reqQty,
        batchNo: (
            <SearchBar
                searchTerm={row.batchNo}
                setSearchTerm={(term) => handleInputChange(row.id, 'batchNo', term)}
                fetchSuggestions={(term) => fetchBatchSuggestions(row.productId.split(' / ')[0], stockTransferDetails?.supplyingBranch, term)}
                onSelectSuggestion={(suggestion) => handleBatchSelect(row.id, suggestion)}
            />
        ),
        transferQty: (
            <input className="data-box-table"
                type="number"
                value={row.transferQty}
                onChange={(e) => handleInputChange(row.id, 'transferQty', parseFloat(e.target.value) || 0)}
            />
        ),
        unitPrice: (
            <input className="data-box-table"
                type="number"
                value={row.unitPrice}
                onChange={(e) => handleInputChange(row.id, 'unitPrice', parseFloat(e.target.value) || 0)}
            />
        ),
        amount: row.amount,
        actions: (
            <div>
                <FiPlus onClick={() => handleAddRow(row)} style={{ cursor: 'pointer', marginRight: '8px' }} />
                <AiOutlineDelete onClick={() => handleDeleteRow(row.id)} style={{ cursor: 'pointer' }} />
            </div>
        )
    }));

    const handleClick = async () => {

    }

    return (
        <>
            <div className="top-nav-blue-text">
            <div className="stockIssuing-link">
                    <Link to="/stock-transfer">
                        <IoChevronBackCircleOutline style={{ fontSize: "22px", color: "#0377A8" }} />
                    </Link>
                    <h4>Stock Transfer - Issuing</h4>
                </div>
               
            </div>
            <Layout>
                <div className="StockIn-bodycontainer">
                    <div className="StockIn-filter-container">
                        <div className="StockTransferField">
                            <InputLabel htmlFor="stnNo" color="#0377A8">Stock Transfer No(STN)</InputLabel>
                            <div className="data-box">
                                <span>{stockTransferDetails?.STN_NO}</span>
                            </div>
                        </div>

                        <div className="RequestedBranchField">
                            <InputLabel htmlFor="requestedBranch" color="#0377A8">Requested Branch</InputLabel>
                            <div className="data-box">
                                <span>{stockTransferDetails?.requestBranch}</span>
                            </div>
                        </div>
                        <div className="SupplyingBranchField">
                            <InputLabel htmlFor="supplyingBranch" color="#0377A8">Supplying Branch</InputLabel>
                            <div className="data-box">
                                <span>{stockTransferDetails?.supplyingBranch}</span>
                            </div>
                        </div>
                    </div>
                    <div className="StockIn-content-middle">
                        <TableWithPagi rows={tableRows} columns={columns} />
                    </div>
                    <div className="StockIn-BtnSection">
                        <Buttons type="button" id="save-btn" style={{ backgroundColor: "#23A3DA", color: "white" }} onClick={handleSave}> Issue </Buttons>
                        <Buttons type="button" id="close-btn" style={{ backgroundColor: "white", color: "black" }} onClick={() => navigate('/stock-transfer')}>Close</Buttons>
                        <Buttons type="button" id="cancel-btn" style={{ backgroundColor: "white", color: "red" }} onClick={<ConfirmationPopup/> }>Cancel</Buttons> 
                       
                        <p className='tot-amount-txt'>Total Amount: <span className="totalAmountValue">Rs: {calculateTotalAmount()}</span></p>
                    </div>
                </div>
                
            </Layout>
        </>
    );
};

export default StockTransferIssuing;
