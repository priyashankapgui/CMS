import React, { useState } from 'react';
import Layout from "../../../Layout/Layout";
import "./Reports.css";
import Buttons from "../../../Components/Buttons/SquareButtons/Buttons";
import InputLabel from "../../../Components/Label/InputLabel";
import InputDropdown from "../../../Components/InputDropdown/InputDropdown";
import BranchDropdown from '../../../Components/InputDropdown/BranchDropdown';
import repoTypes from '../../../Components/Data.json';
import { Link } from "react-router-dom";
import StockSummeryDoc from '../../../Components/InventoryDocuments/StockSummeryDoc/StockSummeryDoc';
import UpcomingExpDoc from '../../../Components/InventoryDocuments/UpcomingExpDoc/UpcomingExpDoc';

export const Reports = () => {
    const [clickedLink, setClickedLink] = useState('Generate Reports');
    const [selectedReportType, setSelectedReportType] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('');
    const [showStockSummeryReport, setShowStockSummeryReport] = useState(false);
    const [showUpcomingExpiryReport, setShowUpcomingExpiryReport] = useState(false);

    const handleLinkClick = (linkText) => {
        setClickedLink(linkText);
    };

    const handleDropdownChange = (value, type) => {
        if (type === 'branch') {
            setSelectedBranch(value);
        } else if (type === 'reportType') {
            setSelectedReportType(value);
        }
        console.log('Selected Drop Down Value:', value);
    };

    const handleViewButtonClick = () => {
        if (selectedReportType === 'Stock Summary') {
            setShowStockSummeryReport(true);
        } else if (selectedReportType === 'Upcoming Expiry Stock') {
            setShowUpcomingExpiryReport(true);
        }
    };

    const handleCloseDoc = () => {
        setShowStockSummeryReport(false);
        setShowUpcomingExpiryReport(false);
    };

    const handleClearButtonClick = () => {
        setSelectedBranch(''); 
        setSelectedReportType(''); 
        setShowStockSummeryReport(false);
        setShowStockSummeryReport(false);

    }
    return (
        <>
            <div className="top-nav-blue-text">
                <h4>Reporting - Generate Reports</h4>
            </div>
            <Layout>
                <div className="linkActions-reports">
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
                <div className="repo-Top">
                    <div className="repoLeftContent">
                        <h3 className="repoTop-title">Generate Reports</h3>
                        <div className="repo-Content">
                            <div className="branchField">
                                <InputLabel htmlFor="branchName" color="#0377A8">Branch<span style={{ color: 'red' }}>*</span></InputLabel>
                                <BranchDropdown
                                    id="branchName"
                                    name="branchName"
                                    editable={true}
                                    onChange={(value) => handleDropdownChange(value, 'branch')}
                                />
                            </div>
                            <div className="repoTypeField">
                                <InputLabel htmlFor="repoType" color="#0377A8">Report Type<span style={{ color: 'red' }}>*</span></InputLabel>
                                <InputDropdown
                                    id="repoType"
                                    name="repoType"
                                    editable={true}
                                    options={repoTypes.repoTypes}
                                    onChange={(value) => handleDropdownChange(value, 'reportType')}
                                />
                            </div>
                        </div>
                        <div className="btnSection">
                            <Buttons type="submit" id="view-btn" style={{ backgroundColor: "#23A3DA", color: "white" }} onClick={handleViewButtonClick}> View </Buttons>
                            <Buttons type="submit" id="clear-btn" style={{ backgroundColor: "#fafafa", color: "red" }} onClick={handleClearButtonClick}> Clear </Buttons>
                        </div>
                    </div>
                    {showStockSummeryReport && <StockSummeryDoc selectedBranch={selectedBranch} onClose={handleCloseDoc} />}
                    {showUpcomingExpiryReport && <UpcomingExpDoc selectedBranch={selectedBranch} onClose={handleCloseDoc}/>}
                </div>
            </Layout>
        </>
    );
};
