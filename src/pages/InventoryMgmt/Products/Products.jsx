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
    const [productsData, setProductsData] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state
    const [selectedProduct, setSelectedProduct] = useState('');

    // State variables for Adjusting Product's Category
    const [categoryData, setCategoryData] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');

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

    const fetchCategorySuggestions = async (query) => {
        try {
            const response = await axios.get(`http://localhost:8080/categories?search=${query}`);
            return response.data.map(category => ({
                id: category.categoryId,
                displayText: `${category.categoryId} ${category.categoryName}`
            }));
        } catch (error) {
            console.error('Error fetching category:', error);
            return [];
        }
    };

    const handleClearBtn = () => {
        setSelectedProduct('');
        setProductsData([]);
        setSelectedCategory('');
        setCategoryData([]);
    };

    useEffect(() => {
        const fetchProductsData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/product`);
                setProductsData(response.data); // Set the fetched product data
                setLoading(false);
            } catch (error) {
                console.error('Error fetching products:', error);
                setLoading(false);
            }
        };

        fetchProductsData();
    }, []);

    useEffect(() => {
        const fetchCategoryData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/categories`);
                setCategoryData(response.data); // Set the fetched product data
                setLoading(false);
            } catch (error) {
                console.error('Error fetching category:', error);
                setLoading(false);
            }
        };

        fetchCategoryData();
    }, []);

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
                                    searchTerm={selectedProduct}
                                    setSearchTerm={setSelectedProduct}
                                    onSelectSuggestion={(suggestion) => setSelectedProduct(`${suggestion.displayText}`)}
                                    fetchSuggestions={fetchProductsSuggestions}
                                />
                            </div>
                            <div className="categoryField">
                                <InputLabel htmlFor="category" color="#0377A8">Category</InputLabel>
                                <SearchBar
                                    searchTerm={selectedCategory}
                                    setSearchTerm={setSelectedCategory}
                                    onSelectSuggestion={(suggestion) => setSelectedCategory(`${suggestion.displayText}`)}
                                    fetchSuggestions={fetchCategorySuggestions}
                                />
                            </div>
                        </div>
                        <div className="p-BtnSection">
                            <Buttons type="submit" id="search-btn" style={{ backgroundColor: "#23A3DA", color: "white" }} onClick={handleClearBtn}>Search</Buttons>
                            <Buttons type="submit" id="clear-btn" style={{ backgroundColor: "white", color: "#EB1313" }} >Clear</Buttons>
                            <AddNewProductPopup />
                        </div>
                    </div>
                    <div className="product-content-middle">
                        {loading ? (
                            <div>Loading...</div>
                        ) : (
                            <TableWithPagi
                                columns={['Product ID', 'Product Name', 'Product Category', 'Description', 'Quantity', 'Action']}
                                rows={Array.isArray(productsData) ? productsData.map(product => ({
                                    'Product ID': product.productId,
                                    'Product Name': product.productName,
                                    'Product Category': product.category?.categoryName,
                                    'Description': product.description,
                                    'Quantity': product.qty,
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

                <div className="create-product-category-section">
                    <div className="category-filter-container">
                        <h3 className="create-product-category-title">Registered Product's Categories</h3>
                        <div className="create-product-category-top">
                            <div className="categoryField">
                                <InputLabel htmlFor="category" color="#0377A8">Search Category ID / Name</InputLabel>
                                <SearchBar
                                    searchTerm={selectedCategory}
                                    setSearchTerm={setSelectedCategory}
                                    onSelectSuggestion={(suggestion) => setSelectedCategory(`${suggestion.displayText}`)}
                                    fetchSuggestions={fetchCategorySuggestions}
                                />
                            </div>
                        </div>
                        <div className="p-BtnSection">
                            <Buttons type="submit" id="search-btn" style={{ backgroundColor: "#23A3DA", color: "white" }} onClick={handleClearBtn}>Search</Buttons>
                            <Buttons type="submit" id="clear-btn" style={{ backgroundColor: "white", color: "#EB1313" }} >Clear</Buttons>
                        </div>
                        <div className="create-product-category-middle">
                            {loading ? (
                                <div>Loading...</div>
                            ) : (
                                <TableWithPagi
                                    columns={['Reg Categories', 'Action']}
                                    rows={Array.isArray(categoryData) ? categoryData.map(category => ({
                                        'Reg Categories': category.categoryName,
                                        'Action': (
                                            <div style={{ display: "flex", gap: "0.5em" }}>
                                                <Icon icon="bitcoin-icons:edit-outline" style={{ fontSize: '24px' }} />
                                                <DeletePopup />
                                            </div>
                                        )
                                    })) : []}
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
