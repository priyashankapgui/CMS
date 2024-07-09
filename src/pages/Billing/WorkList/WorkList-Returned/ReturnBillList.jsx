import React, { useState, useEffect, useCallback } from 'react';
import './ReturnBillList.css';
import Layout from "../../../../Layout/Layout";
import { Link } from "react-router-dom";
import Buttons from "../../../../Components/Buttons/SquareButtons/Buttons";
import InputField from "../../../../Components/InputField/InputField";
import InputLabel from "../../../../Components/Label/InputLabel";
import DatePicker from "../../../../Components/DatePicker/DatePicker";
import { BsEye } from "react-icons/bs";
import RoundButtons from '../../../../Components/Buttons/RoundButtons/RoundButtons';
import BranchDropdown from '../../../../Components/InputDropdown/BranchDropdown';
import SubSpinner from '../../../../Components/Spinner/SubSpinner/SubSpinner';
import TableWithPagi from '../../../../Components/Tables/TableWithPagi';
import { getAllRefundBillsByDate } from '../../../../Api/Billing/SalesApi';

export const ReturnBillList = () => {
    const [clickedLink, setClickedLink] = useState('Returned');

    const [filteredBillData, setFilteredBillData] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState('');
    const [billNo, setBillNo] = useState('');
    const [customerName, setCustomerName] = useState('');

    const currentDate = new Date();
    const nextDate = new Date(currentDate);
    nextDate.setDate(currentDate.getDate() + 1);

    const [startDate, setStartDate] = useState(currentDate);
    const [endDate, setEndDate] = useState(nextDate);

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

    const handleBranchDropdownChange = (value) => {
        setSelectedBranch(value);
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
            let toDate = endDate ? new Date(endDate).toISOString() : new Date().toISOString();
            const data = await getAllRefundBillsByDate({
                branchName: selectedBranch,
                startDate: fromDate,
                endDate: toDate,
            });
            const sortedData = filterData(data);
            setFilteredBillData(sortedData);
        } catch (error) {
            console.error("Error fetching return bills:", error);
        } finally {
            setLoading(false);
        }
    }, [selectedBranch, startDate, endDate, filterData]);

    const handleClear = async () => {
        const currentDate = new Date();
        const nextDate = new Date(currentDate);
        nextDate.setDate(currentDate.getDate() + 1);

        setStartDate(currentDate);
        setEndDate(nextDate);
        setBillNo('');
        setCustomerName('');

        setLoading(true);
        setError(null);
        try {
            const fromDate = currentDate.toISOString();
            const toDate = nextDate.toISOString();

            const data = await getAllRefundBillsByDate({
                branchName: selectedBranch,
                startDate: fromDate,
                endDate: toDate,
            });
            const sortedData = filterData(data);
            setFilteredBillData(sortedData);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
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
                <h4>Worklist - Returned</h4>
            </div>
            <Layout>
                <div className="returnbill-filter-container">
                    <div className="Content1">
                        <div className="branchField">
                            <InputLabel htmlFor="branchName" color="#0377A8">Branch</InputLabel>
                            <BranchDropdown
                                id="branchName"
                                name="branchName"
                                editable={true}
                                value={selectedBranch}
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
                                onChange={e => setBillNo(e.target.value)}
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
                                onChange={e => setCustomerName(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="BtnSection">
                        <Buttons
                            type="submit"
                            id="search-btn"
                            style={{ backgroundColor: "#23A3DA", color: "white" }}
                            onClick={handleSearch}
                        >
                            Search
                        </Buttons>
                        <Buttons
                            type="submit"
                            id="clear-btn"
                            style={{ backgroundColor: "white", color: "#EB1313" }}
                            onClick={handleClear}
                        >
                            Clear
                        </Buttons>
                    </div>
                </div>
                <div className="worklist-middle">
                    <div className="linkActions-billed">
                        <div className={clickedLink === 'Billed' ? 'clicked' : ''}>
                            <Link to="/work-list" onClick={() => handleLinkClick('Billed')}> Billed </Link>
                        </div>
                        <div className={clickedLink === 'Returned' ? 'clicked' : ''}>
                            <Link to="" onClick={() => handleLinkClick('Returned')}> Returned </Link>
                        </div>
                    </div>
                    {loading ? (
                        <div><SubSpinner /></div>
                    ) : (
                        <div className="return-bill-history-table">
                            <TableWithPagi
                                itemsPerPage={10}
                                headerColor="#262626"
                                columns={['Return Bill No', 'Returned At', 'Bill No', 'Branch', 'Customer Name', 'Status', 'Returned By', 'Reason', '']}
                                rows={filteredBillData.map(row => ({
                                    RTBNo: row.RTBNo,
                                    returnedAt: new Date(row.createdAt).toLocaleString('en-GB'),
                                    billNo: row.billNo,
                                    branchName: row.branchName,
                                    customerName: row.customerName,
                                    status: row.status,
                                    returnedBy: row.returnedBy,
                                    reason: row.reason,
                                    action: (
                                        <div style={{ display: "flex", gap: "0.5em" }}>
                                            <Link to={`/work-list/returnbill-list/viewreturnbill/${row.RTBNo}`}>
                                                <RoundButtons
                                                    id="eyeViewBtn"
                                                    type="submit"
                                                    name="eyeViewBtn"
                                                    icon={<BsEye />}
                                                />
                                            </Link>
                                        </div>
                                    )
                                }))
                                    .sort((a, b) => new Date(b.returnedAt) - new Date(a.returnedAt))
                                }
                            />
                        </div>
                    )}
                </div>
            </Layout>
        </>
    );
};

export default ReturnBillList;
