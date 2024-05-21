import React, { useState } from 'react';
import Layout from "../../../Layout/Layout";
import "./Reports.css";
import DatePicker from "../../../Components/DatePicker/DatePicker"
import Buttons from "../../../Components/Buttons/SquareButtons/Buttons";
import InputLabel from "../../../Components/Label/InputLabel";
import InputDropdown from "../../../Components/InputDropdown/InputDropdown";
import dropdownOptions from '../../../Components/Data.json';
import repoTypes from '../../../Components/Data.json';
import { Link } from "react-router-dom"

export const Reports = () => {
    const [clickedLink, setClickedLink] = useState('Generate Reports');

    const handleLinkClick = (linkText) => {
        setClickedLink(linkText);
    };
    const handleDropdownChange = (value) => {
        console.log('Selected Drop Down Value:', value);
    };

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
                                <InputLabel for="branchName" color="#0377A8">Branch Name</InputLabel>
                                <InputDropdown id="branchName" name="branchName" editable={true} options={dropdownOptions.dropDownOptions.branchOptions} onChange={handleDropdownChange} />
                            </div>
                            <div className="repoTypeField">
                                <InputLabel for="repoType" color="#0377A8">Report Type</InputLabel>
                                <InputDropdown id="repoType" name="repoType" editable={true} options={repoTypes.repoTypes} onChange={handleDropdownChange}  />
                            </div>
                            <div className="dateField">
                                <InputLabel for="from-date" color="#0377A8">From</InputLabel>
                                <DatePicker />
                            </div>
                            <div className="dateField">
                                <InputLabel for="to-date" color="#0377A8">To</InputLabel>
                                <DatePicker />
                            </div>
                        </div>
                        <div className="btnSection">
                            <Buttons type="submit" id="view-btn" style={{ backgroundColor: "#23A3DA", color: "white" }}> View </Buttons>
                            <Buttons type="submit" id="print-btn" style={{ backgroundColor: "#23A3DA", color: "white" }}> Print </Buttons>
                            <Buttons type="submit" id="clear-btn" style={{ backgroundColor: "#fafafa", color: "red" }}> Clear </Buttons>
                        </div>
                    </div>

                </div>

            </Layout>
        </>
    );
};