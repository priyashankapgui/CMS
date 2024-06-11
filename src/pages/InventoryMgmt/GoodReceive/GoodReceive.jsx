
import React, { useState, useEffect } from 'react';
import Layout from "../../../Layout/Layout";
import axios from 'axios';
import "./GoodReceive.css";
import InputField from "../../../Components/InputField/InputField";
import TableWithPagi from '../../../Components/Tables/TableWithPagi';
import Buttons from '../../../Components/Buttons/SquareButtons/Buttons';
import InputLabel from "../../../Components/Label/InputLabel";
import RoundButtons from '../../../Components/Buttons/RoundButtons/RoundButtons';
import DatePicker from '../../../Components/DatePicker/DatePicker';
import SearchBar from '../../../Components/SearchBar/SearchBar';
import { useNavigate } from 'react-router-dom';
import { BsEye } from "react-icons/bs";
import { RiPrinterFill } from "react-icons/ri";
import { Link } from 'react-router-dom';
import SubSpinner from '../../../Components/Spinner/SubSpinner/SubSpinner';
import ViewGRN from './ViewGRN';
import BranchDropdown from '../../../Components/InputDropdown/BranchDropdown';

export const GoodReceive = () => {
    const [grnData, setGrnData] = useState([]);
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState('');
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useState({
        grnNo: '',
        fromDate: '',
        toDate: '',
        invoiceNo: '',
        productId: '',
        supplierId: ''
    });
    const [product, setProducts] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchGrnData();
        fetchBranches();
        fetchProducts();
        fetchSuppliers();
    }, []);

    const fetchGrnData = async () => {
        try {
            const response = await axios.get("http://localhost:8080/grn");
            setGrnData(response.data?.data || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching GRN data:', error);
            setLoading(false);
        }
    };

    const fetchBranches = async () => {
        try {
            const response = await axios.get('http://localhost:8080/branches');
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

    const fetchSuppliers = async () => {
        try {
            const response = await axios.get('http://localhost:8080/suppliers');
            setSuppliers(response.data.data);
        } catch (error) {
            console.error('Error fetching suppliers:', error);
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
            let response;

            const productId = searchParams.productId.split(' ')[0]; // Assuming the productId is the first part
            const supplierId = searchParams.supplierId.split(' ')[0];

            if (searchParams.grnNo) {
                response = await axios.get(`http://localhost:8080/grn/${searchParams.grnNo}`);
            } else if (productId && selectedBranch) { // Added condition for productId and selectedBranch
                response = await axios.get(`http://localhost:8080/grn-branch-product`, {
                    params: {
                        branchName: selectedBranch,
                        productId: productId
                    }
                });
            } else if (searchParams.invoiceNo) {
                response = await axios.get(`http://localhost:8080/grn/invoice/${searchParams.invoiceNo}`);
            } else if (searchParams.productId) {
                response = await axios.get(`http://localhost:8080/grn-details/product/${productId}`);
            } else if (searchParams.supplierId) {
                response = await axios.get(`http://localhost:8080/grn-supplier/${supplierId}`);
            } else if (selectedBranch) {
                response = await axios.get(`http://localhost:8080/grn-branch?branchName=${selectedBranch}`);
            } else if (searchParams.fromDate && searchParams.toDate) {
                response = await axios.get(`http://localhost:8080/grn-date-range`, {
                    params: {
                        startDate: searchParams.fromDate,
                        endDate: searchParams.toDate
                    }
                });
            } else if (supplierId && selectedBranch) {
                response = await axios.get(`http://localhost:8080/grn-branch-supplier`, {
                    params: {
                        branchName: selectedBranch,
                        supplierId: supplierId
                    }
                });
           
            } else {
                response = await axios.get(`http://localhost:8080/grn`);
            }
            setGrnData(response.data?.data ? (Array.isArray(response.data.data) ? response.data.data : [response.data.data]) : []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching GRN data:', error);
            setGrnData([]);
            setLoading(false);
        }
    };

    const handleClear = () => {
        setSearchParams({
            grnNo: '',
            fromDate: '',
            toDate: '',
            invoiceNo: '',
            productId: '',
            supplierId: ''
        });
    };

    const handleNewButtonClick = () => {
        navigate('/good-receive/new');
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

    const fetchSuppliersSuggestions = async (query) => {
        try {
            const response = await axios.get(`http://localhost:8080/suppliers?search=${query}`);
            if (response.data && response.data.data) {
                return response.data.data.map(supplier => ({
                    id: supplier.supplierId,
                    displayText: `${supplier.supplierId} ${supplier.supplierName}`
                }));
            }
            return [];
        } catch (error) {
            console.error('Error fetching supplier suggestions:', error);
            return [];
        }
    };

    return (
        <>
            <div className="top-nav-blue-text">
                <h4>Good Receive Note</h4>
            </div>
            <Layout>
                <div className="reg-goodReceives-bodycontainer">
                    <div className="goodReceive-filter-container">
                        <div className="goodReceive-content-top1">
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
                            <div className="datePickerFrom">
                                <InputLabel htmlFor="From" color="#0377A8">From</InputLabel>
                                <DatePicker id="dateFrom" name="fromDate" onDateChange={(date) => handleDateChange('fromDate', date)} />
                            </div>
                            <div className="datePickerTo">
                                <InputLabel htmlFor="To" color="#0377A8">To</InputLabel>
                                <DatePicker id="dateTo" name="toDate" onDateChange={(date) => handleDateChange('toDate', date)} />
                            </div>
                            <div className="grnNoField">
                                <InputLabel htmlFor="grnNo" color="#0377A8">GRN No</InputLabel>
                                <InputField type="text" id="grnNo" name="grnNo" value={searchParams.grnNo} onChange={handleInputChange} editable={true} width="250px" />
                            </div>
                            <div className="invoiceNoField">
                                <InputLabel htmlFor="invoiceNo" color="#0377A8">Invoice No</InputLabel>
                                <InputField type="text" id="invoiceNo" name="invoiceNo" value={searchParams.invoiceNo} onChange={handleInputChange} editable={true} width="250px" />
                            </div>
                        </div>
                        <div className="goodReceive-content-top2">
                            <div className="productsField">
                                <InputLabel htmlFor="productId" color="#0377A8">Product ID / Name</InputLabel>
                                <SearchBar
                                    searchTerm={searchParams.productId}
                                    setSearchTerm={value => setSearchParams(prevState => ({ ...prevState, productId: value }))}
                                    onSelectSuggestion={suggestion => setSearchParams(prevState => ({ ...prevState, productId: `${suggestion.displayText}` }))}
                                    fetchSuggestions={fetchProductsSuggestions}
                                />
                            </div>
                            <div className="suppliersField">
                                <InputLabel htmlFor="supplierId" color="#0377A8">Supplier ID / Name</InputLabel>
                                <SearchBar
                                    searchTerm={searchParams.supplierId}
                                    setSearchTerm={value => setSearchParams(prevState => ({ ...prevState, supplierId: value }))}
                                    onSelectSuggestion={suggestion => setSearchParams(prevState => ({ ...prevState, supplierId: `${suggestion.displayText}` }))}
                                    fetchSuggestions={fetchSuppliersSuggestions}
                                />
                            </div>
                        </div>
                        <div className="goodReceive-BtnSection">
                            <Buttons type="button" id="search-btn" style={{ backgroundColor: "#23A3DA", color: "white" }} onClick={handleSearch}> Search </Buttons>
                            <Buttons type="button" id="clear-btn" style={{ backgroundColor: "white", color: "#EB1313" }} onClick={handleClear}> Clear </Buttons>
                            <Buttons type="button" id="new-btn" style={{ backgroundColor: "white", color: "#23A3DA" }} onClick={handleNewButtonClick}> New + </Buttons>
                        </div>
                    </div>
                    <div className="goodReceive-content-middle">
                        {loading ? (
                            <div><SubSpinner /></div>
                        ) : (
                            <TableWithPagi
                                columns={['GRN No', 'Created At', 'Branch', 'Supplier', 'Invoice No', '']}
                                rows={grnData.map((grn, index) => ({
                                    'GRN No': grn.GRN_NO,
                                    'Created At': grn.createdAt,
                                    'Branch': grn.branchName,
                                    'Supplier': grn.supplierName,
                                    'Invoice No': grn.invoiceNo,
                                    
                                    'Action': (
                                        <div style={{ display: "flex", gap: "0.5em" }}>
                                           <Link to={`/good-receive/ViewGRN/${grn.GRN_NO}`}>
                                            <RoundButtons
                                                id={`eyeViewBtn-${index}`}
                                                type="submit"
                                                name={`eyeViewBtn-${index}`}
                                                icon={<BsEye />}
                                            />
                                            </Link>
                                            <RoundButtons
                                                id={`printBtn-${index}`}
                                                type="submit"
                                                name={`printBtn-${index}`}
                                                icon={<RiPrinterFill />}
                                            />
                                        </div>
                                    )
                                }))}
                            />
                        )}
                    </div>
                </div>
            </Layout>
        </>
    );
};

export default GoodReceive;