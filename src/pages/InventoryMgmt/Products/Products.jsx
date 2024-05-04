import React, { useState, useEffect }  from 'react';
import axios from 'axios';
import Layout from "../../../Layout/Layout";
import "./Products.css";
import InputField from "../../../Components/InputField/InputField";
import TableWithPagi from '../../../Components/Tables/TableWithPagi';
import Buttons from '../../../Components/Buttons/SquareButtons/Buttons';
import InputLabel from "../../../Components/Label/InputLabel";
import InputDropdown from "../../../Components/InputDropdown/InputDropdown";
import dropdownOptions from '../../../Components/Data.json';
//import jsonData from "../../../Components/Data.json";
import DeletePopup from "../../../Components/PopupsWindows/DeletePopup";
import { CiSearch } from "react-icons/ci";
import { Icon } from "@iconify/react";
import AddNewProductPopup from "./AddNewProductPopup";
import UpdateProductPopup from "./UpdateProductPopup";


export const Products = () => {
    // const [productsData, setProductsData] = useState([]);
    // const [searchProductId, setSearchProductId] = useState('');

   
    //     // Fetch products data when the component mounts
       
    // const fetchProducts = async () => {
    //     try {
    //         let endpoint = 'http://localhost:8080/products/${searchProductId}';
    //         const response = await axios.get(endpoint);
    //         setProductsData(response.data);
    //     } catch (error) {
    //         console.error('Error fetching products:', error);
    //     }
    //         // if (searchProductId) {
    //         //     endpoint += `?search=${encodeURIComponent(searchProductId)}`;


    //         // }
           
    //         //const response = await axios.get('http://localhost:8080/products/:productId'); // Make a GET request to your backend endpoint
        
    // };

    // useEffect(() => {
    //     // Fetch products data when the component mounts
    //     fetchProducts();
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [searchProductId]);

    // const handleSearch = () => {
    //     fetchProducts();
    // };

    
    
    // axios.get("http://localhost:8080/categories", {
    //     params: {
    //         Reg_Categories: "your_value_here"
    //     }
    // })
    // .then(response => {
    //     // Handle the response here
    // })
    // .catch(error => {
    //     // Handle errors here
    // });
    // const [productsData, setProductsData] = useState([]);


    // useEffect(() => {
    //     const fetchProductsData = async () => {
    //         try {
    //             const response = await axios.get("http://localhost:8080/products");
    //             setProductsData(response.data); // Set the fetched category names
    //         } catch (error) {
    //             console.error('Error fetching products:', error);
    //         }
    //     };

    //     fetchProductsData();
    // }, []);
    
    const [productsData, setProductsData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchProductsData(searchQuery);
    }, [searchQuery]);

    const fetchProductsData = async (searchQuery) => {
        try {
            let endpoint = `http://localhost:8080/products/${searchQuery}`;
            const response = await axios.get(endpoint);
            setProductsData(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleInputChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleSearch = () => {
        fetchProductsData(searchQuery);
    };




    const [categoryNames, setCategoryNames] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:8080/categories");
                setCategoryNames(response.data); // Set the fetched category names
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <>
            <div className="top-nav-blue-text">
                <h4>Products</h4>
            </div>
            <Layout>
                <div className="reg-product-bodycontainer">
                    <div className="product-filter-container">
                        <h3 className="reg-product-title">Registered Products</h3>
                        <div className="product-content-top">
                            <div className="branchField">
                                <InputLabel for="branchName" color="#0377A8">Branch</InputLabel>
                                <InputDropdown id="branchName" name="branchName" editable={true} options={dropdownOptions.dropDownOptions.branchOptions} />
                            </div>
                            <div className="categoryField">
                                <InputLabel htmlFor="category" color="#0377A8">Category</InputLabel>
                                <InputField type="text" id="category" name="category" editable={true} width="250px" />
                            </div>
                            <div className="productField">
                                <InputLabel htmlFor="product" color="#0377A8">Product ID / Name</InputLabel>
                                <InputField type="text" id="searchQuery" name="searchQuery" editable={true} onChange={handleInputChange} value={searchQuery} />
                            </div>
                        </div>
                        <div className="p-BtnSection">
                            <Buttons type="submit" id="search-btn" style={{ backgroundColor: "#23A3DA", color: "white" }} onClick={handleSearch}> Search </Buttons>
                            <Buttons type="submit" id="clear-btn" style={{ backgroundColor: "white", color: "#EB1313" }}> Clear </Buttons>
                            {/* <Buttons type="submit" id="new-btn" style={{ backgroundColor: "white", color: "#23A3DA" }}> New + </Buttons> */}
                            <AddNewProductPopup />
                        </div>
                    </div>
                    <div className="product-content-middle">
                     
                            <TableWithPagi
                                columns={[ 'Product ID', 'Product Name', 'Product Category', 'Description' , 'Action' ]}
                                rows={productsData.map(product => ({
                                    
                                    'Product ID': product.productId,
                                    'Product Name': product.productName,
                                    'Product Category': product.category?.categoryName,
                                    'Description': product.description,
                                    'Actions': (
                                        <div style={{ display: "flex", gap: "0.5em" }}>
                                            {/* <Icon icon="bitcoin-icons:edit-outline"
                                                style={{ fontSize: '24px' }} /> */}
                                            <UpdateProductPopup/>
                                            <DeletePopup />
                                        </div>
                                    )
                                }))}
                            />
                        
                    </div>
                </div>
                <div className="create-product-category-section">
                    <div className="category-filter-container">
                        <h3 className="create-product-category-title">Adjust Product's Category</h3>
                        <div className="create-product-category-top">
                            <div className="branchField">
                                <InputLabel for="branchName" color="#0377A8">Branch</InputLabel>
                                <InputDropdown id="branchName" name="branchName" editable={true} options={dropdownOptions.dropDownOptions.branchOptions} />
                            </div>
                            <div className="categoryField">
                                <InputLabel htmlFor="category" color="#0377A8">Category</InputLabel>
                                <InputField type="text" id="category" name="category" editable={true} width="250px" />
                            </div>
                        </div>
                        <Buttons type="submit" id="search-btn" style={{ backgroundColor: "#23A3DA", color: "white" }}> Search </Buttons>
                    </div>

                    <div className="create-product-category-middle">
                        
                            <TableWithPagi
                            columns={['Reg Categories', 'Action']}
                            rows={categoryNames.map(category => ({
                                'Reg Categories': category.categoryName,
                                'Action': (
                                    <div style={{ display: "flex", gap: "0.5em" }}>
                                    <Icon icon="bitcoin-icons:edit-outline"
                                        style={{ fontSize: '24px' }} />
                                    <DeletePopup />
                                </div>
                                )
                            }))}
                            />
                        
                    </div>
                </div>
                <div className="adjust-product-price-section">
                    <div className="adjust-product-price-filter-container">
                        <h3 className="adjust-product-price-title">Adjust Product's Price</h3>
                        <div className="adjust-product-price-top">
                            <div className="branchField">
                                <InputLabel for="branchName" color="#0377A8">Branch</InputLabel>
                                <InputDropdown id="branchName" name="branchName" editable={true} options={dropdownOptions.dropDownOptions.branchOptions} />
                            </div>
                            <div className="productField">
                                <InputLabel htmlFor="product" color="#0377A8">Product ID / Name</InputLabel>
                                <InputField type="text" id="billNo" name="billNo" editable={true} ><CiSearch /></InputField>
                            </div>
                        </div>
                        <Buttons type="submit" id="search-btn" style={{ backgroundColor: "#23A3DA", color: "white" }}> Search </Buttons>
                    </div>

                    <div className="adjust-product-price-middle">
                        <div className="batchNoField">
                            <InputLabel for="batchNo" color="#0377A8">Batch No</InputLabel>
                            <InputDropdown id="batchNo" name="batchNo" editable={true} options={['']} />
                        </div>
                        <div className="unitPriceField">
                            <InputLabel htmlFor="unitPrice" color="#0377A8">Unit Price</InputLabel>
                            <InputField type="text" id="unitPrice" name="unitPrice" editable={true} width="150px" />
                        </div>
                        <Buttons type="submit" id="update-btn" style={{ backgroundColor: "#23A3DA", color: "white" }} margintop="1.563em"> Update </Buttons>
                    </div>
                </div>


            </Layout>
        </>

    );
   

};
