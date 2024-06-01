import React, { useState } from 'react';
import axios from 'axios';
import Layout from "../../../Layout/Layout";
import "./StockBalance.css";
import InputLabel from "../../../Components/Label/InputLabel";
import Buttons from '../../../Components/Buttons/SquareButtons/Buttons';
import TableWithPagi from '../../../Components/Tables/TableWithPagi';
import SearchBar from "../../../Components/SearchBar/SearchBar";


export const StockBalance = () => {

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
    const [stockDetails, setStockDetails] = useState([]);

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

        // Log branch and product to verify values before sending the request
        console.log('Branch:', branch);
        console.log('Product:', product);

        try {
            const response = await axios.get('http://localhost:8080/active-stock', {
                params: {
                    branchName: branch.name.split(' ').slice(1).join(' '), // Send only branch name
                    productName: product.name.split(' ').slice(1).join(' '), // Send only product name
                }
            });

            setStockDetails([{ ...response.data }]); // Update stock details with response data
        } catch (error) {
            console.error('Error fetching stock details:', error);
        }
    };

    const handleClear = () => {
        setBranch(null);
        setProduct(null);
        setStockDetails([]);
    };

    return ( 
        <>
            <div className="top-nav-blue-text">
                <h4>Stock Balance</h4>
            </div>
            <Layout>
                <div className="stock-balance-bodycontainer">
                    <div className="stock-balance-filter-container">
                        <h3 className="stock-balance-title">Stock Balance - Active Stock</h3>
                        <div className="stock-balance-content-top">
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
                            columns={['Product ID', 'Product Name', 'Branch Name', 'Category Name', 'Quantity' ]}
                            rows={stockDetails.map(detail => ({
                                'Product ID': detail.totalQuantity.productId,
                                'Product Name': detail.totalQuantity.productName,
                                'Branch Name': detail.totalQuantity.branch ? detail.totalQuantity.branch.branchName : '',
                                'Category Name': detail.totalQuantity.category ? detail.totalQuantity.category.categoryName : '',
                                'Quantity': detail.totalQuantity.qty,
                                
                            }))} />
                        </div>
                    
                </div>
            </Layout>
        </>
    );
};

export default StockBalance;

