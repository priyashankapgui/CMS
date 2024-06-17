import React, { useState, useEffect } from 'react';
import Layout from "../../../Layout/Layout";
import axios from 'axios';
import "./StockTransfer.css";
import InputField from "../../../Components/InputField/InputField";
import TableWithPagi from '../../../Components/Tables/TableWithPagi';
import Buttons from '../../../Components/Buttons/SquareButtons/Buttons';
import InputDropdown from "../../../Components/InputDropdown/InputDropdown";
import InputLabel from "../../../Components/Label/InputLabel";
import RoundButtons from '../../../Components/Buttons/RoundButtons/RoundButtons';
import DatePicker from '../../../Components/DatePicker/DatePicker';
import SearchBar from '../../../Components/SearchBar/SearchBar';
import { useNavigate } from 'react-router-dom';
import { BsEye } from "react-icons/bs";
import { RiPrinterFill } from "react-icons/ri";
import { Link } from 'react-router-dom';
import SubSpinner from '../../../Components/Spinner/SubSpinner/SubSpinner';
import BranchDropdown from '../../../Components/InputDropdown/BranchDropdown';
import StockTransferIssuing from './StockTransferIssuing';
import Completed from './completed';
import { TiTickOutline } from "react-icons/ti";
import { MdOutlineCancel } from "react-icons/md";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';


export const StockTransfer = () => {
    const [clickedLink, setClickedLink] = useState('StockRequest-IN');
    const [stockData, setStockData] = useState([]);
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState('');
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useState({
        fromDate: '',
        toDate: '',
        STNNo: '',
        productId: '',
    });
    const [products, setProducts] = useState([]);

    const navigate = useNavigate();

    const handleLinkClick = (linkText) => {
        setClickedLink(linkText);
    };

    useEffect(() => {
        fetchStockData();
        fetchBranches();
        fetchProducts();
    }, []);

    const fetchStockData = async () => {
        const user = JSON.parse(sessionStorage.getItem("user"));
        console.log("name", user);
    
        if (!user) {
            console.error('User is not available');
            setLoading(false);
            return;
        }
        console.log("useranee", user.role);
    
        try {
            let response;
            if (user.role === 'superadmin') {
                response = await axios.get('http://localhost:8080/allTransfers');
            } else if (user.branchName) {
                response = await axios.get(`http://localhost:8080/stock-transfer/supplying-branch/${user.branchName}`);
            } else {
                console.error('Branch name is not available for the user');
                setLoading(false);
                return;
            }
            setStockData(response.data?.data || []);
        } catch (error) {
            console.error('Error fetching Stock transfer data:', error);
        } finally {
            setLoading(false);
        }
       
    };

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
        setSelectedBranch(value);
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

    const handleSearch = async () => {
        try {
            setLoading(true);

            const params = {
                fromDate: searchParams.fromDate,
                toDate: searchParams.toDate,
                STNNo: searchParams.STNNo,
                productId: searchParams.productId.split(' ')[0], 
                supplyingBranch: selectedBranch
            };

            let response;
            if (selectedBranch) {
                response = await axios.get(`http://localhost:8080/stock-transfer/supplying-branch/${selectedBranch}`, { params });
            } else if (searchParams.STNNo) {
                response = await axios.get(`http://localhost:8080/stock-transferAllDetails/${searchParams.STNNo}`, { params });
            } else if (searchParams.productId) {
                response = await axios.get(`http://localhost:8080/stock-transfers-by-productId/${searchParams.productId.split(' ')[0]}`, { params });
            } else if (searchParams.requestBranch) {
                response = await axios.get(`http://localhost:8080/stock-transfer/request-branch/${searchParams.requestBranch}`, { params });
            } else {
                response = await axios.get(`http://localhost:8080/stock-transfer/supplying-branch/${selectedBranch}`, { params });
            }

            setStockData(response.data?.data || []);
        } catch (error) {
            console.error('Error searching:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setSearchParams({
            STNNo: '',
            fromDate: '',
            toDate: '',
            productId: '',
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
                                <InputLabel htmlFor="STNNo" color="#0377A8">STN No</InputLabel>
                                <InputField type="text" id="STNNo" name="STNNo" value={searchParams.STNNo} onChange={handleInputChange} editable={true} width="250px" />
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
                    
                    <div className="stockTransfer-content-middle">
                        <div className="linkActions-">
                            <div className={clickedLink === 'StockRequest-IN' ? 'clicked' : ''}>
                                <Link to="/stock-transfer" onClick={() => handleLinkClick('StockRequest-IN')}>
                                    Stock Request-IN
                                </Link>
                            </div>
                            <div className={clickedLink === 'StockRequest - OUT' ? 'clicked' : ''}>
                                <Link to="/stock-transfer/OUT" onClick={() => handleLinkClick('StockRequest - OUT')}>
                                    Stock Request - OUT
                                </Link>
                            </div>
                        </div>

                        <TableWithPagi
                            columns={['STN No', 'Created At', 'Request Branch', 'Supplying Branch', 'Status', 'Requested By', 'Submitted By', 'Submitted At', '']}
                            rows={stockData.map((data, index) => ({
                                'STN No': data.STN_NO,
                                'Created At': data.createdAt,
                                'Request Branch': data.requestBranch,
                                'Supplying Branch': data.supplyingBranch,
                                'Status': data.status,
                                'Requested By': data.requestedBy,
                                'Submitted By': data.submittedBy,
                                'Submitted At': data.submittedAt,
                                'Actions': (
                                    <div style={{ display: "flex", gap: "0.5em" }}>
                                        {data.status === 'raised' && (
                                            <Link to={`/stock-transfer/issuing/${data.STN_NO}`}>
                                                <RoundButtons
                                                    id={`eyeViewBtn-${index}`}
                                                    type="submit"
                                                    name={`eyeViewBtn-${index}`}
                                                    icon={<BsEye />}
                                                />
                                            </Link>
                                        )}
                                        {data.status === 'completed' && (
                                            <>
                                                <Link to={`/stock-transfer/completed/${data.STN_NO}`}>
                                                    <RoundButtons
                                                        id={`tickBtn-${index}`}
                                                        type="submit"
                                                        name={`tickBtn-${index}`}
                                                        icon={<TiTickOutline />}
                                                    />
                                                </Link>
                                                <RoundButtons
                                                    id={`printBtn-${index}`}
                                                    type="submit"
                                                    name={`printBtn-${index}`}
                                                    icon={<RiPrinterFill />}
                        />
                    </>
                )}
                {data.status === 'cancelled' && (
                    <Link to={`/stock-transfer/cancelled/${data.STN_NO}`}>
                        <RoundButtons
                            id={`tickBtn-${index}`}
                            type="submit"
                            name={`tickBtn-${index}`}
                            icon={<MdOutlineCancel />}
                        />
                    </Link>
                )}
            </div>
        ),
    }))}
    customTableStyle={{ top: '20%', width: '100%' }}
    itemsPerPage={10}
/>


                    </div>
                </div>
            </Layout>
        </>
    );
};

export default StockTransfer;
