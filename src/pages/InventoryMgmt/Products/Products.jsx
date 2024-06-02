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
import UpdateProductPopup from './UpdateProductPopup';
import { Icon } from "@iconify/react";
import InputField from '../../../Components/InputField/InputField';
import SubSpinner from '../../../Components/Spinner/SubSpinner/SubSpinner';
import CustomAlert from '../../../Components/Alerts/CustomAlert/CustomAlert';



export const Products = () => {

    const [loading, setLoading] = useState(true);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertConfig, setAlertConfig] = useState({});
    const [editingSupplier, setEditingSupplier] = useState(null);     



    // State variables for Registered Products
    const [productsData, setProductsData] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState('');

    // State variables for Adjusting Product's Category
    const [categoryData, setCategoryData] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');

    // State variables for Adjusting  Category
    const [categoryTwoData, setCategoryTwoData] = useState([]);
    const [selectedCategoryTwo, setSelectedCategoryTwo] = useState('');

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

    const handleSearch = async () => {
        setLoading(true);
        try {
            if (selectedCategory) {
                const categoryName = selectedCategory.split(' ')[1]; // Extract the categoryName from the selected category string
                const response = await axios.get(`http://localhost:8080/products/category?categoryName=${categoryName}`);
                console.log("Fetched Products by Category Data: ", response.data); // Debugging: Log the fetched data
                setProductsData(response.data); // Set the fetched data
            } else if (selectedProduct) {
                const productId = selectedProduct.split(' ')[0]; // Extract the productId from the selected product string
                const response = await axios.get(`http://localhost:8080/products?productId=${productId}`);
                console.log("Fetched Products Data: ", response.data); // Debugging: Log the fetched data
                setProductsData([response.data]); // Ensure it's an array
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchCategory = async () => {
        setLoading(true);
        try {
            if (selectedCategoryTwo) {
                const categoryId = selectedCategoryTwo.split(' ')[0]; // Extract the categoryId from the selected category string
                const response = await axios.get(`http://localhost:8080/categories/${categoryId}`);
                console.log("Fetched Products by Category ID Data: ", response.data); // Debugging: Log the fetched data
                setCategoryTwoData([response.data]); // Set the fetched data
            }
        } catch (error) {
            console.error('Error fetching category by ID:', error);
        } finally {
            setLoading(false);
        }
    };
    
    


    const handleDelete = async (productId) => {
        setLoading(true);
        try {
            await axios.delete(`http://localhost:8080/products/${productId}`);
            const updatedProductData = productsData.filter(product => product.productId !== productId);
            setProductsData(updatedProductData);
            console.log("Product deleted successfully");

            setAlertConfig({
                severity: 'warning',
                title: 'Delete',
                message: 'Product deleted successfully!',
                duration: 3000
            });
            setAlertVisible(true);
        } catch (error) {
            console.error('Error deleting Product:', error);

            setAlertConfig({
                severity: 'error',
                title: 'Error',
                message: 'Failed to delete Product.',
                duration: 3000
            });
            setAlertVisible(true);
        } finally {
            setLoading(false);
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
                console.log("Initial Products Data: ", response.data); // Debugging: Log the initial fetched data
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
                console.log("Fetched Category Data: ", response.data); // Debugging: Log the fetched data
                setCategoryTwoData(response.data); // Set the fetched product data
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
        {alertVisible && (
                <CustomAlert
                    severity={alertConfig.severity}
                    title={alertConfig.title}
                    message={alertConfig.message}
                    duration={alertConfig.duration}
                    onClose={() => setAlertVisible(false)}
                />
            )}
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
                            <Buttons type="submit" id="search-btn" style={{ backgroundColor: "#23A3DA", color: "white" }} onClick={handleSearch}>Search</Buttons>
                            <Buttons type="submit" id="clear-btn" style={{ backgroundColor: "white", color: "#EB1313" }} onClick={handleClearBtn}>Clear</Buttons>
                            <AddNewProductPopup />
                        </div>
                    </div>
                    <div className="product-content-middle">
                    {loading ? (
                            <div> <SubSpinner /></div>
                        ) : (
                            <TableWithPagi
                                columns={['Product ID', 'Product Name', 'Category', 'Description', 'Actions']}
                                rows={Array.isArray(productsData) ? productsData.map(product => ({
                                    'Product ID': product.productId,
                                    'Product Name': product.productName,
                                    'Category': product.categoryName,
                                    'Description': product.description,
                                    'Actions': (
                                        <div style={{ display: "flex", gap: "0.5em" }}>
                                        <UpdateProductPopup productId={product.productId} /> {/* Pass supplier data */}
                                        <DeletePopup handleDelete={() => handleDelete(product.productId)} />
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
                                    searchTerm={selectedCategoryTwo}
                                    setSearchTerm={setSelectedCategoryTwo}
                                    onSelectSuggestion={(suggestion) => setSelectedCategoryTwo(`${suggestion.displayText}`)}
                                    fetchSuggestions={fetchCategorySuggestions}
                                />
                               
                            </div>
                        </div>
                        <div className="p-BtnSection">
                            <Buttons type="submit" id="search-btn" style={{ backgroundColor: "#23A3DA", color: "white" }} onClick={handleSearchCategory}>Search</Buttons>
                            <Buttons type="submit" id="clear-btn" style={{ backgroundColor: "white", color: "#EB1313" }} onClick={handleClearBtn}>Clear</Buttons>
                        </div>
                        <div className="create-product-category-middle">
                        {loading ? (
                            <div> <SubSpinner /></div>
                        ) : (
                            <TableWithPagi
                            columns={['Reg Categories', 'Action']}
                            rows={Array.isArray(categoryTwoData) ? categoryTwoData.map(category => ({
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