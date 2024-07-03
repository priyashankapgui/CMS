import React, { useState, useEffect, useRef } from 'react';
import "./MinimumStock.css";
import InputLabel from "../../../Components/Label/InputLabel";
import Buttons from '../../../Components/Buttons/SquareButtons/Buttons';
import TableWithPagi from '../../../Components/Tables/TableWithPagi';
import SearchBar from "../../../Components/SearchBar/SearchBar";
import BranchDropdown from '../../../Components/InputDropdown/BranchDropdown';
import secureLocalStorage from "react-secure-storage";
import { getBranchOptions } from '../../../Api/BranchMgmt/BranchAPI';
import { getProducts } from '../../../Api/Inventory/Product/ProductAPI';
import { getProductMinQty } from '../../../Api/Inventory/StockBalance/StockBalanceAPI';

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
    const branchDropdownRef = useRef(null);

    useEffect(() => {
        fetchBranches();
        fetchAllProducts();
        fetchProductQuantities(); 
    }, []);

    const fetchBranches = async () => {
        try {
            const response = await getBranchOptions();
            setBranches(response.data);
        } catch (error) {
            console.error('Error fetching branches:', error);
        }
    };

    const fetchAllProducts = async () => {
        try {
            const response = await getProducts();
            setProducts(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching all products:', error);
            setLoading(false);
        }
    };

    const fetchProductsSuggestions = async (query) => {
        try {
            const response = await getProducts();
            if (response.data && response.data) {
                return response.data.map(product => ({
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
        try {
            const userJSON = secureLocalStorage.getItem("user");
            if (userJSON) {
                const user = JSON.parse(userJSON);
                console.log("user role",user.role);
                console.log("user branch",user.branchName);
                const response = await getProductMinQty();
                let data = response.data || [];
                
                if (user.role !== 'Super Admin') {
                    data = data.filter(item => item.branchName === user.branchName);
                }
                setStockDetails(data);
            } else {
                console.error('User details not found in secure storage');
            }
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

        console.log('Branch:', selectedBranch);
        console.log('Product:', selectedProduct);

        const productId = selectedProduct ? selectedProduct.split(' ')[0] : null;

        try {
            const response = await getProductMinQty(selectedBranch, productId);

            const data = response.data;
            setStockDetails(Array.isArray(data) ? data : [data]);
        } catch (error) {
            console.error('Error fetching stock details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClear = async () => {
        setSelectedBranch('');
        setProduct(null);
        setSelectedProduct('');
        setBatchNo('');
        setCategory(null);
        branchDropdownRef.current.reset();
        try {
            setLoading(true);
            const response = await getProductMinQty();
            setStockDetails(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
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
                                value={selectedBranch}
                                ref={branchDropdownRef}
                            />
                        </div>
                        <div className="productField">
                            <InputLabel htmlFor="product" color="#0377A8">Product ID / Name</InputLabel>
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
                    <div className="min-stock-BtnSection">
                        <Buttons type="button" id="search-btn" style={{ backgroundColor: "#23A3DA", color: "white" }} onClick={handleSearch}>Search</Buttons>
                        <Buttons type="button" id="clear-btn" style={{ backgroundColor: "white", color: "#EB1313" }} onClick={handleClear}>Clear</Buttons>
                    </div>
                </div>
                <div className="min-stock-content-middle">
                    <TableWithPagi
                        columns={['Branch Name', 'Product ID', 'Product Name', , 'Available Qty', 'Min Qty']}
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
