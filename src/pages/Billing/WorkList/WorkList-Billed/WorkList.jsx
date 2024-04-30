import React, { useState } from 'react';
import Layout from "../../../../Layout/Layout";
import "./WorkList.css";
import InputLabel from "../../../../Components/Label/InputLabel";
import InputDropdown from "../../../../Components/InputDropdown/InputDropdown";
import DatePicker from "../../../../Components/DatePicker/DatePicker"
import Buttons from "../../../../Components/Buttons/SquareButtons/Buttons";
import InputField from "../../../../Components/InputField/InputField";
import { Link } from "react-router-dom"
import { BsEye } from "react-icons/bs";
import jsonData from "../../../../Components/Data.json";
import RoundButtons from '../../../../Components/Buttons/RoundButtons/RoundButtons';

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
                    <div className="W-Content1">
                        <div className="branchField">
                            <InputLabel for="branchName" color="#0377A8">Branch</InputLabel>
                            <InputDropdown id="branchName" name="branchName" editable={true} options={jsonData.dropDownOptions.branchOptions} />
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
                            <InputField type="text" id="billNo" name="billNo" editable={true} width="25em" />
                        </div>
                    </div>
                    <div className="WorklistBtnSection">
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
                                to="/work-list/returnbill-list"
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
                            {jsonData.worklistTableData.map((row, index) => (
                                <tr key={index}>
                                    <td>{row.billNo}</td>
                                    <td>{row.billedAt}</td>
                                    <td>{row.branch}</td>
                                    <td>{row.customerName}</td>
                                    <td>{row.status}</td>
                                    <td>{row.billedBy}</td>
                                    <td>{row.paymentMethod}</td>
                                    <td>
                                        <Link to={`/work-list/viewbill/${row.billNo}`}>
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
    );
};

