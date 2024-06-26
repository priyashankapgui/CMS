import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../../../../Layout/Layout';
import './WorkList.css';
import InputLabel from '../../../../Components/Label/InputLabel';
import BranchDropdown from '../../../../Components/InputDropdown/BranchDropdown';
import DatePicker from '../../../../Components/DatePicker/DatePicker';
import Buttons from '../../../../Components/Buttons/SquareButtons/Buttons';
import InputField from '../../../../Components/InputField/InputField';
import { Link } from 'react-router-dom';
import { BsEye } from 'react-icons/bs';
import RoundButtons from '../../../../Components/Buttons/RoundButtons/RoundButtons';

export const WorkList = () => {
    const [clickedLink, setClickedLink] = useState('Billed');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [selectedBranch, setSelectedBranch] = useState('');
    const [billNo, setBillNo] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [error, setError] = useState(null);
    const [billProduct, setBillProduct] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:8080/bills');
            if (response.data && response.data.data && Array.isArray(response.data.data)) {
                setBillProduct(response.data.data);

                // Filter products based on current date after fetching
                const currentDate = new Date();
                const filteredData = response.data.data.filter(item => {
                    const itemDate = new Date(item.createdAt);
                    return itemDate.setHours(0, 0, 0, 0) === currentDate.setHours(0, 0, 0, 0);
                });
                setFilteredProducts(filteredData);
            } else {
                setError(new Error("Data format error: response is not an array"));
            }
        } catch (error) {
            setError(error);
        }
    };

    const handleLinkClick = (linkText) => {
        setClickedLink(linkText);
    };

    const handleStartDateChange = (date) => {
        setStartDate(date);
    };

    const handleEndDateChange = (date) => {
        setEndDate(date);
    };

    const handleClear = () => {
        const currentDate = new Date();
        const previousDate = new Date(currentDate);
        previousDate.setDate(currentDate.getDate() - 1); // Previous date

        setSelectedBranch('');
        setStartDate(previousDate); // Set to previous date
        setEndDate(currentDate); // Set to current date
        setBillNo('');
        setCustomerName('');
        handleSearch(); // Call handleSearch to update filtered products
    };

    const handleBranchDropdownChange = (value) => {
        setSelectedBranch(value);
    };

    const handleSearch = () => {
        // Normalize the dates to start of the day
        const normalizeDate = (date) => {
            const newDate = new Date(date);
            newDate.setHours(0, 0, 0, 0);
            return newDate;
        };

        let filteredProducts = [...billProduct];

        if (selectedBranch) {
            filteredProducts = filteredProducts.filter(item => item.branchName === selectedBranch);
        }

        if (startDate && endDate) {
            const normalizedStartDate = normalizeDate(startDate).getTime();
            const normalizedEndDate = normalizeDate(endDate).getTime();

            filteredProducts = filteredProducts.filter(item => {
                const itemDate = normalizeDate(new Date(item.createdAt)).getTime();
                return itemDate >= normalizedStartDate && itemDate <= normalizedEndDate;
            });
        } else if (startDate) {
            const normalizedStartDate = normalizeDate(startDate).getTime();
            filteredProducts = filteredProducts.filter(item => {
                const itemDate = normalizeDate(new Date(item.createdAt)).getTime();
                return itemDate >= normalizedStartDate;
            });
        } else if (endDate) {
            const normalizedEndDate = normalizeDate(endDate).getTime();
            filteredProducts = filteredProducts.filter(item => {
                const itemDate = normalizeDate(new Date(item.createdAt)).getTime();
                return itemDate <= normalizedEndDate;
            });
        }

        if (billNo) {
            filteredProducts = filteredProducts.filter(item => item.billNo.includes(billNo));
        }

        if (customerName) {
            filteredProducts = filteredProducts.filter(item => item.customerName.toLowerCase().includes(customerName.toLowerCase()));
        }

        // Sort filteredProducts by Billed At date in descending order
        filteredProducts.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        setFilteredProducts(filteredProducts);
    };

    if (error) {
        return (
            <div>
                <h4>Error: {error.message}</h4>
                <pre>{JSON.stringify(error.response?.data, null, 2)}</pre>
            </div>
        );
    }

    return (
        <>
            <div className="top-nav-blue-text">
                <h4>Work List - {clickedLink}</h4>
            </div>
            <Layout>
                <div className="worklist-filter-container">
                    <div className="W-Content1">
                        <div className="branchField">
                            <InputLabel htmlFor="branchName" color="#0377A8">Branch<span style={{ color: 'red' }}>*</span></InputLabel>
                            <BranchDropdown
                                id="branchName"
                                name="branchName"
                                editable={true}
                                onChange={(e) => handleBranchDropdownChange(e)}
                            />
                        </div>
                        <div className="dateFieldFrom">
                            <InputLabel htmlFor="from-date" color="#0377A8">From</InputLabel>
                            <DatePicker selectedDate={startDate} onDateChange={handleStartDateChange} />
                        </div>
                        <div className="dateFieldTo">
                            <InputLabel htmlFor="to-date" color="#0377A8">To</InputLabel>
                            <DatePicker selectedDate={endDate} onDateChange={handleEndDateChange} />
                        </div>
                        <div className="billNoField">
                            <InputLabel htmlFor="billNo" color="#0377A8">Bill No</InputLabel>
                            <InputField
                                type="text"
                                id="billNo"
                                name="billNo"
                                editable={true}
                                width="200px"
                                value={billNo}
                                onChange={(e) => setBillNo(e.target.value)}
                            />
                        </div>
                        <div className="customerField">
                            <InputLabel htmlFor="customerName" color="#0377A8">Customer Name</InputLabel>
                            <InputField
                                type="text"
                                id="customerName"
                                name="customerName"
                                editable={true}
                                width="210px"
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="WorklistBtnSection">
                        <Buttons type="button" id="search-btn" style={{ backgroundColor: "#23A3DA", color: "white" }} onClick={handleSearch}> Search </Buttons>
                        <Buttons type="button" id="clear-btn" style={{ backgroundColor: "white", color: "#EB1313" }} onClick={() => { handleClear(); handleSearch(); }}> Clear </Buttons>
                    </div>
                </div>
                <div className="worklist-middle">
                    <div className="linkActions-billed">
                        <div className={clickedLink === 'Billed' ? 'clicked' : ''}>
                            <Link to="/work-list" onClick={() => handleLinkClick('Billed')}>
                                Billed
                            </Link>
                        </div>
                        <div className={clickedLink === 'Returned' ? 'clicked' : ''}>
                            <Link to="/work-list/returnbill-list" onClick={() => handleLinkClick('Returned')}>
                                Returned
                            </Link>
                        </div>
                    </div>
                    <table className="billed-history-table">
                        <thead>
                            <tr>
                                <th>Bill No</th>
                                <th>Billed At</th>
                                <th>Branch</th>
                                <th>Customer Name</th>
                                <th>Status</th>
                                <th>Billed By</th>
                                <th>Payment Method</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(filteredProducts) && filteredProducts.length > 0 ? (
                                filteredProducts.map((row, index) => (
                                    <tr key={index}>
                                        <td>{row.billNo}</td>
                                        <td>{new Date(row.createdAt).toLocaleString()}</td>
                                        <td>{row.branchName}</td>
                                        <td>{row.customerName || 'N/A'}</td>
                                        <td>{row.status}</td>
                                        <td>{row.billedBy}</td>
                                        <td>{row.paymentMethod}</td>
                                        <td>
                                            <Link to={`/work-list/viewbill/${row.billNo}`}>
                                                <RoundButtons
                                                    id={`eyeViewBtn-${index}`}
                                                    type="submit"
                                                    name={`eyeViewBtn-${index}`}
                                                    icon={<BsEye />}
                                                />
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8">No data available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Layout>
        </>
    );
};

export default WorkList;
