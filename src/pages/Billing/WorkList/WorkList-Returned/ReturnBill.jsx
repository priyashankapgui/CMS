import React, { useState } from 'react';
import './ReturnBill.css';
import Layout from "../../../../Layout/Layout";
import { Link } from "react-router-dom";
import Buttons from "../../../../Components/Buttons/Buttons";
import InputField from "../../../../Components/InputField/InputField";
import InputLabel from "../../../../Components/Label/InputLabel";
import DatePicker from "../../../../Components/DatePicker/DatePicker";
import InputDropdown from "../../../../Components/InputDropdown/InputDropdown";
import dropdownOptions from '../../../../Components/Data.json';


export const ReturnBill = () => {

    const [clickedLink, setClickedLink] = useState('Returned');

    const handleLinkClick = (linkText) => {
        setClickedLink(linkText);
    };

    return (
        <>
            <div className="work-list-return-bill">
                <h4>Worklist - Returned</h4>
            </div>
            <Layout>
                <div className="returnbill-filter-container">
                    <div className="Content1">
                        <div className="branchField">
                            <InputLabel for="branchName" color="#0377A8">Branch</InputLabel>
                            <InputDropdown id="branchName" name="branchName" editable={true} options={dropdownOptions.dropDownOptions.branchOptions} />
                        </div>
                        <div className="dateField">
                            <InputLabel for="to-date" color="#0377A8">To</InputLabel>
                            <DatePicker />
                        </div>
                        <div className="dateField">
                            <InputLabel for="from-date" color="#0377A8">From</InputLabel>
                            <DatePicker />
                        </div>
                        <div className="billNoField">
                            <InputLabel htmlFor="billNo" color="#0377A8">Bill No</InputLabel>
                            <InputField type="text" id="billNo" name="billNo" editable={true} width="200px" />
                        </div>
                        <div className="productField">
                            <InputLabel htmlFor="product" color="#0377A8">Product ID / Name</InputLabel>
                            <InputField type="text" id="billNo" name="billNo" editable={true} />

                        </div>
                    </div>
                    <div className="BtnSection">
                        <Buttons type="submit" id="search-btn" style={{ backgroundColor: "#23A3DA", color: "white" }}> Search </Buttons>
                        <Buttons type="submit" id="clear-btn" style={{ backgroundColor: "white", color: "#EB1313" }}> Clear </Buttons>
                    </div>
                </div>
                <div className="worklist-middle">
                    <div className="linkActions-billed">
                        <div className={clickedLink === 'Billed' ? 'clicked' : ''}>
                            <Link
                                to="/work-list"
                                onClick={() => handleLinkClick('Billed')}
                            >
                                Billed
                            </Link>
                        </div>
                        <div className={clickedLink === 'Returned' ? 'clicked' : ''}>
                            <Link
                                to=""
                                onClick={() => handleLinkClick('Returned')}
                            >
                                Returned
                            </Link>
                        </div>
                    </div>
                    <table className="return-bill-history-table">
                        <thead>
                            <tr>
                                <th>RTB No</th>
                                <th>Bill No</th>
                                <th>Returned At</th>
                                <th>Branch </th>
                                <th>Customer Name</th>
                                <th>Status</th>
                                <th>Returned By</th>
                                <th>Reason</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>

                            </tr>
                        </tbody>
                    </table>
                </div>
            </Layout>
        </>
    )
}