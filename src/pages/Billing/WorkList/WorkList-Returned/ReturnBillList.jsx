import React, { useState, useEffect } from 'react';
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
import { getAllRefundBills } from '../../../../Api/Billing/SalesApi';
import SubSpinner from '../../../../Components/Spinner/SubSpinner/SubSpinner';
import TableWithPagi from '../../../../Components/Tables/TableWithPagi';

export const ReturnBillList = () => {
    const [clickedLink, setClickedLink] = useState('Returned');
    const [returnBillData, setReturnBillData] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState('');
    const [billNo, setBillNo] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleLinkClick = (linkText) => {
        setClickedLink(linkText);
    };

    const handleBranchDropdownChange = (value) => {
        setSelectedBranch(value);
    };

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getAllRefundBills();
            console.log('Refund Bill:', response);
            setReturnBillData(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error fetching refund bills:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSearch = () => {
        // Add search filter logic here
    };

    const handleClear = () => {
        setSelectedBranch('');
        setBillNo('');
        setCustomerName('');
        setFromDate(null);
        setToDate(null);
        fetchData();
    };

    return (
        <>
            <div className="top-nav-blue-text">
                <h4>Worklist - Returned</h4>
            </div>
            <Layout>
                <div className="returnbill-filter-container">
                    <div className="Content1">
                        <div className="branchField">
                            <InputLabel for="branchName" color="#0377A8">Branch</InputLabel>
                            <BranchDropdown
                                id="branchName"
                                name="branchName"
                                editable={true}
                                value={selectedBranch}
                                onChange={handleBranchDropdownChange}
                            />
                        </div>
                        <div className="dateFieldFrom">
                            <InputLabel for="to-date" color="#0377A8">To</InputLabel>
                            <DatePicker
                                selected={toDate}
                                onChange={date => setToDate(date)}
                            />
                        </div>
                        <div className="dateFieldTo">
                            <InputLabel for="from-date" color="#0377A8">From</InputLabel>
                            <DatePicker
                                selected={fromDate}
                                onChange={date => setFromDate(date)}
                            />
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
                    ) : error ? (
                        <div>{error.message}</div>
                    ) : (
                        <div className="return-bill-history-table">
                            <TableWithPagi
                                itemsPerPage={10}
                                headerColor="#262626"
                                columns={['Return Bill No', 'Returned At', 'Bill No', 'Branch', 'Customer Name', 'Status', 'Returned By', 'Reason', '']}
                                rows={returnBillData.map(row => ({
                                    RTBNo: row.RTBNo,
                                    refundAt: new Date(row.createdAt).toLocaleString('en-GB'),
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
                                }))}
                            />
                        </div>
                    )}
                </div>
            </Layout >
        </>
    );
};