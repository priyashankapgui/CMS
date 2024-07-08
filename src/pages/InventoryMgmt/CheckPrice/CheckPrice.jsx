import React, { useState, useEffect, useRef } from 'react';
import Layout from "../../../Layout/Layout";
import "./CheckPrice.css";
import InputLabel from "../../../Components/Label/InputLabel";
import Buttons from '../../../Components/Buttons/SquareButtons/Buttons';
import TableWithPagi from '../../../Components/Tables/TableWithPagi';
import SearchBar from "../../../Components/SearchBar/SearchBar";
import SubSpinner from '../../../Components/Spinner/SubSpinner/SubSpinner';
import BranchDropdown from '../../../Components/InputDropdown/BranchDropdown';
import { getBranchOptions } from '../../../Api/BranchMgmt/BranchAPI';
import { getProducts, getProductBatchDetails } from '../../../Api/Inventory/Product/ProductAPI';

export const CheckPrice = () => {
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState('');
    const [product, setProduct] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [batchDetails, setBatchDetails] = useState([]);
    const [loading, setLoading] = useState(false);
    const branchDropdownRef = useRef(null);

    useEffect(() => {
        fetchBranches();
    }, []);

    const fetchBranches = async () => {
        try {
            const response = await getBranchOptions();
            setBranches(response.data);
        } catch (error) {
            console.error('Error fetching branches:', error);
        }
    };

    const handleDropdownChange = (value) => {
        setSelectedBranch(value);
    };

    const fetchProductsSuggestions = async (query) => {
        try {
            const response = await getProducts();
            if (response.data) {
                return response.data
                    .filter(product => 
                        product.productName.toLowerCase().includes(query.toLowerCase()) || 
                        product.productId.toLowerCase().includes(query.toLowerCase())
                    )
                    .map(product => ({
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
            const response = await getProductBatchDetails(selectedBranch, product.id);
            setBatchDetails(response.data); 
            setLoading(false);
        } catch (error) {
            console.error('Error fetching batch details:', error);
            setLoading(false);
        }
    };

    const formatDate = (datetime) => {
        const date = new Date(datetime);
        return date.toISOString().split('T')[0];
    };

    const handleClear = () => {
        setSelectedBranch('');
        setProduct(null);
        setSelectedProduct('');
        setBatchDetails([]);
        branchDropdownRef.current.reset();
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
                                <InputLabel htmlFor="branchName" color="#0377A8">Branch<span style={{ color: 'red' }}>*</span></InputLabel>
                                <BranchDropdown
                                    id="branchName"
                                    name="branchName"
                                    editable={true}
                                    onChange={(e) => handleDropdownChange(e)}
                                    value={selectedBranch}
                                    ref={branchDropdownRef}
                                />
                            </div>
                            <div className="product-field">
                                <InputLabel htmlFor="productName" color="#0377A8">Product ID / Name</InputLabel>
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
                                    'Exp Date': formatDate(detail.expDate),
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
