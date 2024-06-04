import Layout from "../../../Layout/Layout";
import axios from 'axios';
import "./GoodReceive.css";
import InputField from "../../../Components/InputField/InputField";
import TableWithPagi from '../../../Components/Tables/TableWithPagi';
import Buttons from '../../../Components/Buttons/SquareButtons/Buttons';
import InputLabel from "../../../Components/Label/InputLabel";
import InputDropdown from "../../../Components/InputDropdown/InputDropdown";
import dropdownOptions from '../../../Components/Data.json';
import DeletePopup from "../../../Components/PopupsWindows/DeletePopup";
import { Icon } from "@iconify/react";
import DatePicker from '../../../Components/DatePicker/DatePicker';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export const GoodReceive = () => {

    const [grnData, setGrnData] = useState([]);
    const navigate = useNavigate();

    const handleButtonClick = () => {
        navigate('/good-receive/new');
    }

    useEffect(() => {
        const fetchGrnData = async () => {
            try {
                const response = await axios.get("http://localhost:8080/grn");
                setGrnData(response.data); // Set the fetched GRN data
            } catch (error) {
                console.error('Error fetching GRN data:', error);
            }
        };

        fetchGrnData();
    }, []);
    

    return (
        <>
            <div className="top-nav-blue-text">
                <h4>Good Receive Note</h4>
            </div>
            <Layout>
                <div className="reg-goodReceives-bodycontainer">
                    <div className="goodReceive-filter-container">
                        <div style={{ borderBottom: 'none' }} className="goodReceive-content-top">
                            <div className="datePickerFrom">
                                <InputLabel htmlFor="From" color="#0377A8">From</InputLabel>
                                <DatePicker id="dateFrom" name="dateFrom" />
                            </div>
                            <div className="datePickerTo">
                                <InputLabel htmlFor="To" color="#0377A8">To</InputLabel>
                                <DatePicker id="dateTo" name="dateTo" />
                            </div>
                            <div className="branchField">
                                <InputLabel htmlFor="branchName" color="#0377A8">Branch Name</InputLabel>
                                <InputDropdown id="branchName" name="branchName" editable={true} options={dropdownOptions.dropDownOptions.branchOptions} />
                            </div>
                            <div className="grnNoField">
                                <InputLabel htmlFor="grnNo" color="#0377A8">GRN No</InputLabel>
                                <InputField type="text" id="grnNo" name="grnNo" editable={true} width="250px" />
                            </div>
                        </div>
                        <div className="goodReceive-content-top">
                            <div className="invoiceNoField">
                                <InputLabel htmlFor="invoiceNo" color="#0377A8">Invoice No</InputLabel>
                                <InputField type="text" id="invoiceNo" name="invoiceNo" editable={true} width="250px" />
                            </div>
                            <div className="productsField">
                                <InputLabel htmlFor="productIdName" color="#0377A8">Product ID / Name</InputLabel>
                                <InputField type="text" id="productIdName" name="productIdName" editable={true} width="250px" />
                            </div>
                            <div className="suppliersField">
                                <InputLabel htmlFor="supplier" color="#0377A8">Supplier ID / Name</InputLabel>
                                <InputField type="text" id="supplier" name="supplier" editable={true} />
                            </div>
                        </div>
                        <div className="s-BtnSection">
                            <Buttons type="submit" id="search-btn" style={{ backgroundColor: "#23A3DA", color: "white" }}> Search </Buttons>
                            <Buttons type="submit" id="clear-btn" style={{ backgroundColor: "white", color: "#EB1313" }}> Clear </Buttons>
                            <Buttons type="submit" id="new-btn" style={{ backgroundColor: "white", color: "#23A3DA" }} onClick={handleButtonClick}> New + </Buttons>
                        </div>
                    </div>
                    <div className="goodReceive-content-middle">
                        <TableWithPagi
                            columns={['GRN No', 'Created At', 'Branch', 'Supplier', 'Invoice No', 'Submitted By', '']}
                            rows={grnData.map(grn => ({
                                'GRN No': grn.GRN_NO,
                                'Created At': grn.createdAt,
                                'Branch': grn.branchName,
                                'Supplier': grn.supplierName,
                                'Invoice No': grn.invoiceNo,
                                'Submitted By': grn.submittedBy,
                                'Action': (
                                    <div style={{ display: "flex", gap: "0.5em" }}>
                                        <Icon icon="bitcoin-icons:edit-outline" style={{ fontSize: '24px' }} />
                                        <DeletePopup />
                                    </div>
                                )
                            }))}
                        />
                    </div>
                </div>
            </Layout>
        </>
    );
};
