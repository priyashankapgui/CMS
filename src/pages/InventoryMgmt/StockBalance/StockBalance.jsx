import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from "../../../Layout/Layout";
import "./StockBalance.css";
import InputLabel from "../../../Components/Label/InputLabel";
import Buttons from '../../../Components/Buttons/SquareButtons/Buttons';
import TableWithPagi from '../../../Components/Tables/TableWithPagi';
import SearchBar from "../../../Components/SearchBar/SearchBar";
import InputDropdown from "../../../Components/InputDropdown/InputDropdown";

export const StockBalance = () => {
    const [selectedProduct, setSelectedProduct] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('');
    const [stockDetails, setStockDetails] = useState([]);
    const [loading, setLoading] = useState(false);
    const [branches, setBranches] = useState([]);

    // Fetch product suggestions based on user input
    const fetchProductsSuggestions = async (query) => {
        try {
            const response = await axios.get(`http://localhost:8080/product?search=${query}`);
            return response.data.map(product => ({
                id: product.productId,
                displayText: `${product.productId} ${product.productName}`
            }));
        } catch (error) {
            console.error('Error fetching product:', error);
            return [];
        }
    };

    // Fetch branch data for the dropdown
    const fetchBranchesData = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/branches`);
            const branchNames = response.data.map(branch => branch.branchName);
            setBranches(branchNames);
        } catch (error) {
            console.error('Error fetching branches:', error);
            setBranches([]);
        }
    };

    // Handle branch dropdown change
    const handleBranchDropdownChange = (value) => {
        console.log('Selected branch:', value);
        setSelectedBranch(value);
    };

    // Handle search action
    const handleSearch = async () => {
        console.log('Selected product:', selectedProduct);
        console.log('Selected branch:', selectedBranch);

        if (!selectedProduct || !selectedBranch) {
            alert('Please select both a product and a branch.');
            return;
        }

        const productId = selectedProduct.split(' ')[0]; // Extract productId from the selected product string
        console.log('Extracted productId:', productId);

        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:8080/active-stock`, {
                params: {
                    productId,
                    branchName: selectedBranch
                }
            });

            const totalQuantity = response.data.totalQuantity;

            // Ensure totalQuantity is an array
            setStockDetails(totalQuantity ? [totalQuantity] : []);
        } catch (error) {
            console.error('Error fetching price details:', error);
            setStockDetails([]);
        } finally {
            setLoading(false);
        }
    };

    // Handle clear button action
    const handleClearBtn = () => {
        setSelectedProduct('');
        setSelectedBranch('');
        setStockDetails([]);
    };

    useEffect(() => {
        fetchBranchesData();
    }, []);

    return (
        <>
            <div className="top-nav-blue-text">
                <h4>Check Price</h4>
            </div>
            <Layout>
            <div className="stock-balance-bodycontainer">
                    <div className="stock-balance-filter-container">
                        <h3 className="stock-balance-title">Stock Balance</h3>
                        <div className="stock-balance-content-top">
                            <div className="branchField">
                            <InputLabel htmlFor="branchName" color="#0377A8">Branch Name</InputLabel>
                                <InputDropdown
                                    id="branchName"
                                    name="branchName"
                                    editable={true}
                                    options={branches}
                                    onChange={handleBranchDropdownChange}
                                />
                            </div>
                            <div className="productField">
                            <InputLabel htmlFor="productName" color="#0377A8">Product ID / Name</InputLabel>
                                <SearchBar
                                    searchTerm={selectedProduct}
                                    setSearchTerm={setSelectedProduct}
                                    onSelectSuggestion={(suggestion) => setSelectedProduct(`${suggestion.displayText}`)}
                                    fetchSuggestions={fetchProductsSuggestions}
                                />
                            </div>
                        </div>
                        <div className="s-BtnSection">
                            <Buttons type="button" id="search-btn" style={{ backgroundColor: "#23A3DA", color: "white" }} onClick={handleSearch}>Search</Buttons>
                            <Buttons type="button" id="clear-btn" style={{ backgroundColor: "white", color: "#EB1313" }} onClick={handleClearBtn}>Clear</Buttons>
                        </div>
                    </div>
                    <div className="content-middle">
                    {loading ? (
                            <div>Loading...</div>
                        ) : (
                        <TableWithPagi
                            columns={['Product ID', 'Product Name', 'Branch Name', 'Category Name', 'Quantity' ]}
                            rows={stockDetails.map(detail => ({
                                'Product ID': detail.productId,
                                'Product Name': detail.productName,
                                'Branch Name': detail.branchName,
                                'Category Name': detail.categoryName,
                                'Quantity': detail.qty,
                                
                            }))} 
                            />
                        )} 
                        </div>
                    
                </div>
            </Layout>
        </>
    );
};

export default StockBalance;
