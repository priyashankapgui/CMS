import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from "../../../Layout/Layout";
import "./Products.css";
import TableWithPagi from '../../../Components/Tables/TableWithPagi';
import Buttons from '../../../Components/Buttons/SquareButtons/Buttons';
import InputLabel from "../../../Components/Label/InputLabel";
import DeletePopup from "../../../Components/PopupsWindows/DeletePopup";
import SearchBar from '../../../Components/SearchBar/SearchBar';
import InputDropdown from '../../../Components/InputDropdown/InputDropdown';
import InputField from '../../../Components/InputField/InputField';
import AddNewProductPopup from './AddNewProductPopup';
import { Icon } from "@iconify/react";

export const Products = () => {
    // State variables for Registered Products
    const [registeredProducts, setRegisteredProducts] = useState([]);
    const [registeredBranch, setRegisteredBranch] = useState('');
    const [registeredCategory, setRegisteredCategory] = useState('');
    const [registeredProduct, setRegisteredProduct] = useState('');

    // State variables for Adjusting Product's Price
    const [priceAdjustmentBranch, setPriceAdjustmentBranch] = useState('');
    const [priceAdjustmentProduct, setPriceAdjustmentProduct] = useState('');
    const [priceAdjustmentBatchNo, setPriceAdjustmentBatchNo] = useState('');
    const [priceAdjustmentUnitPrice, setPriceAdjustmentUnitPrice] = useState('');

    // State variables for Adjusting Product's Category
    const [adjustmentCategories, setAdjustmentCategories] = useState([]);
    const [adjustmentBranch, setAdjustmentBranch] = useState('');
    const [adjustmentCategory, setAdjustmentCategory] = useState('');

    const [branches, setBranches] = useState([]);

    useEffect(() => {
        fetchBranchesData();
        fetchCategoryNames();
    }, []);

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

    const fetchRegisteredProductsData = async (branch, category, product) => {
        try {
            let query = '';
            if (branch && category) {
                query = `branch=${branch}&category=${category}`;
            } else if (branch && product) {
                query = `branch=${branch}&product=${product}`;
            }

            const response = await axios.get(`http://localhost:8080/products?${query}`);
            if (Array.isArray(response.data)) {
                setRegisteredProducts(response.data);
            } else {
                console.error('Unexpected response format:', response.data);
                setRegisteredProducts([]);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            setRegisteredProducts([]);
        }
    };

    const fetchPriceAdjustmentData = async (branch, product) => {
        try {
            const response = await axios.get(`http://localhost:8080/products/priceAdjustment?branch=${branch}&product=${product}`);
            const productData = response.data;
            setPriceAdjustmentBatchNo(productData.batchNo);
            setPriceAdjustmentUnitPrice(productData.unitPrice);
        } catch (error) {
            console.error('Error fetching price adjustment data:', error);
            setPriceAdjustmentBatchNo('');
            setPriceAdjustmentUnitPrice('');
        }
    };

    const fetchCategoryAdjustmentData = async (branch, category) => {
        try {
            const response = await axios.get(`http://localhost:8080/products/categoryAdjustment?branch=${branch}&category=${category}`);
            setAdjustmentCategories(response.data);
        } catch (error) {
            console.error('Error fetching category adjustment data:', error);
            setAdjustmentCategories([]);
        }
    };

    const fetchProductsSuggestion = async (query) => {
        try {
            const response = await axios.get(`http://localhost:8080/products?search=${query}`);
            return response.data.map(product => ({
                id: product.productId,
                displayText: `${product.productId} ${product.productName}`
            }));
        } catch (error) {
            console.error('Error fetching products:', error);
            return [];
        }
    };

    const fetchCategories = async (query) => {
        try {
            const response = await axios.get(`http://localhost:8080/categories?search=${query}`);
            return response.data.map(category => ({ id: category.categoryId, displayText: category.categoryName }));
        } catch (error) {
            console.error('Error fetching categories:', error);
            return [];
        }
    };

    const fetchCategoryNames = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/categories`);
            setAdjustmentCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setAdjustmentCategories([]);
        }
    };

    const handleRegisteredDropdownChange = (value) => {
        console.log('Selected Dropdown Value:', value);
        setRegisteredBranch(value);
    };

    const handlePriceAdjustmentDropdownChange = (value) => {
        console.log('Selected Dropdown Value:', value);
        setPriceAdjustmentBranch(value);
    };

    const handleAdjustmentBranchChange = (value) => {
        console.log('Selected Dropdown Value:', value);
        setAdjustmentBranch(value);
    };

    const handleRegisteredSearchBtn = () => {
        fetchRegisteredProductsData(registeredBranch, registeredCategory, registeredProduct);
    };

    const handleRegisteredClearBtn = () => {
        console.log('Selected data cleared.');
        setRegisteredBranch('');
        setRegisteredCategory('');
        setRegisteredProduct('');
        setRegisteredProducts([]);
    };

    const handlePriceAdjustmentSearchBtn = () => {
        fetchPriceAdjustmentData(priceAdjustmentBranch, priceAdjustmentProduct);
    };

    const handleCategoryAdjustmentSearchBtn = () => {
        fetchCategoryAdjustmentData(adjustmentBranch, adjustmentCategory);
    };

    return (
        <>
            <div className="top-nav-blue-text">
                <h4>Products</h4>
            </div>
            <Layout>
                {/* Registered Products Section */}
                <div className="reg-product-bodycontainer">
                    <div className="product-filter-container">
                        <h3 className="reg-product-title">Registered Products</h3>
                        <div className="product-content-top">
                            <div className="branchField">
                                <InputLabel htmlFor="branchName" color="#0377A8">Branch</InputLabel>
                                <InputDropdown
                                    id="branchName"
                                    name="branchName"
                                    editable={true}
                                    options={branches}
                                    onChange={handleRegisteredDropdownChange}
                                />
                            </div>
                            <div className="categoryField">
                                <InputLabel htmlFor="category" color="#0377A8">Category</InputLabel>
                                <SearchBar
                                    searchTerm={registeredCategory}
                                    setSearchTerm={setRegisteredCategory}
                                    onSelectSuggestion={(suggestion) => setRegisteredCategory(suggestion.displayText)}
                                    fetchSuggestions={fetchCategories}
                                />
                            </div>
                            <div className="productField">
                                <InputLabel htmlFor="product" color="#0377A8">Product ID / Name</InputLabel>
                                <SearchBar
                                    searchTerm={registeredProduct}
                                    setSearchTerm={setRegisteredProduct}
                                    onSelectSuggestion={(suggestion) => setRegisteredProduct(suggestion.displayText)}
                                    fetchSuggestions={fetchProductsSuggestion}
                                />
                            </div>
                        </div>
                        <div className="p-BtnSection">
                            <Buttons type="submit" id="search-btn" style={{ backgroundColor: "#23A3DA", color: "white" }} onClick={handleRegisteredSearchBtn}>Search</Buttons>
                            <Buttons type="submit" id="clear-btn" style={{ backgroundColor: "white", color: "#EB1313" }} onClick={handleRegisteredClearBtn}>Clear</Buttons>
                            <AddNewProductPopup />
                        </div>
                    </div>
                    <div className="product-content-middle">
                        <TableWithPagi
                            columns={['Product ID', 'Product Name', 'Product Category', 'Description', 'Action']}
                            rows={Array.isArray(registeredProducts) ? registeredProducts.map(product => ({
                                'Product ID': product.productId,
                                'Product Name': product.productName,
                                'Product Category': product.category?.categoryName,
                                'Description': product.description,
                                'Actions': (
                                    <div style={{ display: "flex", gap: "0.5em" }}>
                                        <DeletePopup />
                                    </div>
                                )
                            })) : []}
                        />
                    </div>
                </div>

                {/* Adjust Product's Price Section */}
                <div className="adjust-product-price-section">
                    <div className="adjust-product-price-filter-container">
                        <h3 className="adjust-product-price-title">Adjust Product's Price</h3>
                        <div className="adjust-product-price-top">
                            <div className="branchField">
                                <InputLabel htmlFor="branchName" color="#0377A8">Branch</InputLabel>
                                <InputDropdown
                                    id="branchName"
                                    name="branchName"
                                    editable={true}
                                    options={branches}
                                    onChange={handlePriceAdjustmentDropdownChange}
                                />
                            </div>
                            <div className="productField">
                                <InputLabel htmlFor="product" color="#0377A8">Product ID / Name</InputLabel>
                                <SearchBar
                                    searchTerm={priceAdjustmentProduct}
                                    setSearchTerm={setPriceAdjustmentProduct}
                                    onSelectSuggestion={(suggestion) => setPriceAdjustmentProduct(suggestion.displayText)}
                                    fetchSuggestions={fetchProductsSuggestion}
                                />
                            </div>
                        </div>
                        <Buttons type="submit" id="search-btn" style={{ backgroundColor: "#23A3DA", color: "white" }} onClick={handlePriceAdjustmentSearchBtn}>Search</Buttons>
                        <div className="adjust-product-price-middle">
                            <div className="batchNoField">
                                <InputLabel htmlFor="batchNo" color="#0377A8">Batch No</InputLabel>
                                <InputDropdown
                                    id="batchNo"
                                    name="batchNo"
                                    editable={true}
                                    options={[]}
                                    value={priceAdjustmentBatchNo}
                                    onChange={(value) => setPriceAdjustmentBatchNo(value)}
                                />
                            </div>
                            <div className="unitPriceField">
                                <InputLabel htmlFor="unitPrice" color="#0377A8">Unit Price</InputLabel>
                                <InputField type="text" id="unitPrice" name="unitPrice" editable={true} width="215px" value={priceAdjustmentUnitPrice} onChange={(e) => setPriceAdjustmentUnitPrice(e.target.value)} />
                            </div>
                            <Buttons type="submit" id="update-btn" style={{ backgroundColor: "#23A3DA", color: "white" }} marginTop="1.563em"> Update </Buttons>
                        </div>
                    </div>
                </div>

                {/* Adjust Product's Category Section */}
                <div className="create-product-category-section">
                    <div className="category-filter-container">
                        <h3 className="create-product-category-title">Adjust Product's Category</h3>
                        <div className="create-product-category-top">
                            <div className="branchField">
                                <InputLabel htmlFor="branchName" color="#0377A8">Branch</InputLabel>
                                <InputDropdown
                                    id="branchName"
                                    name="branchName"
                                    editable={true}
                                    options={branches}
                                    onChange={handleAdjustmentBranchChange}
                                />
                            </div>
                            <div className="categoryField">
                                <InputLabel htmlFor="category" color="#0377A8">Category</InputLabel>
                                <SearchBar
                                    searchTerm={adjustmentCategory}
                                    setSearchTerm={setAdjustmentCategory}
                                    onSelectSuggestion={(suggestion) => setAdjustmentCategory(suggestion.displayText)}
                                    fetchSuggestions={fetchCategories}
                                />
                            </div>
                        </div>
                        <Buttons type="submit" id="search-btn" style={{ backgroundColor: "#23A3DA", color: "white" }} onClick={handleCategoryAdjustmentSearchBtn}>Search</Buttons>
                        <div className="create-product-category-middle">
                            <TableWithPagi
                                columns={['Reg Categories', 'Action']}
                                rows={adjustmentCategories.map(category => ({
                                    'Reg Categories': category.categoryName,
                                    'Action': (
                                        <div style={{ display: "flex", gap: "0.5em" }}>
                                            <Icon icon="bitcoin-icons:edit-outline" style={{ fontSize: '24px' }} />
                                            <DeletePopup />
                                        </div>
                                    )
                                }))}
                            />
                        </div>
                    </div>
                </div>

            </Layout>
        </>
    );
};

export default Products;
