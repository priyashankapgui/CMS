import React, { useState } from 'react';
import Layout from "../../../Layout/Layout";
import "./Analysis.css";
import InputLabel from "../../../Components/Label/InputLabel";
import InputDropdown from "../../../Components/InputDropdown/InputDropdown";
import DatePicker from "../../../Components/DatePicker/DatePicker"
import Buttons from "../../../Components/Buttons/Buttons";
import dropdownOptions from '../../../Components/Data.json';
import { Link } from "react-router-dom";
import SalesChart from '../../../Components/Charts/SalesChart';

export const Analysis = () => {
    const [clickedLink, setClickedLink] = useState('Analysis'); 

    const handleLinkClick = (linkText) => {
        setClickedLink(linkText);
    };

    return (
        <>
            <div className="analysis">
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
                                    <InputLabel for="branchName" color="#0377A8">Branch</InputLabel>
                                    <InputDropdown id="branchName" name="branchName" editable={true} options={dropdownOptions.dropDownOptions.branchOptions} />
                                </div>
                                <div className="dateField">
                                    <InputLabel for="date" color="#0377A8">Date</InputLabel>
                                    <DatePicker />
                                </div>
                            </div>
                            <Buttons type="submit" id="view-btn" style={{ backgroundColor: "#23A3DA", color: "white" }}> View </Buttons>
                        </div>
                    </div>
                    <div className="reportRightContent">
                        <h3>Total Sales Amount:</h3>
                    </div>
                </div>
                <div className="reportingMiddle">
                    <SalesChart/>
                </div>
            </Layout>
        </>
    );
};

export default Analysis;