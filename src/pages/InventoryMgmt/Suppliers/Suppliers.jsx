import React, { useState, useEffect }  from 'react';
import axios from 'axios';
import Layout from "../../../Layout/Layout";
import "./Suppliers.css";
import InputField from "../../../Components/InputField/InputField";
import TableWithPagi from '../../../Components/Tables/TableWithPagi';
import Buttons from '../../../Components/Buttons/Buttons';
import InputLabel from "../../../Components/Label/InputLabel";
import InputDropdown from "../../../Components/InputDropdown/InputDropdown";
import dropdownOptions from '../../../Components/Data.json';
import DeletePopup from "../../../Components/PopupsWindows/DeletePopup";
import { Icon } from "@iconify/react";

export const Suppliers = () => {

    const [suppliersData, setSuppliersData] = useState([]);

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
        <div className="suppliers">
            <h4>Suppliers</h4>
        </div>
        <Layout>
            <div className="reg-suppliers-bodycontainer">
                    <div className="supplier-filter-container">
                        <h3 className="reg-supplier-title">Registered Suppliers</h3>
                        <div className="supplier-content-top">
                            <div className="branchField">
                                <InputLabel for="branchName" color="#0377A8">Branch</InputLabel>
                                <InputDropdown id="branchName" name="branchName" editable={true} options={dropdownOptions.dropDownOptions.branchOptions} />
                            </div>
                            <div className="supplierField">
                                <InputLabel htmlFor="supplier" color="#0377A8">SupplierID / Name</InputLabel>
                                <InputField type="text" id="supplier" name="supplier" editable={true} width="250px" />
                            </div>
                            <div className="productField">
                                <InputLabel htmlFor="product" color="#0377A8">Product ID / Name</InputLabel>
                                <InputField type="text" id="billNo" name="billNo" editable={true} />
                            </div>
                        </div>
                        <div className="s-BtnSection">
                            <Buttons type="submit" id="search-btn" style={{backgroundColor: "#23A3DA", color: "white" }}> Search </Buttons>
                            <Buttons type="submit" id="clear-btn" style={{ backgroundColor: "white", color: "#EB1313" }}> Clear </Buttons>
                            <Buttons type="submit" id="new-btn" style={{ backgroundColor: "white", color: "#23A3DA" }}> New + </Buttons>
                        </div>
                    </div>
                    <div className="supplier-content-middle">
                        <TableWithPagi
                            columns={['Supplier ID', 'Supplier Name', 'Reg No', 'Email', 'Address', 'Contact No', 'Action']}
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
