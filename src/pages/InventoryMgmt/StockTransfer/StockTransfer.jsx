import React, { useState, useEffect } from 'react';
import Layout from "../../../Layout/Layout";
import axios from 'axios';
import "./StockTransfer.css";
import InputField from "../../../Components/InputField/InputField";
import Buttons from '../../../Components/Buttons/SquareButtons/Buttons';
import InputDropdown from "../../../Components/InputDropdown/InputDropdown";
import InputLabel from "../../../Components/Label/InputLabel";
import DatePicker from '../../../Components/DatePicker/DatePicker';
import SearchBar from '../../../Components/SearchBar/SearchBar';
import { useNavigate } from 'react-router-dom';
import BranchDropdown from '../../../Components/InputDropdown/BranchDropdown';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import StockTransferIn from './StockTransferIN';
import StockTransferOUT from './StockTransferOUT';

export const StockTransfer = () => {
    const [clickedLink, setClickedLink] = useState('StockRequest-IN');
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState('');
    const [searchParams, setSearchParams] = useState({
        fromDate: '',
        toDate: '',
        STN_NO: '',
        productId: '',
        requestBranch: '',  // Added requestBranch to searchParams
    });
    const [products, setProducts] = useState([]);

    const navigate = useNavigate();

    const handleLinkClick = (linkText) => {
        setClickedLink(linkText);
    };

    useEffect(() => {
        fetchBranches();
        fetchProducts();
    }, []);

    const fetchBranches = async () => {
        try {
            const response = await axios.get('http://localhost:8080/branchesWeb');
            setBranches(response.data);
        } catch (error) {
            console.error('Error fetching branches:', error);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:8080/products');
            setProducts(response.data.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleDropdownChange = (value) => {
        setSearchParams(prevState => ({
            ...prevState,
            requestBranch: value
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleDateChange = (name, date) => {
        setSearchParams(prevState => ({
            ...prevState,
            [name]: date
        }));
    };

    const handleClear = () => {
        setSearchParams({
            STN_NO: '',
            fromDate: '',
            toDate: '',
            productId: '',
            requestBranch: '',
        });
        setSelectedBranch('');
    };

    const handleNewButtonClick = () => {
        navigate('/stock-transfer/new');
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
            console.error('Error fetching product suggestions:', error);
            return [];
        }
    };

    const handleSearch = () => {
        setClickedLink('StockRequest-IN');
    };

    return (
        <>
            <div className="top-nav-blue-text">
                <h4>Stock Transfer</h4>
            </div>
            <Layout>
                <div className="stockTransfer-bodycontainer">
                    <div className="stockTransfer-filter-container">
                        <div className="stockTransfer-content-top1">
                            <div className="datePickerFrom">
                                <InputLabel htmlFor="From" color="#0377A8">From</InputLabel>
                                <DatePicker id="dateFrom" name="fromDate" onDateChange={(date) => handleDateChange('fromDate', date)} />
                            </div>
                            <div className="datePickerTo">
                                <InputLabel htmlFor="To" color="#0377A8">To</InputLabel>
                                <DatePicker id="dateTo" name="toDate" onDateChange={(date) => handleDateChange('toDate', date)} />
                            </div>
                            <div className="SupplyingbranchField">
                                <InputLabel htmlFor="branchName" color="#0377A8">Request Branch</InputLabel>
                                <BranchDropdown
                                    id="branchName"
                                    name="branchName"
                                    editable={true}
                                    options={branches.map(branch => branch.branchName)}
                                    onChange={handleDropdownChange}
                                />
                            </div>
                            <div className="RequestbranchField">
                                <InputLabel htmlFor="branchName" color="#0377A8">Supplying Branch</InputLabel>
                                <InputDropdown
                                    id="branchName"
                                    name="branchName"
                                    editable={true}
                                    options={branches.map(branch => branch.branchName)}
                                    value={selectedBranch}
                                    onChange={handleDropdownChange}
                                />
                            </div>
                            <div className="STNNoField">
                                <InputLabel htmlFor="STN_NO" color="#0377A8">STN No</InputLabel>
                                <InputField type="text" id="STN_NO" name="STN_NO" value={searchParams.STN_NO} onChange={handleInputChange} editable={true} width="250px" />
                            </div>
                        </div>
                        <div className="stockTransfer-content-top2">
                            <div className="productsField">
                                <InputLabel htmlFor="productId" color="#0377A8">Product ID / Name</InputLabel>
                                <SearchBar
                                    searchTerm={searchParams.productId}
                                    setSearchTerm={value => setSearchParams(prevState => ({ ...prevState, productId: value }))}
                                    onSelectSuggestion={suggestion => setSearchParams(prevState => ({ ...prevState, productId: `${suggestion.displayText}` }))}
                                    fetchSuggestions={fetchProductsSuggestions}
                                />
                            </div>
                        </div>
                        <div className="stockTransfer-BtnSection">
                            <Buttons type="button" id="search-btn" style={{ backgroundColor: "#23A3DA", color: "white" }} onClick={handleSearch}> Search </Buttons>
                            <Buttons type="button" id="clear-btn" style={{ backgroundColor: "white", color: "#EB1313" }} onClick={handleClear}> Clear </Buttons>
                            <Buttons type="button" id="new-btn" style={{ backgroundColor: "white", color: "#23A3DA" }} onClick={handleNewButtonClick}> New + </Buttons>
                        </div>
                    </div>
                </div>
                <Tabs className="stockTransferTabs" selectedIndex={clickedLink === 'StockRequest-IN' ? 0 : 1} onSelect={(index) => setClickedLink(index === 0 ? 'StockRequest-IN' : 'StockRequest-OUT')}>
                    <TabList className="transferStatusTab">
                        <Tab>Stock Request In</Tab>
                        <Tab>Stock Request OUT</Tab>
                    </TabList>
                    <TabPanel>
                        {clickedLink === 'StockRequest-IN' && <StockTransferIn searchParams={searchParams} />}
                    </TabPanel>
                    <TabPanel>
                        {clickedLink === 'StockRequest-OUT' && <StockTransferOUT searchParams={searchParams} />}
                    </TabPanel>
                </Tabs>
            </Layout>
        </>
    );
};

export default StockTransfer;
