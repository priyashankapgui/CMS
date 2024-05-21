import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from "../../../Layout/Layout";
import "./CheckPrice.css";
import InputLabel from "../../../Components/Label/InputLabel";
import Buttons from '../../../Components/Buttons/SquareButtons/Buttons';
import TableWithPagi from '../../../Components/Tables/TableWithPagi';
import SearchBar from "../../../Components/SearchBar/SearchBar";
import { Icon } from "@iconify/react";

export const CheckPrice = () => {

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

    const fetchSuggestionsProducts = async (searchTerm) => {
        try {
            const response = await axios.get(`http://localhost:8080/products?query=${encodeURIComponent(searchTerm)}`);
            return response.data.map(item => ({
                id: item.productId,
                name: `${item.productId} ${item.productName}`
            }));
        } catch (error) {
            console.error('Error fetching product suggestions:', error);
            return [];
        }
    };

    const [branch, setBranch] = useState(null);
    const [product, setProduct] = useState(null);
    const [batchDetails, setBatchDetails] = useState([]);

    const handleBranchSelect = (selectedBranch) => {
        setBranch(selectedBranch);
    };

    const handleProductSelect = (selectedProduct) => {
        setProduct(selectedProduct);
    };

    const handleSearch = async () => {
        if (!branch || !product) {
            console.error('Please select both branch and product');
            return;
        }

        try {
            const response = await axios.get(`http://localhost:8080/product-GRN`, {
                params: {
                    branchName: branch.name.split(' ').slice(1).join(' '), // Send only branch name
                    productName: product.name.split(' ').slice(1).join(' '), // Send only product name
                }
            });
            setBatchDetails(response.data);
        } catch (error) {
            console.error('Error fetching batch details:', error);
        }
    };

    const handleClear = () => {
        setBranch(null);
        setProduct(null);
        setBatchDetails([]);
    };
    
    return (
        <>
            <div className="top-nav-blue-text">
                <h4>Check Price</h4>
            </div>
            <Layout>
            <div className="check-price-bodycontainer">
                    <div className="check-price-filter-container">
                        <h3 className="check-price-title">Check Price</h3>
                        <div className="check-price-content-top">
                            <div className="branchField">
                                <InputLabel htmlFor="branchName" color="#0377A8">Branch ID / Name</InputLabel>
                                <SearchBar
                                    fetchSuggestions={fetchSuggestionsBranches}
                                    onSelect={handleBranchSelect}
                                />
                            </div>
                            <div className="productField">
                                <InputLabel htmlFor="productName" color="#0377A8">Product ID / Name</InputLabel>
                                <SearchBar
                                    fetchSuggestions={fetchSuggestionsProducts}
                                    onSelect={handleProductSelect}
                                />
                            </div>
                        </div>
                        <div className="s-BtnSection">
                            <Buttons type="button" id="search-btn" style={{ backgroundColor: "#23A3DA", color: "white" }} onClick={handleSearch}>Search</Buttons>
                            <Buttons type="button" id="clear-btn" style={{ backgroundColor: "white", color: "#EB1313" }} onClick={handleClear}>Clear</Buttons>
                        </div>
                    </div>
                    <div className="content-middle">
                        <TableWithPagi
                            columns={['Branch Name', 'Batch No', 'Exp Date', 'Available Qty', 'Selling Price']}
                            rows={batchDetails.map(detail => ({
                                'Branch Name': detail.branchName,
                                'Batch No': detail.batchNo,
                                'Exp Date': detail.expDate,
                                'Available Qty': detail.availableQty,
                                'Selling Price': detail.sellingPrice,
                            }))}
                        />
                    </div>
                </div>
            </Layout>
        </>
    );
}; 

export default CheckPrice;