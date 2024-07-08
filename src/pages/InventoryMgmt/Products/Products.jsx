import React, { useState, useEffect, useRef } from 'react';
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
import SubSpinner from '../../../Components/Spinner/SubSpinner/SubSpinner';
import CustomAlert from '../../../Components/Alerts/CustomAlert/CustomAlert';
import BranchDropdown from '../../../Components/InputDropdown/BranchDropdown';
import { getCategories, getCategoryById, deleteCategoryById } from '../../../Api/Inventory/Category/CategoryAPI';
import { getBranchOptions } from '../../../Api/BranchMgmt/BranchAPI';
import { getProductById , getProducts , deleteProductById, getProductBatchDetails, getProductByCategoryId, updateProductDiscount } from '../../../Api/Inventory/Product/ProductAPI';

export const Products = () => {

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
    const branchDropdownRef = useRef(null);

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

 
    const fetchCategorySuggestions = async (query) => {
        try {
            setLoading(true);
            const response = await getCategories();
            return response.data.map(category => ({
                id: category.categoryId,
                displayText: `${category.categoryId} ${category.categoryName}`
            }));
        } catch (error) {
            console.error('Error fetching category suggestions:', error);
            return [];
        } finally {
            setLoading(false);
        }
    };

    
    const handleClearBtnCategorySection = async () => {
        setSelectedAdjustCategory(''); 
        try {
            setLoadingCategories(true);
            const response = await getCategories();
            console.log("data category",response.data);
            if (response.data && response.data) {
                
                setCategoryData(response.data);
                console.log("categoryData1",categoryData);
                setFilteredCategories(response.data);
                console.log("filteredCategories1",filteredCategories);
            } else {
                console.error('Invalid response format:', response);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoadingCategories(false);
        }
       
    };


    const handleClearBtnProductSection = async () => {
        setSelectedProduct('');
        setSelectedCategory('');
        try {
            setLoading(true);
            const response = await getProducts();
            setProductsData(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
        
    };

    const handleClear = () => {
        setSelectedProductData('');
        setBatchDetails([]);
        branchDropdownRef.current.reset();
        
    };

    const handleDropdownChange = (value) => {
        setSelectedBranch(value);
    };


    const handleSearchBtnProductSection = async () => {
        if (selectedProduct) {
            try {
                setLoadingProducts(true);
                const response = await getProductById(selectedProduct.split(' ')[0]);
                if (response.data && response.data) {
                    setProductsData([response.data]);
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
                const response = await getProductByCategoryId(categoryId);
                if (response.data && response.data) {
                    setProductsData(response.data);
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
            const response = await getProductBatchDetails(selectedBranch, product.id);
            setBatchDetails(response.data); 
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
                const response = await getProducts();
                if (response.data && response.data) {
                    setProductsData(response.data);
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

       
    }, []);

    useEffect(() => {
        const fetchCategoryData = async () => {
            try {
                setLoadingCategories(true);
                const response = await getCategories();
                if (response.data && response.data) {
                    setCategoryData(response.data);
                    console.log("categoryData",categoryData);
                    setFilteredCategories(response.data);
                    console.log("filteredCategories",filteredCategories);
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
       
    }, []);

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
            const response = await getCategoryById(categoryId);
            if (response.data && response.data) {
                setSelectedCategoryData(response.data);
            } else {
                console.error('Invalid response format:', response);
            }
        } catch (error) {
            console.error('Error fetching category:', error);
        } finally {
            setLoadingCategories(false);
        }
    };


    const handleDeleteCategory = async (categoryId) => {
        setLoading(true);
        try {
            await deleteCategoryById(categoryId);
            const updatedCategories = categoryData.filter(category => category.categoryId !== categoryId);
            setCategoryData(updatedCategories);
    
            const alertData = {
                severity: 'warning',
                title: 'Delete',
                message: 'Category deleted successfully!',
                duration: 3000
            };
            setAlertConfig(alertData);
            setAlertVisible(true);
        } catch (error) {
            console.error('Error deleting Category:', error);
    
            const alertData = {
                severity: 'error',
                title: 'Error',
                message: 'Failed to delete Category.',
                duration: 3000
            };
            setAlertConfig(alertData);
            setAlertVisible(true);
        } finally {
            setLoading(false);
        }
    };
    
    

    const handleDelete = async (productId) => {
        setLoading(true);
        try {
            await deleteProductById(productId);
            const updatedProductsData = productsData.filter(product => product.productId !== productId);
            setProductsData(updatedProductsData);

            const alertData = {
                severity: 'warning',
                title: 'Delete',
                message: 'Product deleted successfully!',
                duration: 3000
            };
            setAlertConfig(alertData);
            setAlertVisible(true);
        } catch (error) {
            console.error('Error deleting Product:', error);

            const alertData = {
                severity: 'error',
                title: 'Error',
                message: 'Failed to delete Product.',
                duration: 3000
            };
            setAlertConfig(alertData);
            setAlertVisible(true);
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
        setHasChanges(true); 
    };


const handleSave = async () => {
    if (!selectedBranch || !product) {
        console.error('Please select both branch and product');
        return;
    }

    try {
        setLoading(true);
        const updates = batchDetails.map((detail) => ({
            branchName: selectedBranch,
            productId: product.id,
            batchNo: detail.batchNo,
            discount: parseFloat(detail.discount ?? 0), 
        }));
        
        const updateResponse = await updateProductDiscount(updates);

        handleSearch(); 

        
        setAlertConfig({
            severity: 'success',
            title: 'Success',
            message: 'Discounts updated successfully!',
            duration: 3000
        });
        setAlertVisible(true);
    } catch (error) {
        console.error('Error updating discounts:', error);

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
                            <Buttons type="submit" id="clear-btn" style={{ backgroundColor: "white", color: "#EB1313" }} onClick={handleClearBtnCategorySection} >Clear</Buttons>
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
                                            <UpdateCategoryPopup categoryId={selectedCategoryData.categoryId}  />
                                            <DeletePopup handleDelete={() => handleDeleteCategory(selectedCategoryData.categoryId)} />
                                        </div>
                                    )
                                }] : filteredCategories.map(category => ({
                                    'Reg Categories': category.categoryName,
                                    'Action': (
                                        <div style={{ display: "flex", gap: "0.5em" }}>
                                            <UpdateCategoryPopup categoryId={category.categoryId}  />
                                            <DeletePopup handleDelete={() => handleDeleteCategory(category.categoryId)} />
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
                                    <InputLabel htmlFor="branchName" color="#0377A8">Branch<span style={{ color: 'red' }}>*</span></InputLabel>
                                    
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
                                <div className="product-field">
                                    <InputLabel htmlFor="productName" color="#0377A8">Product ID / Name<span style={{ color: 'red' }}>*</span></InputLabel>
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
                           
                          <TableWithPagi rows={tableRows} columns={columns} />    
                            
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
