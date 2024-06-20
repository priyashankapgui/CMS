import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from "../../../Layout/Layout";
import "./MinimumStock.css";
import InputLabel from "../../../Components/Label/InputLabel";
import Buttons from '../../../Components/Buttons/SquareButtons/Buttons';
import TableWithPagi from '../../../Components/Tables/TableWithPagi';
import SearchBar from "../../../Components/SearchBar/SearchBar";
import BranchDropdown from '../../../Components/InputDropdown/BranchDropdown';
import SubSpinner from '../../../Components/Spinner/SubSpinner/SubSpinner';

export const MinimunStock = () => {
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
        fetchProductQuantities(); // Fetch product quantities based on user role
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

    const fetchProductQuantities = async () => {
        const user = JSON.parse(sessionStorage.getItem("user"));
        console.log("name", user);

        if (!user) {
            console.error('User is not available');
            setLoading(false);
            return;
        }
        console.log("user role", user.role);

        try {
            let response;
            if (user.role === 'Super Admin') {
                response = await axios.get('http://localhost:8080/product-quantities');
            } else if (user.branchName) {
                response = await axios.get(`http://localhost:8080/product-quantities-by-branch?branchName=${user.branchName}`);
            } else {
                console.error('Branch name is not available for the user');
                setLoading(false);
                return;
            }
            setStockDetails(response.data?.data || []);
        } catch (error) {
            console.error('Error fetching product quantities:', error);
        } finally {
            setLoading(false);
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
        // if (!selectedBranch || !product) {
        //     console.error('Please select both branch and product');
        //     setLoading(false);
        //     return;
        // }

        console.log('Branch:', selectedBranch);
        console.log('Product:', selectedProduct);

        const productId = selectedProduct ? selectedProduct.split(' ')[0] : null;

        try {
            const response = await axios.get('http://localhost:8080/product-quantities', {
                params: {
                    branchName: selectedBranch,
                    productId: productId, 
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
            <div className="min-stock-bodycontainer">
                <div className="min-stock-filter-container">
                    <div className="min-stock-content-top">
                        <div className="branchField">
                            <InputLabel htmlFor="branchName" color="#0377A8">Branch</InputLabel>
                            <BranchDropdown
                                id="branchName"
                                name="branchName"
                                editable={true}
                                onChange={(e) => handleDropdownChange(e)}
                                addOptions={["All"]}
                            />
                        </div>
                        <div className="productField">
                            <InputLabel htmlFor="product" color="#0377A8">Product ID / Name</InputLabel>
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
                    <div className="min-stock-BtnSection">
                        <Buttons type="button" id="search-btn" style={{ backgroundColor: "#23A3DA", color: "white" }} onClick={handleSearch}>Search</Buttons>
                        <Buttons type="button" id="clear-btn" style={{ backgroundColor: "white", color: "#EB1313" }} onClick={handleClear}>Clear</Buttons>
                    </div>
                </div>
                <div className="min-stock-content-middle">
                    <TableWithPagi
                        columns={['Branch Name','Product ID', 'Product Name', , 'Available Qty', 'Min Qty']}
                        rows={stockDetails.map(detail => ({
                            'Branch Name': detail.branchName,
                            'Product ID': detail.productId,
                            'Product Name': detail.productName, 
                            'Available Qty': detail.totalAvailableQty, 
                            ' Min Qty': detail.minQty,
                        }))}
                    />
                </div>
            </div>
        </>
    );
};

export default MinimunStock;
