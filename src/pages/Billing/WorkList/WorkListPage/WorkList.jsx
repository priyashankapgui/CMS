import React, { useState } from 'react';
import Layout from "../../../../Layout/Layout";
import "./WorkList.css";
import InputLabel from "../../../../Components/Label/InputLabel";
import InputDropdown from "../../../../Components/InputDropdown/InputDropdown";
import DatePicker from "../../../../Components/DatePicker/DatePicker"
import Buttons from "../../../../Components/Buttons/Buttons";
import dropdownOptions from '../../../../Components/Data.json';
import InputField from "../../../../Components/InputField/InputField";
import { Link } from "react-router-dom"
import { BsEye } from "react-icons/bs";

export const WorkList = () => {

    const [clickedLink, setClickedLink] = useState('Billed');

    const handleLinkClick = (linkText) => {
        setClickedLink(linkText);
    };

    return (
        <>
            <div className="work-list">
                <h4>Work List</h4>
            </div>
            <Layout>
                <div className="worklist-filter-container">
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
                                to="/work-list/returnbill"
                                onClick={() => handleLinkClick('Returned')}
                            >
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
                            <tr>
                                <td>Gal-B24022091</td>
                                <td>20-12-2023  20:58</td>
                                <td>Galle</td>
                                <td></td>
                                <td>Completed</td>
                                <td>Pramu Alwis</td>
                                <td>Card</td>
                                <td><BsEye /></td>
                            </tr>
                        </tbody>
                    </table>

                </div>
            </Layout>
        </>
    );
};
