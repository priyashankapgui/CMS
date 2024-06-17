import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from "../../../Layout/Layout";
import "./CheckPrice.css";
import InputLabel from "../../../Components/Label/InputLabel";
import Buttons from '../../../Components/Buttons/SquareButtons/Buttons';
import TableWithPagi from '../../../Components/Tables/TableWithPagi';
import SearchBar from "../../../Components/SearchBar/SearchBar";
import SubSpinner from '../../../Components/Spinner/SubSpinner/SubSpinner';
import BranchDropdown from '../../../Components/InputDropdown/BranchDropdown';

export const CheckPrice = () => {
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState('');
    const [product, setProduct] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [batchDetails, setBatchDetails] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchBranches();
    }, []);

    const fetchBranches = async () => {
        try {
            const response = await axios.get('http://localhost:8080/branches');
            setBranches(response.data);
        } catch (error) {
            console.error('Error fetching branches:', error);
        }
    };

    const handleDropdownChange = (value) => {
        setSelectedBranch(value);
        console.log('Selected Drop Down Value:', value);
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

    const handleSearch = async () => {
        if (!selectedBranch || !product) {
            console.error('Please select both branch and product');
            return;
        }

        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:8080/product-batch-details`, {
                params: {
                    branchName: selectedBranch,
                    productId: product.id, // Send product ID
                }
            });
            setBatchDetails(response.data.data); // Assuming the batch details are in response.data.data
            setLoading(false);
        } catch (error) {
            console.error('Error fetching batch details:', error);
            setLoading(false);
        }
    };

    const handleClear = () => {
        setSelectedBranch('');
        setProduct(null);
        setSelectedProduct('');
        setBatchDetails([]);
    };

    return (
        <>
            <div className="top-nav-blue-text">
                <h4>Check Price</h4>
            </div>
            <Layout>
                <div className="check-price-body-container">
                    <div className="check-price-filter-container">
                        <div className="check-price-content-top">
                            <div className="branch-field">
                                <InputLabel htmlFor="branchName" color="#0377A8">Branch</InputLabel>                          
                                <BranchDropdown
                                    id="branchName"
                                    name="branchName"
                                    editable={true}
                                    onChange={(e) => handleDropdownChange(e)}
                                    addOptions={["All"]}
                                 
                                    />
                            </div>
                            <div className="product-field">
                                <InputLabel htmlFor="productName" color="#0377A8">Product ID / Name</InputLabel>
                                <SearchBar
                                    searchTerm={selectedProduct}
                                    setSearchTerm={setSelectedProduct}
                                    onSelectSuggestion={(suggestion) => {
                                        setSelectedProduct(`${suggestion.displayText}`);
                                        setProduct(suggestion); // Set the selected product object
                                    }}
                                    fetchSuggestions={fetchProductsSuggestions}
                                />
                            </div>
                        </div>
                        <div className="check-price-btn-section">
                            <Buttons type="button" id="search-btn" style={{ backgroundColor: "#23A3DA", color: "white" }} onClick={handleSearch}>Search</Buttons>
                            <Buttons type="button" id="clear-btn" style={{ backgroundColor: "white", color: "#EB1313" }} onClick={handleClear}>Clear</Buttons>
                        </div>
                    </div>
                    <div className="check-price-content-middle">
                        {loading ? (
                            <div><SubSpinner /></div>
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
