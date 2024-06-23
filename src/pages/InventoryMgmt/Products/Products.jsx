import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from "../../../Layout/Layout";
import "./Products.css";
import TableWithPagi from '../../../Components/Tables/TableWithPagi';
import Buttons from '../../../Components/Buttons/SquareButtons/Buttons';
import InputLabel from "../../../Components/Label/InputLabel";
import DeletePopup from "../../../Components/PopupsWindows/DeletePopup";
import SearchBar from '../../../Components/SearchBar/SearchBar';
import AddNewProductPopup from './AddNewProductPopup';
import AddNewCategoryPopup from './AddNewCategoryPopup';
import UpdateProductPopup from './UpdateProductPopup';
import UpdateCategoryPopup from './UpdateCategoryPopup';
import { Icon } from "@iconify/react";
import SubSpinner from '../../../Components/Spinner/SubSpinner/SubSpinner';
import CustomAlert from '../../../Components/Alerts/CustomAlert/CustomAlert';
import BranchDropdown from '../../../Components/InputDropdown/BranchDropdown';

export const Products = () => {
    const navigate = useNavigate();

    const [productsData, setProductsData] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    const [categoryData, setCategoryData] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [selectedAdjustCategory, setSelectedAdjustCategory] = useState('');
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [selectedCategoryData, setSelectedCategoryData] = useState(null);
   

    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState('');
    const [batchDetails, setBatchDetails] = useState([]);
    const [product, setProduct] = useState(null);
    const [selectedProductData, setSelectedProductData] = useState('');

    const [alertVisible, setAlertVisible] = useState(false);
    const [alertConfig, setAlertConfig] = useState({});
    const [loading, setLoading] = useState(true);
    const [hasChanges, setHasChanges] = useState(false);

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

    const fetchCategorySuggestions = async (query) => {
        try {
            const response = await axios.get(`http://localhost:8080/categories?search=${query}`);
            if (response.data && response.data.data) {
                return response.data.data.map(category => ({
                    id: category.categoryId,
                    displayText: `${category.categoryId} ${category.categoryName}`
                }));
            }
            return [];
        } catch (error) {
            console.error('Error fetching category:', error);
            return [];
        }
    };

    const handleClearBtnProductSection = () => {
        setSelectedProduct('');
        setSelectedCategory('');
        window.location.reload();
    };

    const handleClear = () => {
        setSelectedBranch('');
        setProduct(null);
        setSelectedProduct('');
        setBatchDetails([]);
        window.location.reload();
    };

    const handleDropdownChange = (value) => {
        setSelectedBranch(value);
        console.log('Selected Drop Down Value:', value);
    };


    const handleSearchBtnProductSection = async () => {
        if (selectedProduct) {
            try {
                setLoadingProducts(true);
                const response = await axios.get(`http://localhost:8080/products/${selectedProduct.split(' ')[0]}`);
                if (response.data && response.data.data) {
                    setProductsData([response.data.data]);
                } else {
                    console.error('Invalid response format:', response);
                }
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoadingProducts(false);
            }
        } else if (selectedCategory) {
            try {
                setLoadingProducts(true);
                const categoryId = selectedCategory.split(' ')[0];
                const response = await axios.get(`http://localhost:8080/products-category?categoryId=${categoryId}`);
                if (response.data && response.data.data) {
                    setProductsData(response.data.data);
                } else {
                    console.error('Invalid response format:', response);
                }
            } catch (error) {
                console.error('Error fetching products by category:', error);
            } finally {
                setLoadingProducts(false);
            }
        }
    };

    const handleSearch = async () => {
        if (!selectedBranch || !product) {
            console.error('Please select both branch and product');
            return;
        }

        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:8080/product-batch-details`, {
                params: {
                    branchName: selectedBranch,
                    productId: product.id, // Send product ID
                }
            });
            setBatchDetails(response.data.data); // Assuming the batch details are in response.data.data
            setLoading(false);
        } catch (error) {
            console.error('Error fetching batch details:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchProductsData = async () => {
            try {
                setLoadingProducts(true);
                const response = await axios.get(`http://localhost:8080/products`);
                if (response.data && response.data.data) {
                    setProductsData(response.data.data);
                } else {
                    console.error('Invalid response format:', response);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoadingProducts(false);
            }
        };

        fetchProductsData();

        const storedAlertConfig = localStorage.getItem('alertConfig');
        if (storedAlertConfig) {
            setAlertConfig(JSON.parse(storedAlertConfig));
            setAlertVisible(true);
            localStorage.removeItem('alertConfig');
        }
    }, []);

    useEffect(() => {
        const fetchCategoryData = async () => {
            try {
                setLoadingCategories(true);
                const response = await axios.get(`http://localhost:8080/categories`);
                if (response.data && response.data.data) {
                    setCategoryData(response.data.data);
                    setFilteredCategories(response.data.data);
                } else {
                    console.error('Invalid response format:', response);
                }
            } catch (error) {
                console.error('Error fetching category:', error);
            } finally {
                setLoadingCategories(false);
            }
        };

        fetchCategoryData();

        const storedAlertConfig = localStorage.getItem('alertConfig');
        if (storedAlertConfig) {
            setAlertConfig(JSON.parse(storedAlertConfig));
            setAlertVisible(true);
            localStorage.removeItem('alertConfig');
        }
    }, []);

    useEffect(() => {
        fetchBranches();
    }, []);

    const fetchBranches = async () => {
        try {
            const response = await axios.get('http://localhost:8080/branchesWeb');
            setBranches(response.data);
        } catch (error) {
            console.error('Error fetching branches:', error);
        }
    };

    useEffect(() => {
        if (Array.isArray(categoryData)) {
            const filtered = categoryData.filter(category =>
                category.categoryName.toLowerCase().includes(selectedAdjustCategory.toLowerCase())
            );
            setFilteredCategories(filtered);
        }
    }, [selectedAdjustCategory, categoryData]);

    const handleCategorySelect = async (categoryId) => {
        try {
            setLoadingCategories(true);
            const response = await axios.get(`http://localhost:8080/categories/${categoryId}`);
            if (response.data && response.data.data) {
                setSelectedCategoryData(response.data.data);
            } else {
                console.error('Invalid response format:', response);
            }
        } catch (error) {
            console.error('Error fetching category:', error);
        } finally {
            setLoadingCategories(false);
        }
    };

    const handleDelete = async (productId) => {
        setLoading(true);
        try {
            await axios.delete(`http://localhost:8080/products/${productId}`);
            const updatedProductsData = productsData.filter(product => product.productId !== productId);
            setProductsData(updatedProductsData);
            console.log("Product deleted successfully");

            const alertData = {
                severity: 'warning',
                title: 'Delete',
                message: 'Product deleted successfully!',
                duration: 3000
            };
            localStorage.setItem('alertConfig', JSON.stringify(alertData));
            navigate('/products');
            window.location.reload();
        } catch (error) {
            console.error('Error deleting Product:', error);

            const alertData = {
                severity: 'error',
                title: 'Error',
                message: 'Failed to delete Product.',
                duration: 3000
            };
            localStorage.setItem('alertConfig', JSON.stringify(alertData));
            navigate('/products');
            window.location.reload();
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (datetime) => {
        const date = new Date(datetime);
        return date.toISOString().split('T')[0];
    };


    const columns = [
        "Branch Name",
        "Batch No",
        "Exp Date",
        "Available Qty",
        "Selling Price",
        "Discount",
        
    ];

    const tableRows = batchDetails.map((detail, index) => ({
        branchName: detail.branchName,
        batchNo: detail.batchNo,
        expDate: formatDate(detail.expDate),
        availableQty: detail.availableQty,
        sellingPrice: detail.sellingPrice,
        discount: (
            <input
                className="data-box-table"
                type="number"
                value={detail.discount ?? ""}
                onChange={(e) => handleDiscountChange(index, e.target.value)}
            />
        ),
    }));
    

    const handleDiscountChange = (index, newValue) => {
        const updatedBatchDetails = [...batchDetails];
        updatedBatchDetails[index].discount = newValue;
        setBatchDetails(updatedBatchDetails);
        setHasChanges(true); // Set hasChanges to true when a change is made
    };


const handleSave = async () => {
    if (!selectedBranch || !product) {
        console.error('Please select both branch and product');
        return;
    }

    try {
        setLoading(true);
        // Collect discounts and prepare for backend update
        const updates = batchDetails.map((detail) => ({
            branchName: selectedBranch,
            productId: product.id,
            batchNo: detail.batchNo,
            discount: parseFloat(detail.discount ?? 0), // Default to 0 if null
        }));
        console.log(updates);
        // Send updates to backend
        const updateResponse = await axios.put('http://localhost:8080/product-batch-sum-discount', { updates });
        console.log(updateResponse.data); // Logging backend response

        // Assuming you want to refresh the data after saving
        handleSearch(); // Refresh the batch details after saving

        // Show success message
        setAlertConfig({
            severity: 'success',
            title: 'Success',
            message: 'Discounts updated successfully!',
            duration: 3000
        });
        setAlertVisible(true);
    } catch (error) {
        console.error('Error updating discounts:', error);

        // Show error message
        setAlertConfig({
            severity: 'error',
            title: 'Error',
            message: 'Failed to update discounts.',
            duration: 3000
        });
        setAlertVisible(true);
    } finally {
        setLoading(false);
    }
};

      
    
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

            <div className="create-product-category-section">
                    <div className="category-filter-container">
                        <h3 className="create-product-category-title">Registered Categories</h3>
                        <div className="create-product-category-top">
                            <div className="categoryField">
                                <InputLabel htmlFor="category" color="#0377A8">Search Category ID / Name</InputLabel>
                                <SearchBar
                                    searchTerm={selectedAdjustCategory}
                                    setSearchTerm={setSelectedAdjustCategory}
                                    onSelectSuggestion={(suggestion) => {
                                        setSelectedAdjustCategory(`${suggestion.displayText}`);
                                        handleCategorySelect(suggestion.id);
                                    }}
                                    fetchSuggestions={fetchCategorySuggestions}
                                />
                            </div>
                        </div>
                        <div className='p-BtnSection'>
                            <Buttons type="submit" id="clear-btn" style={{ backgroundColor: "white", color: "#EB1313" }} >Clear</Buttons>
                            <AddNewCategoryPopup />
                        </div>
                    </div>

                    <div className="create-product-category-middle">
                        {loadingCategories ? (
                            <div><SubSpinner /></div>
                        ) : (
                            <TableWithPagi
                                columns={['Reg Categories', 'Action']}
                                rows={selectedCategoryData ? [{
                                    'Reg Categories': selectedCategoryData.categoryName,
                                    'Action': (
                                        <div style={{ display: "flex", gap: "0.5em" }}>
                                            <Icon icon="bitcoin-icons:edit-outline" style={{ fontSize: '24px' }} />
                                            
                                            <DeletePopup />
                                        </div>
                                    )
                                }] : filteredCategories.map(category => ({
                                    'Reg Categories': category.categoryName,
                                    'Action': (
                                        <div style={{ display: "flex", gap: "0.5em" }}>
                                            <UpdateCategoryPopup categoryId={category.categoryId}  />
                                            <DeletePopup />
                                        </div>
                                    )
                                }))}
                            />
                        )}
                    </div>
                </div>
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
                            <Buttons type="submit" id="search-btn" style={{ backgroundColor: "#23A3DA", color: "white" }} onClick={handleSearchBtnProductSection}>Search</Buttons>
                            <Buttons type="submit" id="clear-btn" style={{ backgroundColor: "white", color: "#EB1313" }} onClick={handleClearBtnProductSection}>Clear</Buttons>
                            <AddNewProductPopup />
                        </div>
                    </div>
                    <div className="product-content-middle">
                        {loadingProducts ? (
                            <div><SubSpinner /></div>
                        ) : (
                            <TableWithPagi
                                columns={['Product ID', 'Product Name', 'Barcode', 'Product Category', 'Description', 'Action']}
                                rows={Array.isArray(productsData) ? productsData.map(product => ({
                                    'Product ID': product.productId,
                                    'Product Name': product.productName,
                                    'Barcode': product.barcode,
                                    'Product Category': product.categoryName,
                                    'Description': product.description,
                                    'Actions': (
                                        <div style={{ display: "flex", gap: "0.5em" }}>
                                            <UpdateProductPopup productId={product.productId} />
                                            <DeletePopup handleDelete={() => handleDelete(product.productId)} />
                                        </div>
                                    )
                                })) : []}
                            />
                        )}
                    </div>
                </div>

                
              <div className="product-discount-section">
                    <div className="discount-filter-container">
                         <h3 className="product-discount-title">Registered Product's Discount</h3>
                            <div className="discount-content-top">
                                <div className="branch-field">
                                    <InputLabel htmlFor="branchName" color="#0377A8">Branch</InputLabel>
                                    
                                    <BranchDropdown
                                        id="branchName"
                                        name="branchName"
                                        editable={true}
                                        onChange={(e) => handleDropdownChange(e)}
                                        addOptions={["All"]}
                                        />
                                </div>
                                <div className="product-field">
                                    <InputLabel htmlFor="productName" color="#0377A8">Product ID / Name</InputLabel>
                                    <SearchBar
                                        searchTerm={selectedProductData} 
                                        setSearchTerm={setSelectedProductData}
                                        onSelectSuggestion={(suggestion) => {
                                            setSelectedProductData(`${suggestion.displayText}`);
                                            setProduct(suggestion); 
                                        }}
                                        fetchSuggestions={fetchProductsSuggestions}
                                    />
                                </div>
                            </div>
                            <div className="discount-btn-section">
                                <Buttons type="button" id="search-btn" style={{ backgroundColor: "#23A3DA", color: "white" }} onClick={handleSearch}>Search</Buttons>
                               
                                <Buttons type="button" id="clear-btn" style={{ backgroundColor: "white", color: "#EB1313" }} onClick={handleClear}>Clear</Buttons>
                            </div>
                        </div>
                        <div className="discount-content-middle">
                            {loading ? (
                                <div><SubSpinner /></div>
                            ) : (
                                <TableWithPagi rows={tableRows} columns={columns} />
                                    
                                       
                                  
                            )}
                        <div className="discount-btn-section">
                            {hasChanges && (
                                <Buttons type="button" id="save-btn" style={{ backgroundColor: "#23A3DA", color: "white" }} onClick={handleSave}>
                                    Save
                                </Buttons>
                            )}
                    </div>
                    </div>
                    
                </div> 
                 
            </Layout>
        </>
    );
};

export default Products;
