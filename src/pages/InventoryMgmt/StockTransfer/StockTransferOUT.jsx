import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./StockTransferOUT.css";
import TableWithPagi from '../../../Components/Tables/TableWithPagi';
import RoundButtons from '../../../Components/Buttons/RoundButtons/RoundButtons';
import { useNavigate } from 'react-router-dom';
import { BsEye, BsCheckCircle, BsXCircle } from "react-icons/bs";
import { RiPrinterFill } from "react-icons/ri";
import { Link } from 'react-router-dom';
import SubSpinner from '../../../Components/Spinner/SubSpinner/SubSpinner';
import secureLocalStorage from "react-secure-storage";

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
    const [userDetails, setUserDetails] = useState({});
    

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
        const userJSON = secureLocalStorage.getItem("user");
        if (userJSON) {
          const user = JSON.parse(userJSON);
          console.log("data",user.role);
    
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
            };

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

    const formatDate = (datetime) => {
        const date = new Date(datetime);
        return date.toISOString().split('T')[0];
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
                                'Created At': formatDate(data.createdAt),
                                'Request Branch': data.requestBranch,
                                'Supplying Branch': data.supplyingBranch,
                                'Status': data.status,
                                'Requested By': data.requestedBy,
                                'Submitted By': data.submittedBy,
                                'Submitted At': formatDate(data.submittedAt),
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














