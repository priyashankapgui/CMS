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
import  { useState, useEffect } from 'react';

export const GoodReceive = () => {
 
    const [suppliersData, setSuppliersData] = useState([]);
    const navigate = useNavigate();

    const handleButtonClick = () => {
        navigate('/good-receive/new');
    }

    //////////////////////////need to be change/////////////////////////////
    useEffect(() => {
        const fetchSuppliersData = async () => {
            try {
                const response = await axios.get("http://localhost:8080/suppliers");
                setSuppliersData(response.data); // Set the fetched supplier data
            } catch (error) {
                console.error('Error fetching suppliers:', error);
            }
        };

        fetchSuppliersData();
    }, []);
    ///////////////////////////////////////////////////////////////////////////

    // const DeletePopup = ({ supplierId }) => {
    //     const handleDelete = async () => {
    //         try {
    //             await handleDeleteSupplier(supplierId);
    //             // Optionally, you can handle success or notify the user
    //             console.log('Supplier deleted successfully');
    //         } catch (error) {
    //             console.error('Error deleting supplier:', error);
    //             // Optionally, you can handle errors or notify the user
    //         }
    //     };
    // };


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
                                <InputLabel for="From" color="#0377A8">From</InputLabel>
                                <DatePicker id="dateFrom" name="dateFrom"></DatePicker>
                            </div>
                            <div className="datePickerTo">
                                <InputLabel for="To" color="#0377A8">To</InputLabel>
                                <DatePicker id="dateTo" name="dateTo"></DatePicker>
                            </div>
                            <div className="branchField">
                                <InputLabel for="branchName" color="#0377A8">Branch Name</InputLabel>
                                <InputDropdown id="branchName" name="branchName" editable={true} options={dropdownOptions.dropDownOptions.branchOptions} />
                            </div>
                            <div className="GRN NoField">
                                <InputLabel htmlFor="GRN No" color="#0377A8">GRN No</InputLabel>
                                <InputField type="text" id="GRN No" name="GRN No" editable={true} width="250px" />
                            </div>
                        </div>
                        <div className="goodReceive-content-top">
                            <div className="Invoice NoField">
                                <InputLabel htmlFor="Invoice No" color="#0377A8">Invoice No</InputLabel>
                                <InputField type="text" id="Invoice No" name="Invoice No" editable={true} width="250px" />
                            </div>
                            <div className="productsField">
                                <InputLabel htmlFor="Product ID / Name" color="#0377A8">Product ID / Name</InputLabel>
                                <InputField type="text" id="Product ID / Name" name="Product ID / Name" editable={true} width="250px" />
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
                            //////////////////////////need to be change/////////////////////////////
                            rows={suppliersData.map(supplier => ({
                                'Supplier ID': supplier.supplierId,
                                'Supplier Name': supplier.supplierName,
                                'Reg No': supplier.regNo,
                                'Email': supplier.email,
                                'Address': supplier.address,
                                'Contact No': supplier.contactNo,
                                'Action': (
                                    <div style={{ display: "flex", gap: "0.5em" }}>
                                        <Icon icon="bitcoin-icons:edit-outline"
                                            style={{ fontSize: '24px' }} />
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