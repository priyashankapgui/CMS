import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from "../../../Layout/Layout";
import "./Suppliers.css";
import InputField from "../../../Components/InputField/InputField";
import SearchBar from '../../../Components/SearchBar/SearchBar';
import InputLabel from "../../../Components/Label/InputLabel";
import TableWithPagi from '../../../Components/Tables/TableWithPagi';
import Buttons from '../../../Components/Buttons/SquareButtons/Buttons';
import DeletePopup from "../../../Components/PopupsWindows/DeletePopup";
import AddNewSupplierPopup from './AddNewSupplierPopup';
import UpdateSupplierPopup from './UpdateSupplierPopup';
import SubSpinner from '../../../Components/Spinner/SubSpinner/SubSpinner';
import CustomAlert from '../../../Components/Alerts/CustomAlert/CustomAlert';

const suppliersApiUrl = process.env.REACT_APP_SUPPLIERS_API || "http://localhost:8080/suppliers";

export const Suppliers = () => {
    const navigate = useNavigate();
    const [suppliersData, setSuppliersData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSupplier, setSelectedSupplier] = useState('');
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertConfig, setAlertConfig] = useState({});
    const [editingSupplier, setEditingSupplier] = useState(null); // State to hold the supplier being edited

    const fetchSuppliersSuggestions = async (query) => {
        try {
            const response = await axios.get(`${suppliersApiUrl}?search=${query}`);
            return response.data.map(supplier => ({
                id: supplier.supplierId,
                displayText: `${supplier.supplierId} ${supplier.supplierName}`
            }));
        } catch (error) {
            console.error('Error fetching supplier suggestions:', error);
            return [];
        }
    };

    const fetchSupplierById = async (supplierId) => {
        setLoading(true);
        try {
            const response = await axios.get(`${suppliersApiUrl}/${supplierId}`);
            setSuppliersData([response.data]);
        } catch (error) {
            console.error('Error fetching supplier by ID:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClearBtn = () => {
        setSelectedSupplier('');
        setSuppliersData([]);
    };

    const handleSearch = () => {
        if (selectedSupplier) {
            const supplierId = selectedSupplier.split(' ')[0];
            fetchSupplierById(supplierId);
        }
    };

    useEffect(() => {
        const fetchSuppliersData = async () => {
            try {
                const response = await axios.get(suppliersApiUrl);
                setSuppliersData(response.data);
            } catch (error) {
                console.error('Error fetching suppliers:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSuppliersData();
    }, []);

    const handleDelete = async (supplierId) => {
        setLoading(true);
        try {
            await axios.delete(`${suppliersApiUrl}/${supplierId}`);
            const updatedSupplierData = suppliersData.filter(supplier => supplier.supplierId !== supplierId);
            setSuppliersData(updatedSupplierData);
            console.log("Supplier deleted successfully");

            setAlertConfig({
                severity: 'warning',
                title: 'Delete',
                message: 'Supplier deleted successfully!',
                duration: 3000
            });
            setAlertVisible(true);
        } catch (error) {
            console.error('Error deleting Supplier:', error);

            setAlertConfig({
                severity: 'error',
                title: 'Error',
                message: 'Failed to delete Supplier.',
                duration: 3000
            });
            setAlertVisible(true);
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (supplier) => {
        setEditingSupplier(supplier); // Set the supplier to be edited
    };

    return (
        <>
            {alertVisible && (
                <CustomAlert
                    severity={alertConfig.severity}
                    title={alertConfig.title}
                    message={alertConfig.message}
                    duration={alertConfig.duration}
                    onClose={() => setAlertVisible(false)}
                />
            )}
            <div className="top-nav-blue-text">
                <h4>Suppliers</h4>
            </div>
            <Layout>
                <div className="reg-suppliers-bodycontainer">
                    <div className="supplier-filter-container">
                        <h3 className="reg-supplier-title">Registered Suppliers</h3>
                        <div className="supplier-content-top">
                            <div className="supplierField">
                                <InputLabel htmlFor="supplier" color="#0377A8">Supplier ID / Name</InputLabel>
                                <SearchBar
                                    searchTerm={selectedSupplier}
                                    setSearchTerm={setSelectedSupplier}
                                    onSelectSuggestion={(suggestion) => setSelectedSupplier(suggestion.displayText)}
                                    fetchSuggestions={fetchSuppliersSuggestions}
                                />
                            </div>
                        </div>
                        <div className="s-BtnSection">
                            <Buttons type="submit" id="search-btn" style={{ backgroundColor: "#23A3DA", color: "white" }} onClick={handleSearch}> Search </Buttons>
                            <Buttons type="submit" id="clear-btn" style={{ backgroundColor: "white", color: "#EB1313" }} onClick={handleClearBtn}> Clear </ Buttons>
                            <AddNewSupplierPopup />
                        </div>
                    </div>
                    <div className="supplier-content-middle">
                        {loading ? (
                            <div> <SubSpinner /></div>
                        ) : (
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
                                            <UpdateSupplierPopup supplierId={supplier.supplierId} /> {/* Pass supplier data */}
                                            <DeletePopup handleDelete={() => handleDelete(supplier.supplierId)} />
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

export default Suppliers;
