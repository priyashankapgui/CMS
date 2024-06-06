import React, { useState } from 'react';
import './ReturnBillList.css';
import Layout from "../../../../Layout/Layout";
import { Link } from "react-router-dom";
import Buttons from "../../../../Components/Buttons/SquareButtons/Buttons";
import InputField from "../../../../Components/InputField/InputField";
import InputLabel from "../../../../Components/Label/InputLabel";
import DatePicker from "../../../../Components/DatePicker/DatePicker";
import InputDropdown from "../../../../Components/InputDropdown/InputDropdown";
import dropdownOptions from '../../../../Components/Data.json';
import { BsEye } from "react-icons/bs";
import jsonData from "../../../../Components/Data.json";
import RoundButtons from '../../../../Components/Buttons/RoundButtons/RoundButtons';

export const ReturnBillList = () => {

    const [clickedLink, setClickedLink] = useState('Returned');

    const handleLinkClick = (linkText) => {
        setClickedLink(linkText);
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
                            <InputDropdown id="branchName" name="branchName" editable={true} options={dropdownOptions.dropDownOptions.branchOptions} />
                        </div>
                        <div className="dateFieldFrom">
                            <InputLabel for="to-date" color="#0377A8">To</InputLabel>
                            <DatePicker />
                        </div>
                        <div className="dateFieldTo">
                            <InputLabel for="from-date" color="#0377A8">From</InputLabel>
                            <DatePicker />
                        </div>
                        <div className="billNoField">
                            <InputLabel htmlFor="billNo" color="#0377A8">Bill No</InputLabel>
                            <InputField type="text" id="billNo" name="billNo" editable={true} width="200px" />
                        </div>
                        {/* <div className="rtb-billNoField">
                            <InputLabel htmlFor="rtb-billNo" color="#0377A8">RTB No</InputLabel>
                            <InputField type="text" id="rtb-billNo" name="rtb-billNo" editable={true} width="200px" />
                        </div> */}
                        <div className="customerField">
                            <InputLabel htmlFor="customerName" color="#0377A8">Customer Name</InputLabel>
                            <InputField
                                type="text"
                                id="customerName"
                                name="customerName"
                                editable={true}
                                width="210px"
                            />
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
                                <th>Return Bill No</th>
                                <th>Returned At</th>
                                <th>Bill No</th>
                                <th>Branch </th>
                                <th>Customer Name</th>
                                <th>Status</th>
                                <th>Returned By</th>
                                <th>Reason</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {jsonData.ReturnBillListTableData.map((row, index) => (
                                <tr key={index}>
                                    <td>{row.RTBNo}</td>
                                    <td>{row.returnedAt}</td>
                                    <td>{row.billNo}</td>
                                    <td>{row.branch}</td>
                                    <td>{row.customerName}</td>
                                    <td>{row.status}</td>
                                    <td>{row.returnedBy}</td>
                                    <td>{row.reason}</td>
                                    <td>
                                        <Link to={`/work-list/returnbill-list/viewreturnbill/${row.RTBNo}`}>
                                            <RoundButtons
                                                id={`eyeViewBtn-${index}`}
                                                type="submit"
                                                name={`eyeViewBtn-${index}`}
                                                icon={<BsEye />}
                                            />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Layout>
        </>
    )
}