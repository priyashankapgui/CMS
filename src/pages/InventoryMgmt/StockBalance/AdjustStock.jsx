import React, { useState, useEffect } from 'react';
import AdjustPopup from '../../../Components/PopupsWindows/AdjustPopup';
import "./AdjustStock.css";
import { useNavigate } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage';
import CustomAlert from '../../../Components/Alerts/CustomAlert/CustomAlert';
import { getAdjustStockDetails, updateAdjustStock } from '../../../Api/Inventory/StockBalance/StockBalanceAPI';

function AdjustStock({ productId, productName, branchName }) {
    const navigate = useNavigate();
    const [rows, setRows] = useState([]);
    const [initialRows, setInitialRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertConfig, setAlertConfig] = useState({});

    useEffect(() => {
        const fetchStockQuantity = async () => {
            try {
                const response = await getAdjustStockDetails(branchName, productId);

                const fetchedData = response.data;
                setRows(fetchedData);
                setInitialRows(JSON.parse(JSON.stringify(fetchedData)));
                setLoading(false);
            } catch (error) {
                console.error("Error fetching stock quantity:", error);
                setLoading(false);
            }
        };

        fetchStockQuantity();
    }, [productId, branchName]);

    useEffect(() => {
        console.log("Rows updated:", rows);
    }, [rows]);

    const handleAdjustStock = async () => {
        const user = JSON.parse(secureLocalStorage.getItem("user"));
       

        const updates = rows
            .filter((row, index) => {
                const initialRow = initialRows[index];
                return row.totalAvailableQty !== initialRow.totalAvailableQty ||
                    row.sellingPrice !== initialRow.sellingPrice ||
                    row.reason !== initialRow.reason;
            })
            .map(row => {
                const initialRow = initialRows.find(initRow => initRow.batchNo === row.batchNo);
                const updatePayload = {
                    productId: productId,
                    batchNo: row.batchNo,
                    branchName: branchName,
                    reason: row.reason || "Updated via frontend",
                    updatedBy: user.userName
                };

                if (row.totalAvailableQty !== initialRow.totalAvailableQty) {
                    updatePayload.newQty = row.totalAvailableQty;
                }

                if (row.sellingPrice !== initialRow.sellingPrice) {
                    updatePayload.newSellingPrice = row.sellingPrice;
                }

                return updatePayload;
            });

        console.log("Updates:", updates);

        if (updates.length === 0) {
            console.log("No changes to save.");
            return;
        }

        try {
            const response = await updateAdjustStock(updates);
            console.log("Adjust stock response:", response.data);
            const alertData = {
                severity: 'success',
                title: 'Successfully Updated!',
                message: 'Stock adjusted successfully!',
                duration: 3000
            };
            localStorage.setItem('alertConfig', JSON.stringify(alertData));
            navigate('/stock-balance');
            window.location.reload();
            
        } catch (error) {
            console.error("Error adjusting stock:", error);
            const alertData = {
                severity: 'error',
                title: 'Error',
                message: 'Failed to adjust stock.',
                duration: 3000
            };
            localStorage.setItem('alertConfig', JSON.stringify(alertData));
            navigate('/stock-balance');
            window.location.reload();
           
        }
    };

    const handleQtyChange = (index, newQty) => {
        const updatedRows = [...rows];
        updatedRows[index] = { ...updatedRows[index], totalAvailableQty: newQty };
        console.log("Updated Rows (Qty Change):", updatedRows);
        setRows(updatedRows);
    };

    const handleSellingPriceChange = (index, newSellingPrice) => {
        const updatedRows = [...rows];
        updatedRows[index] = { ...updatedRows[index], sellingPrice: newSellingPrice };
        console.log("Updated Rows (Price Change):", updatedRows);
        setRows(updatedRows);
    };

    const handleReasonChange = (index, newReason) => {
        const updatedRows = [...rows];
        updatedRows[index] = { ...updatedRows[index], reason: newReason };
        console.log("Updated Rows (Reason Change):", updatedRows);
        setRows(updatedRows);
    };

    console.log("Rendering AdjustStock Component");

    return (
        <>
        {alertVisible && (
                <CustomAlert
                    severity={alertConfig.severity}
                    title={alertConfig.title}
                    message={alertConfig.message}
                    duration={alertConfig.duration}
                    onClose={() => setAlertVisible(false)}
                />
            )}
            <AdjustPopup
                topTitle="Adjust Stock"
                buttonId="save-btn"
                buttonText="Save"
                onClick={handleAdjustStock}
            >
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
                                            step="0.01"  
                                            min="0"  
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            value={row.totalAvailableQty}
                                            onChange={(e) => handleQtyChange(index, parseInt(e.target.value))}
                                            min="0"  
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
            </AdjustPopup>
        </>
    );
}

export default AdjustStock;
