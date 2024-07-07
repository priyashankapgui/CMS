import React, { useState, useEffect, useCallback } from 'react';
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
import { getAllBillsByDate } from '../../../../Api/Billing/SalesApi';
import TableWithPagi from '../../../../Components/Tables/TableWithPagi';
import SubSpinner from '../../../../Components/Spinner/SubSpinner/SubSpinner';

export const WorkList = () => {
    const [clickedLink, setClickedLink] = useState('Billed');
    const [selectedBranch, setSelectedBranch] = useState('');
    const [billNo, setBillNo] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [filteredBillData, setFilteredBillData] = useState([]);

    const currentDate = new Date();
    const nextDate = new Date(currentDate);
    const prevDate = new Date(currentDate);
    nextDate.setDate(currentDate.getDate() + 1);
    prevDate.setDate(currentDate.getDate() - 1);

    const [startDate, setStartDate] = useState(prevDate);
    const [endDate, setEndDate] = useState(currentDate);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (selectedBranch) {
            handleSearch();
        }
    }, [selectedBranch]);

    const handleLinkClick = (linkText) => {
        setClickedLink(linkText);
    };

    const handleStartDateChange = (date) => {
        setStartDate(date);
    };

    const handleEndDateChange = (date) => {
        setEndDate(date);
    };

    const filterData = useCallback((data) => {
        return data.filter(row =>
            (!selectedBranch || row.branchName === selectedBranch) &&
            (!billNo || row.billNo.includes(billNo)) &&
            (!customerName || row.customerName.includes(customerName))
        ).sort((a, b) => new Date(b.returnedAt) - new Date(a.returnedAt));
    }, [selectedBranch, billNo, customerName]);

    const handleSearch = useCallback(async () => {
        setLoading(true);
        try {
            const fromDate = startDate ? new Date(startDate).toISOString() : new Date().toISOString();
            const toDate = endDate ? new Date(endDate).toISOString() : new Date().toISOString();
            const data = await getAllBillsByDate({
                branchName: selectedBranch,
                startDate: fromDate,
                endDate: toDate,
            });
            const sortedData = filterData(data);
            console.log('Response Data:', data); 
            setFilteredBillData(sortedData);
        } catch (error) {
            console.error("Error fetching return bills:", error);
            setError(error);
        } finally {
            setLoading(false);
        }
    }, [selectedBranch, startDate, endDate, filterData]);

    const handleClear = async () => {
        const currentDate = new Date();
        const nextDate = new Date(currentDate);
        nextDate.setDate(currentDate.getDate() + 1);

        setStartDate(prevDate);
        setEndDate(nextDate);
        setBillNo('');
        setCustomerName('');

        setLoading(true);
        setError(null);
        try {
            const fromDate = prevDate.toISOString();
            const toDate = currentDate.toISOString();

            const data = await getAllBillsByDate({
                branchName: selectedBranch,
                startDate: fromDate,
                endDate: toDate,
            });
            const sortedData = filterData(data);
            console.log('Response Data:', data); 
            setFilteredBillData(sortedData);
        } catch (error) {
            console.error("Error fetching all bills:", error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleBranchDropdownChange = (value) => {
        setSelectedBranch(value);
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
                                onChange={handleBranchDropdownChange}
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
                        <Buttons type="button" id="clear-btn" style={{ backgroundColor: "white", color: "#EB1313" }} onClick={handleClear}> Clear </ Buttons>
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
                    {loading ? (
                        <div><SubSpinner /></div>
                    ) : (
                        <div className="worklist-billed-historytable">
                            <TableWithPagi
                                itemsPerPage={10}
                                headerColor="#262626"
                                columns={['Bill No', 'Billed At', 'Branch', 'Customer Name', 'Status', 'Billed By', 'Payment Method', '']}
                                rows={filteredBillData.map(row => ({
                                    billNo: row.billNo,
                                    billedAt: new Date(row.createdAt).toLocaleString('en-GB'),
                                    branchName: row.branchName,
                                    customerName: row.customerName,
                                    status: row.status,
                                    billedBy: row.billedBy,
                                    paymentMethod: row.paymentMethod,
                                    action: (
                                        <div style={{ display: "flex", gap: "0.5em" }}>
                                            <Link to={`/work-list/viewbill/${row.billNo}`}>
                                                <RoundButtons
                                                    id="eyeViewBtn"
                                                    type="submit"
                                                    name="eyeViewBtn"
                                                    icon={<BsEye />}
                                                />
                                            </Link>
                                        </div>
                                    )
                                }))}
                            />
                        </div>
                    )}
                </div>
            </Layout>
        </>
    );
};

export default WorkList;
