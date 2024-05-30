import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from "../../../Layout/Layout";
import "./Products.css";
import TableWithPagi from '../../../Components/Tables/TableWithPagi';
import Buttons from '../../../Components/Buttons/SquareButtons/Buttons';
import InputLabel from "../../../Components/Label/InputLabel";
import DeletePopup from "../../../Components/PopupsWindows/DeletePopup";
import SearchBar from '../../../Components/SearchBar/SearchBar';
import AddNewProductPopup from './AddNewProductPopup';
import { Icon } from "@iconify/react";
import InputField from '../../../Components/InputField/InputField';
import SubSpinner from '../../../Components/Spinner/SubSpinner/SubSpinner';

export const Products = () => {
    // State variables for Registered Products
    const [registeredProducts, setRegisteredProducts] = useState([]);
    const [registeredCategory, setRegisteredCategory] = useState('');
    const [registeredProduct, setRegisteredProduct] = useState('');
    const [loadingRegisteredProducts, setLoadingRegisteredProducts] = useState(false);

    // State variables for Adjusting Product's Category
    const [adjustmentCategories, setAdjustmentCategories] = useState([]);
    const [adjustmentCategory, setAdjustmentCategory] = useState('');
    const [loadingAdjustmentCategories, setLoadingAdjustmentCategories] = useState(false);

    useEffect(() => {
        fetchCategoryNames();
    }, []);

    const fetchRegisteredProductsData = async (category, product) => {
        setLoadingRegisteredProducts(true);
        try {
            let query = '';
            if (category) {
                query = `category=${category}`;
            } else if (product) {
                query = `product=${product}`;
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
        } finally {
            setLoadingRegisteredProducts(false);
        }
    };

    const fetchCategoryAdjustmentData = async (category) => {
        setLoadingAdjustmentCategories(true);
        try {
            const response = await axios.get(`http://localhost:8080/products/categoryAdjustment?category=${category}`);
            setAdjustmentCategories(response.data);
        } catch (error) {
            console.error('Error fetching category adjustment data:', error);
            setAdjustmentCategories([]);
        } finally {
            setLoadingAdjustmentCategories(false);
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

    const handleRegisteredSearchBtn = () => {
        fetchRegisteredProductsData(registeredCategory, registeredProduct);
    };

    const handleRegisteredClearBtn = () => {
        console.log('Selected data cleared.');
        setRegisteredCategory('');
        setRegisteredProduct('');
        setRegisteredProducts([]);
    };

    const handleCategoryInputChange = (e) => {
        const query = e.target.value;
        setAdjustmentCategory(query);
        fetchCategoryAdjustmentData(query);
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
                            <div className="productField">
                                <InputLabel htmlFor="product" color="#0377A8">Product ID / Name</InputLabel>
                                <SearchBar
                                    searchTerm={registeredProduct}
                                    setSearchTerm={setRegisteredProduct}
                                    onSelectSuggestion={(suggestion) => setRegisteredProduct(suggestion.displayText)}
                                    fetchSuggestions={fetchProductsSuggestion}
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
                        </div>
                        <div className="p-BtnSection">
                            <Buttons type="submit" id="search-btn" style={{ backgroundColor: "#23A3DA", color: "white" }} onClick={handleRegisteredSearchBtn}>Search</Buttons>
                            <Buttons type="submit" id="clear-btn" style={{ backgroundColor: "white", color: "#EB1313" }} onClick={handleRegisteredClearBtn}>Clear</Buttons>
                            <AddNewProductPopup />
                        </div>
                    </div>
                    <div className="product-content-middle">
                        {loadingRegisteredProducts ? (
                            <div> <SubSpinner /> </div>
                        ) : (
                            <TableWithPagi
                                columns={['Barcode', 'Product ID', 'Product Name', 'Product Category', 'Description', 'Action']}
                                rows={Array.isArray(registeredProducts) ? registeredProducts.map(product => ({
                                    'Barcode': product.barcode,
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
                        )}
                    </div>
                </div>

                {/* Adjust Product's Category Section */}
                <div className="create-product-category-section">
                    <div className="category-filter-container">
                        <h3 className="create-product-category-title">Registered Product's Categories</h3>
                        <div className="create-product-category-top">
                            <div className="categoryField">
                                <InputLabel htmlFor="category" color="#0377A8">Search Category ID / Name</InputLabel>
                                <InputField
                                    type="text"
                                    id="category-search-field"
                                    name="category-search-field"
                                    editable={true}
                                    width="100%"
                                    value={adjustmentCategory}
                                    onChange={handleCategoryInputChange}
                                />
                            </div>
                        </div>
                        <div className="create-product-category-middle">
                            {loadingAdjustmentCategories ? (
                                <div> <SubSpinner /> </div>
                            ) : (
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
                            )}
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
};

export default Products;
