import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from "../../../Layout/Layout";
import "./Suppliers.css";
import SearchBar from '../../../Components/SearchBar/SearchBar';
import InputLabel from "../../../Components/Label/InputLabel";
import TableWithPagi from '../../../Components/Tables/TableWithPagi';
import Buttons from '../../../Components/Buttons/SquareButtons/Buttons';
import DeletePopup from "../../../Components/PopupsWindows/DeletePopup";
import AddNewSupplierPopup from './AddNewSupplierPopup';
import UpdateSupplierPopup from "./UpdateSupplierPopup";
import SubSpinner from '../../../Components/Spinner/SubSpinner/SubSpinner';
import CustomAlert from '../../../Components/Alerts/CustomAlert/CustomAlert';

const suppliersApiUrl = process.env.REACT_APP_SUPPLIERS_API;

export const Suppliers = () => {
    const navigate = useNavigate();
    const [suppliersData, setSuppliersData] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state
    const [selectedSupplier, setSelectedSupplier] = useState('');
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertConfig, setAlertConfig] = useState({});

    const fetchSuppliersSuggestions = async (query) => {
        try {
            setLoading(true);
            const response = await axios.get(`${suppliersApiUrl}?search=${query}`);
            return response.data.data.map(supplier => ({
                id: supplier.supplierId,
                displayText: `${supplier.supplierId} ${supplier.supplierName}`
            }));
            
        } catch (error) {
            console.error('Error fetching suppliers suggestions:', error);
            return [];
        }
    };

    const fetchSupplierById = async (supplierId) => {
        try {
            const response = await axios.get(`${suppliersApiUrl}/${supplierId}`);
            setSuppliersData([response.data.data]); // Set the fetched supplier data
            setLoading(false);
        } catch (error) {
            console.error('Error fetching supplier by ID:', error);
            setLoading(false);
        }
    };

    const handleClearBtn = () => {
        setSelectedSupplier('');
        setSuppliersData([]);
        // window.location.reload();
        
    };

    const handleSearch = async () => {
        if (selectedSupplier) {
            const supplierId = selectedSupplier.split(' ')[0];
            await fetchSupplierById(supplierId);
        }
    };

    useEffect(() => {
        const fetchSuppliersData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(suppliersApiUrl);
                console.log('Fetched suppliers data:', response.data); // Debugging log
                setSuppliersData(response.data.data); // Set the fetched supplier data
                setLoading(false);
            } catch (error) {
                console.error('Error fetching suppliers:', error);
                setLoading(false);
            }
        };

        fetchSuppliersData();
        
        const storedAlertConfig = localStorage.getItem('alertConfig');
        if (storedAlertConfig) {
            setAlertConfig(JSON.parse(storedAlertConfig));
            setAlertVisible(true);
            localStorage.removeItem('alertConfig');
        }
    }, []);

    const handleDelete = async (supplierId) => {
        setLoading(true); // Set loading to true while deleting
        try {
            // Send DELETE request to the backend to delete the supplier
            await axios.delete(`${suppliersApiUrl}/${supplierId}`);
            // Update the state to reflect the deletion
            const updatedSupplierData = suppliersData.filter(supplier => supplier.supplierId !== supplierId);
            setSuppliersData(updatedSupplierData);
            console.log("Supplier deleted successfully");

            const alertData = {
                severity: 'warning',
                title: 'Delete',
                message: 'Supplier deleted successfully!',
                duration: 3000
            };
            localStorage.setItem('alertConfig', JSON.stringify(alertData));
            navigate('/Suppliers');
            window.location.reload();
        } catch (error) {
            console.error('Error deleting supplier:', error);

            const alertData = {
                severity: 'error',
                title: 'Error',
                message: 'Failed to delete supplier.',
                duration: 3000
            };
            localStorage.setItem('alertConfig', JSON.stringify(alertData));
            navigate('/adjust-branch');
            window.location.reload();
        } finally {
            setLoading(false); // After deletion, set loading to false
        }
    };

    const handleUpdatePopup = (supplierId) => {
        navigate(`/Suppliers/${supplierId}`);
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
                                    onSelectSuggestion={(suggestion) => setSelectedSupplier(`${suggestion.displayText}`)}
                                    fetchSuggestions={fetchSuppliersSuggestions}
                                />
                            </div>
                            </div>
                            <div className="s-BtnSection">
                                <Buttons type="submit" id="search-btn" style={{ backgroundColor: "#23A3DA", color: "white" }} onClick={handleSearch}> Search </Buttons>
                                <Buttons type="submit" id="clear-btn" style={{ backgroundColor: "white", color: "#EB1313" }} onClick={handleClearBtn}> Clear </Buttons>
                                <AddNewSupplierPopup />
                            </div>
                        
                    </div> 
                    <div className="supplier-content-middle">
                        {loading ? (
                            <div><SubSpinner/></div>
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
                                             <UpdateSupplierPopup supplierId={supplier.supplierId} />
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