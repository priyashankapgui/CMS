import React, { useState } from 'react';
import Layout from '../../../../Layout/Layout';
import './WorkList.css';
import InputLabel from '../../../../Components/Label/InputLabel';
import InputDropdown from '../../../../Components/InputDropdown/InputDropdown';
import DatePicker from '../../../../Components/DatePicker/DatePicker';
import Buttons from '../../../../Components/Buttons/SquareButtons/Buttons';
import InputField from '../../../../Components/InputField/InputField';
import { Link } from 'react-router-dom';
import { BsEye } from 'react-icons/bs';
import jsonData from '../../../../Components/Data.json';
import RoundButtons from '../../../../Components/Buttons/RoundButtons/RoundButtons';

export const WorkList = () => {
    const [clickedLink, setClickedLink] = useState('Billed');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [branch, setBranch] = useState('');
    const [billNo, setBillNo] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [filteredData, setFilteredData] = useState(jsonData.worklistTableData);

    const handleLinkClick = (linkText) => {
        setClickedLink(linkText);
    };

    const handleStartDateChange = (date) => {
        setStartDate(date);
    };

    const handleEndDateChange = (date) => {
        setEndDate(date);
    };

    const handleSearch = () => {
        let filtered = jsonData.worklistTableData;

        if (branch) {
            filtered = filtered.filter(item => item.branch === branch);
        }

        if (startDate && endDate) {
            filtered = filtered.filter(item => {
                const itemDate = new Date(item.billedAt);
                return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
            });
        }

        if (billNo) {
            filtered = filtered.filter(item => item.billNo.includes(billNo));
        }

        if (customerName) {
            filtered = filtered.filter(item => item.customerName.toLowerCase().includes(customerName.toLowerCase()));
        }

        setFilteredData(filtered);
    };

    const handleClear = () => {
        setBranch('');
        setStartDate('');
        setEndDate('');
        setBillNo('');
        setCustomerName('');
        setFilteredData(jsonData.worklistTableData);
    };

    return (
        <>
            <div className="top-nav-blue-text">
                <h4>Work List - Billed</h4>
            </div>
            <Layout>
                <div className="worklist-filter-container">
                    <div className="W-Content1">
                        <div className="branchField">
                            <InputLabel htmlFor="branchName" color="#0377A8">Branch</InputLabel>
                            <InputDropdown
                                id="branchName"
                                name="branchName"
                                editable={true}
                                options={jsonData.dropDownOptions.branchOptions}
                                value={branch}
                                onChange={(e) => setBranch(e.target.value)}
                            />
                        </div>
                        <div className="dateFieldFrom">
                            <InputLabel htmlFor="from-date" color="#0377A8">From</InputLabel>
                            <DatePicker onDateChange={handleStartDateChange} />
                        </div>
                        <div className="dateFieldTo">
                            <InputLabel htmlFor="to-date" color="#0377A8">To</InputLabel>
                            <DatePicker onDateChange={handleEndDateChange} />
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
                                onChange={(e) => setBillNo(e.target.value)}
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
                                onChange={(e) => setCustomerName(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="WorklistBtnSection">
                        <Buttons type="button" id="search-btn" style={{ backgroundColor: "#23A3DA", color: "white" }} onClick={handleSearch}> Search </Buttons>
                        <Buttons type="button" id="clear-btn" style={{ backgroundColor: "white", color: "#EB1313" }} onClick={handleClear}> Clear </ Buttons>
                    </div>
                </div>
                <div className="worklist-middle">
                    <div className="linkActions-billed">
                        <div className={clickedLink === 'Billed' ? 'clicked' : ''}>
                            <Link to="/work-list" onClick={() => handleLinkClick('Billed')}>
                                Billed
                            </Link>
                        </div>
                        <div className={clickedLink === 'Returned' ? 'clicked' : ''}>
                            <Link to="/work-list/returnbill-list" onClick={() => handleLinkClick('Returned')}>
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
                            {filteredData.map((row, index) => (
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

export default WorkList;
