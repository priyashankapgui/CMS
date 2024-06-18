import React, { useState, useEffect } from 'react';
import AdjustPopup from '../../../Components/PopupsWindows/AdjustPopup';
import axios from 'axios';
import "./AdjustStock.css";
import secureLocalStorage from 'react-secure-storage';

function AdjustStock({ productId, productName, branchName }) {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStockQuantity = async () => {
            try {
                const response = await axios.get('/adjust-stock', {
                    params: {
                        branchName: branchName,
                        productId: productId
                    }
                });
                setRows(response.data.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching stock quantity:", error);
                setLoading(false);
            }
        };

        fetchStockQuantity();
    }, [productId, branchName]);

    const handleAdjustStock = async () => {
        const user = JSON.parse(secureLocalStorage.getItem("user"));
        console.log("name",user);
        const updates = rows.map(row => ({
            productId: productId,
            batchNo: row.batchNo,
            branchName: branchName,
            newQty: row.totalAvailableQty,
            newSellingPrice: row.sellingPrice,
            reason: row.reason || "Updated via frontend",
            updatedBy: user.userName
        }));

        try {
            const response = await axios.put('http://localhost:8080/adjust-stock-quantity', { updates });
            console.log("Adjust stock response:", response.data);
            // Optionally, handle success message or update UI
        } catch (error) {
            console.error("Error adjusting stock:", error);
            // Optionally, handle error message or update UI
        }
    };

    const handleQtyChange = (index, newQty) => {
        const updatedRows = [...rows];
        updatedRows[index].totalAvailableQty = newQty;
        setRows(updatedRows);
    };

    const handleSellingPriceChange = (index, newSellingPrice) => {
        const updatedRows = [...rows];
        updatedRows[index].sellingPrice = newSellingPrice;
        setRows(updatedRows);
    };

    const handleReasonChange = (index, newReason) => {
        const updatedRows = [...rows];
        updatedRows[index].reason = newReason;
        setRows(updatedRows);
    };

    return (
        <>
            <AdjustPopup
                topTitle="Adjust Stock"
                buttonId="save-btn"
                buttonText="Save"
                onClick={handleAdjustStock}  // Correctly pass handleAdjustStock to onSave prop
            >
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div className="adjust-stock-container">
                        <div className="product-info">
                            <div className="field">
                                <span className="label">Product ID:</span>
                                <span className="value">{productId}</span>
                            </div>
                            <div className="field">
                                <span className="label">Product Name:</span>
                                <span className="value">{productName}</span>
                            </div>
                            <div className="field">
                                <span className="label">Branch:</span>
                                <span className="value">{branchName}</span>
                            </div>
                        </div>

                        <table className="adjust-stock-table">
                            <thead>
                                <tr>
                                    <th>Batch No</th>
                                    <th>Exp Date</th>
                                    <th>Selling Price(Rs)</th>
                                    <th>Qty</th>
                                    <th>Reason</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row, index) => (
                                    <tr key={index}>
                                        <td>{row.batchNo}</td>
                                        <td>{new Date(row.expDate).toLocaleDateString()}</td>
                                        <td>
                                            <input
                                                type="number"
                                                value={row.sellingPrice}
                                                onChange={(e) => handleSellingPriceChange(index, parseFloat(e.target.value))}
                                                step="0.01"  // Adjust as needed
                                                min="0"  // Adjust as needed
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                value={row.totalAvailableQty}
                                                onChange={(e) => handleQtyChange(index, parseInt(e.target.value))}
                                                min="0"  // Adjust as needed
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                value={row.reason || ""}
                                                onChange={(e) => handleReasonChange(index, e.target.value)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </AdjustPopup>
        </>
    );
}

export default AdjustStock;
