import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from "../../../Layout/Layout";
import "./StockBalance.css";
import InputLabel from "../../../Components/Label/InputLabel";
import Buttons from '../../../Components/Buttons/SquareButtons/Buttons';
import TableWithPagi from '../../../Components/Tables/TableWithPagi';
import SearchBar from "../../../Components/SearchBar/SearchBar";
import BranchDropdown from '../../../Components/InputDropdown/BranchDropdown';
import SubSpinner from '../../../Components/Spinner/SubSpinner/SubSpinner';
import StockSummary from './StockSummary';
import AdjustStock from './AdjustStock';

export const StockBalance = () => {
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState('');
    const [product, setProduct] = useState(null);
    const [batchNo, setBatchNo] = useState('');
    const [category, setCategory] = useState(null);
    const [stockDetails, setStockDetails] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBranches();
        fetchAllProducts();
    }, []);

    const fetchBranches = async () => {
        try {
            const response = await axios.get('http://localhost:8080/branchesWeb');
            setBranches(response.data);
        } catch (error) {
            console.error('Error fetching branches:', error);
        }
    };

    const fetchAllProducts = async () => {
        try {
            const response = await axios.get('http://localhost:8080/products');
            setProducts(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching all products:', error);
            setLoading(false);
        }
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

    const fetchSuggestionsCategories = async (searchTerm) => {
        try {
            const response = await axios.get(`http://localhost:8080/categories?query=${encodeURIComponent(searchTerm)}`);
            return response.data.map(item => ({
                id: item.categoryId,
                name: `${item.categoryId} ${item.categoryName}`
            }));
        } catch (error) {
            console.error('Error fetching category suggestions:', error);
            return [];
        }
    };

    const handleDropdownChange = (value) => {
        setSelectedBranch(value);
        console.log('Selected Drop Down Value:', value);
    };

    const handleProductSelect = (selectedProduct) => {
        setProduct(selectedProduct);
    };

    const handleSearch = async () => {
        setLoading(true);
        if (!selectedBranch || !product) {
            console.error('Please select both branch and product');

            return;
        }

        console.log('Branch:', selectedBranch);
        console.log('Product:', product);

        try {
            const response = await axios.get('http://localhost:8080/active-stock', {
                params: {
                    branchName: selectedBranch,
                    productId: product.id,
                }
            });

            const data = response.data.data;
            setStockDetails(Array.isArray(data) ? data : [data]);
        } catch (error) {
            console.error('Error fetching stock details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setSelectedBranch('');
        setProduct(null);
        setBatchNo('');
        setCategory(null);
        setStockDetails([]);
        window.location.reload();
    };

    return (
        <>
            <div className="stock-balance-bodycontainer">
                <div className="stock-balance-filter-container">
                    <div className="stock-balance-content-top">
                        <div className="branchField">
                            <InputLabel htmlFor="branchName" color="#0377A8">Branch<span style={{ color: 'red' }}>*</span></InputLabel>
                            <BranchDropdown
                                id="branchName"
                                name="branchName"
                                editable={true}
                                onChange={(e) => handleDropdownChange(e)}
                                addOptions={["All"]}
                            />
                        </div>
                        <div className="productField">
                            <InputLabel htmlFor="product" color="#0377A8">Product ID / Name<span style={{ color: 'red' }}>*</span></InputLabel>
                            <SearchBar
                                searchTerm={selectedProduct}
                                setSearchTerm={setSelectedProduct}
                                onSelectSuggestion={(suggestion) => {
                                    setSelectedProduct(`${suggestion.displayText}`);
                                    setProduct(suggestion);
                                }}
                                fetchSuggestions={fetchProductsSuggestions}
                            />
                        </div>

                    </div>
                    <div className="stock-balance-BtnSection">
                        <Buttons type="button" id="search-btn" style={{ backgroundColor: "#23A3DA", color: "white" }} onClick={handleSearch}>Search</Buttons>
                        <Buttons type="button" id="clear-btn" style={{ backgroundColor: "white", color: "#EB1313" }} onClick={handleClear}>Clear</Buttons>
                    </div>
                </div>
                <div className="stock-balance-content-middle">
                    <p className="stock-active-balance-title">Active Stock</p>

                    <TableWithPagi
                        columns={['Product ID', 'Product Name', 'Branch Name', 'Category Name', 'Qty', '']}
                        rows={stockDetails.map(detail => ({
                            'Product ID': detail.productId,
                            'Product Name': detail.productName,
                            'Branch Name': detail.branchName,
                            'Category Name': detail.categoryName,
                            'Qty': detail.qty,
                            '': (
                                <div style={{ display: "flex", gap: "0.5em" }}>
                                    <StockSummary
                                        productId={detail.productId}
                                        productName={detail.productName}
                                        branchName={detail.branchName}
                                        qty={detail.qty}
                                    />
                                    <AdjustStock
                                        productId={detail.productId}
                                        productName={detail.productName}
                                        branchName={detail.branchName}
                                    />
                                </div>
                            )
                        }))}
                    />
                </div>
            </div>

        </>
    );
};

export default StockBalance;
