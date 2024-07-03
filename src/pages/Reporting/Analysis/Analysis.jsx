import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from "../../../Layout/Layout";
import "./Analysis.css";
import InputLabel from "../../../Components/Label/InputLabel";
import BranchDropdown from '../../../Components/InputDropdown/BranchDropdown';
import DatePicker from "../../../Components/DatePicker/DatePicker";
import Buttons from "../../../Components/Buttons/SquareButtons/Buttons";
import { Link } from "react-router-dom";
import SalesChart from '../../../Components/Charts/SalesChart';

export const Analysis = () => {
    const [clickedLink, setClickedLink] = useState('Analysis');
    const [selectedBranch, setSelectedBranch] = useState('');
    const currentDate = new Date(); // Initialize with current date object
    const [date, setDate] = useState(currentDate); // Set date state to current date
    const [totalSaleAmount, setTotalSaleAmount] = useState(null);
    const [totalOnlineSaleAmount, setTotalOnlineSaleAmount] = useState(null);

    const handleLinkClick = (linkText) => {
        setClickedLink(linkText);
    };

    const handleBranchDropdownChange = (value) => {
        setSelectedBranch(value);
    };

    const handleDateChange = (selectedDate) => {
        setDate(selectedDate);
    };

    const formatDate = (date) => {
        return date.toISOString().slice(0, 10); // Format date as YYYY-MM-DD
    };

    const fetchTotalAmount = async (branch, date) => {
        try {
            const response = await axios.get('http://localhost:8080/netBillTotalAmountForDate', {
                params: {
                    branchName: branch,
                    date: date
                }
            });
            console.log("fetchTotalAmount", response);
            setTotalSaleAmount(response.data.data.newTotalAmount);
        } catch (error) {
            console.error('Error fetching total sales amount:', error);
        }
    };

    const fetchOnlineBillTotalAmount = async (branch, date) => {
        try {
            const response = await axios.get('http://localhost:8080/billTotalsForDate', {
                params: {
                    branchName: branch,
                    date: date
                }
            });
            console.log("fetchOnlineBillTotalAmount", response);
            setTotalOnlineSaleAmount(response.data.onlineBillTotalAmount);
        } catch (error) {
            console.error('Error fetching Online Sale amount:', error);
        }
    };

    useEffect(() => {
        const formattedDate = formatDate(currentDate);
        fetchTotalAmount(selectedBranch, formattedDate);
        fetchOnlineBillTotalAmount(selectedBranch, formattedDate);
    }, [selectedBranch, currentDate]); // Include currentDate in the dependency array

    const handleViewTotal = () => {
        const formattedDate = formatDate(date);
        fetchTotalAmount(selectedBranch, formattedDate);
        fetchOnlineBillTotalAmount(selectedBranch, formattedDate);
    };

    const handleClearTotalView = () => {
        setDate(currentDate); // Reset the date to current date
        const formattedDate = formatDate(currentDate);
        fetchTotalAmount(selectedBranch, formattedDate);
        fetchOnlineBillTotalAmount(selectedBranch, formattedDate);
    };

    return (
        <>
            <div className="top-nav-blue-text">
                <h4>Reporting - Analysis</h4>
            </div>
            <Layout>
                <div className="linkActions-analysis">
                    <div className={clickedLink === 'Analysis' ? 'clicked' : ''}>
                        <Link
                            to="/reporting/analysis"
                            onClick={() => handleLinkClick('Analysis')}
                        >
                            Analysis
                        </Link>
                    </div>
                    <div className={clickedLink === 'Generate Reports' ? 'clicked' : ''}>
                        <Link
                            to="/reporting/reports"
                            onClick={() => handleLinkClick('Generate Reports')}
                        >
                            Generate Reports
                        </Link>
                    </div>
                </div>
                <div className="reportingTop">
                    <div className="reportLeftContent">
                        <h3 className="reportingTop-title">Daily Sale Analysis</h3>
                        <div className="rep-Cont1">
                            <div className="rep-Cont1-top">
                                <div className="branchField">
                                    <InputLabel htmlFor="branchName" color="#0377A8">Branch</InputLabel>
                                    <BranchDropdown
                                        id="branchName"
                                        name="branchName"
                                        editable={true}
                                        onChange={(e) => handleBranchDropdownChange(e)}
                                    />
                                </div>
                                <div className="dateField">
                                    <InputLabel htmlFor="date" color="#0377A8">Date</InputLabel>
                                    <DatePicker selectedDate={date} onDateChange={handleDateChange} />
                                </div>
                            </div>
                            <div className="analysis-btn-section">
                                <Buttons type="submit" id="view-btn" style={{ backgroundColor: "#23A3DA", color: "white" }} onClick={handleViewTotal}> View </Buttons>
                                <Buttons type="submit" id="clear-btn" style={{ backgroundColor: "white", color: "#EB1313" }} onClick={handleClearTotalView}> Clear </ Buttons>
                            </div>
                        </div>
                    </div>
                    <div className="reportRightContent">
                        <h5 className='physicalSaleAmountTxt'>Physical Sale : <span style={{ color: "black" }}>Rs {totalSaleAmount !== null ? totalSaleAmount.toFixed(2) : 0}</span></h5>
                        <h5 className='onlineSaleAmountTxt'>Online Sale : <span style={{ color: "black" }}>Rs {totalOnlineSaleAmount !== null ? totalOnlineSaleAmount.toFixed(2) : 0}</span></h5>
                        <h3 className='totalNetSaleTxt'>Total Net Sales Amount : <span style={{ color: "black" }}>Rs {totalSaleAmount !== null && totalOnlineSaleAmount !== null ? (totalSaleAmount + totalOnlineSaleAmount).toFixed(2) : 0}</span></h3>
                    </div>
                </div>
                <div className="reportingMiddle">
                    <SalesChart />
                </div>
            </Layout>
        </>
    );
};

export default Analysis;
