import React, { useState, useEffect } from 'react';
import Layout from "../../../Layout/Layout";
import axios from 'axios';
import "./StockTransferOUT.css";
import InputField from "../../../Components/InputField/InputField";
import TableWithPagi from '../../../Components/Tables/TableWithPagi';
import Buttons from '../../../Components/Buttons/SquareButtons/Buttons';
import InputDropdown from "../../../Components/InputDropdown/InputDropdown";
import InputLabel from "../../../Components/Label/InputLabel";
import RoundButtons from '../../../Components/Buttons/RoundButtons/RoundButtons';
import DatePicker from '../../../Components/DatePicker/DatePicker';
import SearchBar from '../../../Components/SearchBar/SearchBar';
import { useNavigate } from 'react-router-dom';
import { BsEye, BsCheckCircle, BsXCircle } from "react-icons/bs";
import { RiPrinterFill } from "react-icons/ri";
import { Link } from 'react-router-dom';
import SubSpinner from '../../../Components/Spinner/SubSpinner/SubSpinner';
import BranchDropdown from '../../../Components/InputDropdown/BranchDropdown';

export const StockTransferOUT = () => {
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
            if (user.role === 'Super Admin') {
                response = await axios.get('http://localhost:8080/allTransfers');
            } else if (user.branchName) {
                response = await axios.get(`http://localhost:8080/stock-transfer/request-branch/${user.branchName}`);
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

            // Prepare the search parameters
            const params = {
                fromDate: searchParams.fromDate,
                toDate: searchParams.toDate,
                STNNo: searchParams.STNNo,
                productId: searchParams.productId.split(' ')[0], // Take only the product ID
            };

            // Perform the search
            const response = await axios.get(`http://localhost:8080/stock-transfer`, { params });

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
                <div className="stockTransferOUT-bodycontainer">
                    
                    <div className="stockTransferOUT-content-middle">
                    {loading ? (
                            <div><SubSpinner/></div>
                        ) : (

                        <TableWithPagi
                            columns={['STN No', 'Created At', 'Request Branch', 'Supplying Branch',  'Status', 'Requested By', 'Submitted By', 'Submitted At', 'Actions']}
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
                                            <Link to={`/stock-transfer/OUT/raised/${data.STN_NO}`}>
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
                                            <Link to={`/stock-transfer/receiving/${data.STN_NO}`}>
                                            <RoundButtons
                                                id={`tickBtn-${index}`}
                                                type="submit"
                                                name={`tickBtn-${index}`}
                                                icon={<BsCheckCircle />}
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
                                             <Link to={`/stock-transfer/OUT/cancelled/${data.STN_NO}`}>
                                            <RoundButtons
                                                id={`cancelBtn-${index}`}
                                                type="submit"
                                                name={`cancelBtn-${index}`}
                                                icon={<BsXCircle />}
                                            />
                                            </Link>
                                        )}
                                        
                                    </div>
                                ),
                            }))}
                            customTableStyle={{ top: '20%', width: '100%' }}
                            itemsPerPage={10}
                        />
                        )}
                    </div>
                </div>
            
        </>
   
    );
};

export default StockTransferOUT;
