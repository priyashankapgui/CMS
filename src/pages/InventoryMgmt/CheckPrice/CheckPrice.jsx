import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from "../../../Layout/Layout";
import "./CheckPrice.css";
import InputLabel from "../../../Components/Label/InputLabel";
import Buttons from '../../../Components/Buttons/SquareButtons/Buttons';
import TableWithPagi from '../../../Components/Tables/TableWithPagi';
import SearchBar from "../../../Components/SearchBar/SearchBar";
import InputDropdown from "../../../Components/InputDropdown/InputDropdown";

export const CheckPrice = () => {
    const [selectedProduct, setSelectedProduct] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('');
    const [batchDetails, setBatchDetails] = useState([]);
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
            const response = await axios.get(`http://localhost:8080/product-Batch-Sum`, {
                params: {
                    productId,
                    branchName: selectedBranch
                }
            });
            setBatchDetails(response.data);
        } catch (error) {
            console.error('Error fetching price details:', error);
            setBatchDetails([]);
        } finally {
            setLoading(false);
        }
    };

    // Handle clear button action
    const handleClearBtn = () => {
        setSelectedProduct('');
        setSelectedBranch('');
        setBatchDetails([]);
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
                <div className="check-price-bodycontainer">
                    <div className="check-price-filter-container">
                        <h3 className="check-price-title">Check Price</h3>
                        <div className="check-price-content-top">
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
                                columns={['Branch Name', 'Batch No', 'Exp Date', 'Available Qty', 'Selling Price']}
                                rows={batchDetails.map(detail => ({
                                    'Branch Name': detail.branchName,
                                    'Batch No': detail.batchNo,
                                    'Exp Date': detail.expDate,
                                    'Available Qty': detail.availableQty,
                                    'Selling Price': detail.sellingPrice,
                                }))}
                            />
                        )}
                    </div>
                </div>
            </Layout>
        </>
    );
};

export default CheckPrice;
