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
import SubSpinner from '../../../Components/Spinner/SubSpinner/SubSpinner';

export const Products = () => {
    // State variables for Registered Products
    const [productsData, setProductsData] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true); // Loading state for products
    const [selectedProduct, setSelectedProduct] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    
    // State variables for Adjusting Product's Category
    const [categoryData, setCategoryData] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true); // Loading state for categories
    const [selectedAdjustCategory, setSelectedAdjustCategory] = useState('');
    const [filteredCategories, setFilteredCategories] = useState([]);

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

    const handleClearBtnProductSection = () => {
        setSelectedProduct('');
        setSelectedCategory('');
    };

    useEffect(() => {
        const fetchProductsData = async () => {
            try {
                setLoadingProducts(true); // Set loading to true before fetching products
                const response = await axios.get(`http://localhost:8080/product`);
                setProductsData(response.data); // Set the fetched product data
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoadingProducts(false); // Set loading to false after fetching products
            }
        };

        fetchProductsData();
    }, []);

    useEffect(() => {
        const fetchCategoryData = async () => {
            try {
                setLoadingCategories(true); // Set loading to true before fetching categories
                const response = await axios.get(`http://localhost:8080/categories`);
                setCategoryData(response.data); // Set the fetched category data
                setFilteredCategories(response.data); // Initialize filtered categories with all data
            } catch (error) {
                console.error('Error fetching category:', error);
            } finally {
                setLoadingCategories(false); // Set loading to false after fetching categories
            }
        };

        fetchCategoryData();
    }, []);

    useEffect(() => {
        const filtered = categoryData.filter(category =>
            category.categoryName.toLowerCase().includes(selectedAdjustCategory.toLowerCase())
        );
        setFilteredCategories(filtered);
    }, [selectedAdjustCategory, categoryData]);

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
                            <Buttons type="submit" id="search-btn" style={{ backgroundColor: "#23A3DA", color: "white" }} >Search</Buttons>
                            <Buttons type="submit" id="clear-btn" style={{ backgroundColor: "white", color: "#EB1313" }} onClick={handleClearBtnProductSection} >Clear</Buttons>
                            <AddNewProductPopup />
                        </div>
                    </div>
                    <div className="product-content-middle">
                        {loadingProducts ? (
                            <div><SubSpinner /></div>
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
                                    searchTerm={selectedAdjustCategory}
                                    setSearchTerm={setSelectedAdjustCategory}
                                    onSelectSuggestion={(suggestion) => setSelectedAdjustCategory(`${suggestion.displayText}`)}
                                    fetchSuggestions={fetchCategorySuggestions}
                                />
                            </div>
                        </div>

                        <div className="create-product-category-middle">
                            {loadingCategories ? (
                                <div>Loading...</div>
                            ) : (
                                <TableWithPagi
                                    columns={['Reg Categories', 'Action']}
                                    rows={Array.isArray(filteredCategories) ? filteredCategories.map(category => ({
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
