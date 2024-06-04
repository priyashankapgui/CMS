import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from "../../../Layout/Layout";
import "./StockBalance.css";
import InputLabel from "../../../Components/Label/InputLabel";
import Buttons from '../../../Components/Buttons/SquareButtons/Buttons';
import TableWithPagi from '../../../Components/Tables/TableWithPagi';
import SearchBar from "../../../Components/SearchBar/SearchBar";
import InputField from '../../../Components/InputField/InputField';
import RoundButtons from '../../../Components/Buttons/RoundButtons/RoundButtons';
import { IoReorderThreeOutline } from "react-icons/io5";
import InputDropdown from '../../../Components/InputDropdown/InputDropdown';

export const StockBalance = () => {
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState('');
    const [product, setProduct] = useState(null);
    const [batchNo, setBatchNo] = useState('');
    const [category, setCategory] = useState(null);
    const [stockDetails, setStockDetails] = useState([]);

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

    const handleCategorySelect = (selectedCategory) => {
        setCategory(selectedCategory);
    };

    const handleSearch = async () => {
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
                    productName: product.name.split(' ').slice(1).join(' '),
                    batchNo: batchNo,
                    categoryName: category ? category.name.split(' ').slice(1).join(' ') : ''
                }
            });

            setStockDetails(response.data);
        } catch (error) {
            console.error('Error fetching stock details:', error);
        }
    };

    const handleClear = () => {
        setSelectedBranch('');
        setProduct(null);
        setBatchNo('');
        setCategory(null);
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
                        <div className="stock-balance-content-top">
                            <div className="branchField">
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
                            <div className="productField">
                                <InputLabel htmlFor="productName" color="#0377A8">Product ID / Name</InputLabel>
                                <SearchBar
                                    fetchSuggestions={fetchSuggestionsProducts}
                                    onSelect={handleProductSelect}
                                />
                            </div>
                            <div className="categoryField">
                                <InputLabel htmlFor="categoryField" color="#0377A8">Category ID / Name</InputLabel>
                                <SearchBar
                                    fetchSuggestions={fetchSuggestionsCategories}
                                    onSelect={handleCategorySelect}
                                />
                            </div>
                            <div className="batchNoField">
                                <InputLabel htmlFor="batchNo" color="#0377A8">Batch No</InputLabel>
                                <InputField type="text" id="batchNo" name="batchNo" editable={true} width="250px" value={batchNo} onChange={(e) => setBatchNo(e.target.value)} />
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
                                'Branch Name': detail.branch ? detail.branch.branchName : '',
                                'Category Name': detail.category ? detail.category.categoryName : '',
                                'Qty': detail.qty,
                                '': (
                                    <div>
                                        <RoundButtons id="summeryBtn" type="submit" name="summeryBtn" icon={<IoReorderThreeOutline />} onClick={() => console.log("Summery Button clicked")} />
                                    </div>
                                )
                            }))} />
                    </div>
                </div>
            </Layout>
        </>
    );
};

export default StockBalance;
