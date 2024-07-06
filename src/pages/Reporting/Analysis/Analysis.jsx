import React, { useState, useMemo } from 'react';
import Layout from "../../../Layout/Layout";
import "./Analysis.css";
import InputLabel from "../../../Components/Label/InputLabel";
import BranchDropdown from '../../../Components/InputDropdown/BranchDropdown';
import DatePicker from "../../../Components/DatePicker/DatePicker";
import Buttons from "../../../Components/Buttons/SquareButtons/Buttons";
import SalesChart from '../../../Components/Charts/SalesChart';
import { Link } from "react-router-dom";
import { getPhysicalSaleTotal, getOnlineSaleTotal } from '../../../Api/Analysis/AnalysisApi';

export const Analysis = () => {
    const [clickedLink, setClickedLink] = useState('Analysis');
    const [selectedBranch, setSelectedBranch] = useState('');
    const [date, setDate] = useState('');
    const [totalSaleAmount, setTotalSaleAmount] = useState(null);
    const [totalOnlineSaleAmount, setTotalOnlineSaleAmount] = useState(null);
    const [isViewClicked, setIsViewClicked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLinkClick = (linkText) => {
        setClickedLink(linkText);
    };

    const handleBranchDropdownChange = (value) => {
        setSelectedBranch(value);
    };

    const handleDateChange = (selectedDate) => {
        setDate(selectedDate);
    };

    const fetchAmountsInParallel = async () => {
        setIsLoading(true);
        try {
            const [totalSaleResponse, onlineSaleResponse] = await Promise.all([
                getPhysicalSaleTotal(selectedBranch, date),
                getOnlineSaleTotal(selectedBranch, date)
            ]);

            console.log("Physical Sale Response:", totalSaleResponse);
            console.log("Online Sale Response:", onlineSaleResponse);

            setTotalSaleAmount(Number(totalSaleResponse.newTotalAmount) || 0);
            setTotalOnlineSaleAmount(Number(onlineSaleResponse.onlineBillTotalAmount) || 0);

        } catch (error) {
            console.error('Error fetching sales amounts:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleViewTotal = () => {
        setIsViewClicked(true);
        fetchAmountsInParallel();
    };

    const handleClearTotalView = () => {
        setTotalSaleAmount(null);
        setTotalOnlineSaleAmount(null);
        setDate('');
        setIsViewClicked(false);
    };

    const totalNetSales = useMemo(() => {
        const physicalSaleAmount = Number(totalSaleAmount) || 0;
        const onlineSaleAmount = Number(totalOnlineSaleAmount) || 0;

        return (physicalSaleAmount + onlineSaleAmount).toFixed(2);
    }, [totalSaleAmount, totalOnlineSaleAmount]);

    const shouldShowResults = totalNetSales !== '0.00';

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
                                    <InputLabel htmlFor="branchName" color="#0377A8">Branch<span style={{ color: 'red' }}>*</span></InputLabel>
                                    <BranchDropdown
                                        id="branchName"
                                        name="branchName"
                                        editable={true}
                                        onChange={(e) => handleBranchDropdownChange(e)}
                                    />
                                </div>
                                <div className="dateField">
                                    <InputLabel htmlFor="date" color="#0377A8">Date<span style={{ color: 'red' }}>*</span></InputLabel>
                                    <DatePicker selectedDate={date} onDateChange={handleDateChange} />
                                </div>
                            </div>
                            <div className="analysis-btn-section">
                                <Buttons type="submit" id="view-btn" style={{ backgroundColor: "#23A3DA", color: "white" }} onClick={handleViewTotal} disabled={!date}> View </Buttons>
                                <Buttons type="submit" id="clear-btn" style={{ backgroundColor: "white", color: "#EB1313" }} onClick={handleClearTotalView}> Clear </Buttons>
                            </div>
                        </div>
                    </div>
                    <div className='reportRightContentMain'>
                        <div className="reportRightContentImg">
                            <img className="logoAnalysis-right" src={`${process.env.PUBLIC_URL}/Images/dailyAnalysis.png`} alt="analysis logo" />
                            {isViewClicked && isLoading ? (
                                <div className='alertText'>
                                    <p className='analysis-loadingTxt'>Calculating...</p>
                                </div>
                            ) : isViewClicked && shouldShowResults ? (
                                <div className="reportRightContent">
                                    <h5 className='physicalSaleAmountTxt'>Physical Sale : <span style={{ color: "black" }}>Rs {totalSaleAmount !== null ? totalSaleAmount.toFixed(2) : '-'}</span></h5>
                                    <h5 className='onlineSaleAmountTxt'>Online Sale : <span style={{ color: "black" }}>Rs {totalOnlineSaleAmount !== null ? totalOnlineSaleAmount.toFixed(2) : '-'}</span></h5>
                                    <h3 className='totalNetSaleTxt'>Total Net Sales Amount : <span style={{ color: "black" }}>Rs {totalNetSales}</span></h3>
                                </div>
                            ) : isViewClicked && totalNetSales === '0.00' ? (
                                <div className='alertText'>
                                    <p className='analysis-noSearchResultTxt'>Sorry!, Sales data not found.</p>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
                <div className="reportingMiddle">
                    <SalesChart />
                </div>
            </Layout >
        </>
    );
};
