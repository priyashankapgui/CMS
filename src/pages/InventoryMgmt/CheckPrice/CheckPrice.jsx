import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from "../../../Layout/Layout";
import "./CheckPrice.css";
import InputLabel from "../../../Components/Label/InputLabel";
import Buttons from '../../../Components/Buttons/SquareButtons/Buttons';
import TableWithPagi from '../../../Components/Tables/TableWithPagi';
import SearchBar from "../../../Components/SearchBar/SearchBar";
import SubSpinner from '../../../Components/Spinner/SubSpinner/SubSpinner';
import InputDropdown from '../../../Components/InputDropdown/InputDropdown';

export const CheckPrice = () => {

    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState('');
    const [product, setProduct] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [batchDetails, setBatchDetails] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBranches();
    }, []);

    const fetchBranches = async () => {
        try {
            const response = await axios.get('http://localhost:8080/branches');
            setBranches(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching branches:', error);
            setLoading(false);
        }
    };

    const handleDropdownChange = (value) => {
        setSelectedBranch(value);
        console.log('Selected Drop Down Value:', value);
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


    const handleSearch = async () => {
        if (!selectedBranch || !product) {
            console.error('Please select both branch and product');
            return;
        }

        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:8080/product-GRN`, {
                params: {
                    branchName: selectedBranch.split(' ').slice(1).join(' '), // Send only branch name
                    productName: product.name.split(' ').slice(1).join(' '), // Send only product name
                }
            });
            setBatchDetails(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching batch details:', error);
            setLoading(false);
        }
    };

    const handleClear = () => {
        setSelectedBranch('');
        setProduct(null);
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
                                <InputDropdown
                                    id="branchName"
                                    name="branchName"
                                    editable={true}
                                    options={branches.map(branch => branch.branchName)}
                                    onChange={handleDropdownChange}
                                    value={selectedBranch}
                                />
                            </div>
                            <div className="product-field">
                                <InputLabel htmlFor="productName" color="#0377A8">Product ID / Name</InputLabel>
                                <SearchBar
                                    searchTerm={selectedProduct}
                                    setSearchTerm={setSelectedProduct}
                                    onSelectSuggestion={(suggestion) => setSelectedProduct(`${suggestion.displayText}`)}
                                    fetchSuggestions={fetchSuggestionsProducts }
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
                            <div><SubSpinner/></div>
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
