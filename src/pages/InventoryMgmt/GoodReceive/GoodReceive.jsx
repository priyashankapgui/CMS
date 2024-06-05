import React, { useState, useEffect } from 'react';
import Layout from "../../../Layout/Layout";
import axios from 'axios';
import "./GoodReceive.css";
import InputField from "../../../Components/InputField/InputField";
import TableWithPagi from '../../../Components/Tables/TableWithPagi';
import Buttons from '../../../Components/Buttons/SquareButtons/Buttons';
import InputLabel from "../../../Components/Label/InputLabel";
import InputDropdown from "../../../Components/InputDropdown/InputDropdown";
import RoundButtons from '../../../Components/Buttons/RoundButtons/RoundButtons';
import DatePicker from '../../../Components/DatePicker/DatePicker';
import SearchBar from '../../../Components/SearchBar/SearchBar'
import { useNavigate } from 'react-router-dom';
import { BsEye } from "react-icons/bs";
import { RiPrinterFill } from "react-icons/ri";
import SubSpinner from '../../../Components/Spinner/SubSpinner/SubSpinner';

export const GoodReceive = () => {

    const [grnData, setGrnData] = useState([]);
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const handleNewButtonClick = () => {
        navigate('/good-receive/new');
    }

    useEffect(() => {
        const fetchGrnData = async () => {
            try {
                const response = await axios.get("http://localhost:8080/grn");
                setGrnData(response.data); // Set the fetched GRN data
                setLoading(false);
            } catch (error) {
                console.error('Error fetching GRN data:', error);
                setLoading(false);
            }
        };

        fetchGrnData();
    }, []);

    useEffect(() => {
        fetchBranches();
    }, []);

    const fetchBranches = async () => {
        try {
            const response = await axios.get('http://localhost:8080/branches');
            setBranches(response.data);
        } catch (error) {
            console.error('Error fetching branches:', error);
        }
    };

    const handleDropdownChange = (value) => {
        setSelectedBranch(value);
        console.log('Selected Drop Down Value:', value);
    };

    return (
        <>
            <div className="top-nav-blue-text">
                <h4>Good Receive Note</h4>
            </div>
            <Layout>
                <div className="reg-goodReceives-bodycontainer">
                    <div className="goodReceive-filter-container">
                        <div className="goodReceive-content-top1">
                            <div className="branchField">
                                <InputLabel htmlFor="branchName" color="#0377A8">Branch</InputLabel>
                                <InputDropdown
                                    id="branchName"
                                    name="branchName"
                                    editable={true}
                                    options={branches.map(branch => branch.branchName)}
                                    onChange={handleDropdownChange}
                                />
                            </div>
                            <div className="datePickerFrom">
                                <InputLabel htmlFor="From" color="#0377A8">From</InputLabel>
                                <DatePicker id="dateFrom" name="dateFrom" />
                            </div>
                            <div className="datePickerTo">
                                <InputLabel htmlFor="To" color="#0377A8">To</InputLabel>
                                <DatePicker id="dateTo" name="dateTo" />
                            </div>
                            <div className="grnNoField">
                                <InputLabel htmlFor="grnNo" color="#0377A8">GRN No</InputLabel>
                                <InputField type="text" id="grnNo" name="grnNo" editable={true} width="250px" />
                            </div>
                            <div className="invoiceNoField">
                                <InputLabel htmlFor="invoiceNo" color="#0377A8">Invoice No</InputLabel>
                                <InputField type="text" id="invoiceNo" name="invoiceNo" editable={true} width="250px" />
                            </div>
                        </div>
                        <div className="goodReceive-content-top2">
                            <div className="productsField">
                                <InputLabel htmlFor="productIdName" color="#0377A8">Product ID / Name</InputLabel>
                                <SearchBar />
                            </div>
                            <div className="suppliersField">
                                <InputLabel htmlFor="supplier" color="#0377A8">Supplier ID / Name</InputLabel>
                                <SearchBar />
                            </div>
                        </div>
                        <div className="goodReceive-BtnSection">
                            <Buttons type="submit" id="search-btn" style={{ backgroundColor: "#23A3DA", color: "white" }}> Search </Buttons>
                            <Buttons type="submit" id="clear-btn" style={{ backgroundColor: "white", color: "#EB1313" }}> Clear </ Buttons>
                            <Buttons type="submit" id="new-btn" style={{ backgroundColor: "white", color: "#23A3DA" }} onClick={handleNewButtonClick}> New + </Buttons>
                        </div>
                    </div>
                    <div className="goodReceive-content-middle">
                        {loading ? (
                            <div><SubSpinner /></div>
                        ) : (
                            <TableWithPagi
                                columns={['GRN No', 'Created At', 'Branch', 'Supplier', 'Invoice No', 'Submitted By', '']}
                                rows={grnData.map((grn, index) => ({
                                    'GRN No': grn.GRN_NO,
                                    'Created At': grn.createdAt,
                                    'Branch': grn.branchName,
                                    'Supplier': grn.supplierName,
                                    'Invoice No': grn.invoiceNo,
                                    'Submitted By': grn.submittedBy,
                                    'Action': (
                                        <div style={{ display: "flex", gap: "0.5em" }}>
                                            <RoundButtons
                                                id={`eyeViewBtn-${index}`}
                                                type="submit"
                                                name={`eyeViewBtn-${index}`}
                                                icon={<BsEye />}
                                            />
                                            <RoundButtons
                                                id={`printBtn-${index}`}
                                                type="submit"
                                                name={`printBtn-${index}`}
                                                icon={<RiPrinterFill />}
                                            />
                                        </div>
                                    )
                                }))}
                            />
                        )}
                    </div>
                </div>
            </Layout>
        </>
    );
};

export default GoodReceive;
