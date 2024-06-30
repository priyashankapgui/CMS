import React, { useState, useEffect } from 'react';
import SummaryPopup from '../../../Components/PopupsWindows/SummaryPopup';
import TableWithPagi from '../../../Components/Tables/TableWithPagi';
import "./StockSummary.css";
import { getAdjustStockDetails } from '../../../Api/Inventory/StockBalance/StockBalanceAPI';

function StockSummary({ productId, productName, branchName, qty }) {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStockDetails = async () => {
            try {
                const response = await getAdjustStockDetails(branchName, productId);
                setRows(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching stock details:", error);
                setLoading(false);
            }
        };

        fetchStockDetails();
    }, [productId, branchName]);

    

    const columns = ["Batch No", "Exp Date", "Selling Price(Rs)", "Qty", "Reason", "Updated By", "Updated At"];

    return (
        <SummaryPopup topTitle="Stock Summary">
            
                <div className="stock-summary-container">
                    <div className="product-info">
                        <div className="field">
                            <span className="productid">Product ID : </span>
                            <span className="value1">{productId}</span>
                        </div>
                        <div className="field">
                            <span className="productname">Product Name : </span> 
                            <span className="value2">{productName}</span>
                        </div>
                        <div className="field">
                            <span className="branchname">Branch : </span>
                            <span className="value3">{branchName}</span>
                        </div>
                    </div>

                    <TableWithPagi rows={rows} columns={columns} itemsPerPage={5} />

                    <div className="field">
                        <span className="totalqty">Total Qty : </span>
                        <span className="value">{qty}</span>
                    </div>
                </div>
            
        </SummaryPopup>
    );
}

export default StockSummary;
