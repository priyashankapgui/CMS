import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import Layout from "../../Layout/Layout";
import "./OnlineOrders.css";
import SearchBar from '../../Components/SearchBar/SearchBar';
import InputLabel from "../../Components/Label/InputLabel";
import BranchDropdown from "../../Components/InputDropdown/BranchDropdown";
import Buttons from "../../Components/Buttons/SquareButtons/Buttons";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import NewOrders from './NewOrders/NewOrders';
import ProcessingOrders from './ProcessingOrders/ProcessingOrders';
import PendingPickup from './PendingPickupOrders/PendingPickupOrders';
import CompletedOrder from './CompletedOrders/CompletedOrders';
import Badge from '@mui/material/Badge';
import { getAllOnlineBills, getOnlineBillByNumber } from '../../Api/OnlineOrders/OnlineOrdersAPI'; 

export const OnlineOrders = () => {
    const [selectedBranch, setSelectedBranch] = useState('');
    const [newOrdersCount, setNewOrdersCount] = useState(0); 
    const [processingOrdersCount, setProcessingOrdersCount] = useState(0);
    const [pickupOrdersCount, setPickupOrdersCount] = useState(0);
    const [tabIndex, setTabIndex] = useState(0); 
    const [searchClicked, setSearchClicked] = useState(false);
    const [searchTermOrderNo, setSearchTermOrderNo] = useState('');
    const [searchTermCustomerName, setSearchTermCustomerName] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);

    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const tab = queryParams.get('tab');
        if (tab === 'completed') {
            setTabIndex(3);
        }
    }, [location]);

    const handleBranchDropdownChange = (value) => {
        setSelectedBranch(value);
    };

    const handleTabSelect = (index) => {
        setTabIndex(index);
    };

    const handleSearchClick = () => {
        setSearchClicked(true);
    };

    const handleClearClick = () => {
        setSelectedBranch('');
        setSearchClicked(false);
        setSearchTermOrderNo('');
        setSearchTermCustomerName('');
        setSelectedOrder(null);
    };
    const fetchSuggestionsByOrderNo = async (term) => {
        try {
            const bills = await getAllOnlineBills();
            return bills
                .filter(bill => bill.onlineBillNo.toLowerCase().includes(term.toLowerCase()))
                .map(bill => ({
                    id: bill.onlineBillNo,
                    displayText: `${bill.onlineBillNo} ${bill.customerName || ''}`.trim()
                }));
        } catch (error) {
            console.error('Error fetching suggestions by order number:', error);
            return [];
        }
    };

    const handleSelectSuggestionByOrderNo = async (suggestion) => {
        try {
            const bill = await getOnlineBillByNumber(suggestion.id);
            setSelectedOrder(bill);
            setSearchTermOrderNo(suggestion.displayText);
            setSearchClicked(true);
            switch (bill.status) {
                case 'New':
                    setTabIndex(0);
                    break;
                case 'Processing':
                    setTabIndex(1);
                    break;
                case 'Pending Pickup':
                    setTabIndex(2);
                    break;
                case 'Completed':
                    setTabIndex(3);
                    break;
                default:
                    setTabIndex(0);
            }
        } catch (error) {
            console.error('Error fetching bill by order number:', error);
        }
    };

    return (
        <>
            <div className="top-nav-blue-text">
                <h4>Online Orders</h4>
            </div>
            <Layout>
                <div className="onlineOrdersInner">
                    <div className="onlineOrderRow1">
                        <div className="onlineOrdersBranch">
                            <InputLabel htmlFor="branchName" color="#0377A8">Branch</InputLabel>
                            <BranchDropdown
                                id="branchName"
                                name="branchName"
                                editable={true}
                                onChange={(e) => handleBranchDropdownChange(e)}
                                addOptions={["All"]}
                            />
                        </div>
                        <div className="orderNo">
                            <InputLabel htmlFor="orderNo" color="#0377A8">Order No</InputLabel>
                            <SearchBar 
                                searchTerm={searchTermOrderNo}
                                setSearchTerm={setSearchTermOrderNo}
                                onSelectSuggestion={handleSelectSuggestionByOrderNo}
                                fetchSuggestions={fetchSuggestionsByOrderNo}
                            />
                        </div>
                        <div className="customerName">
                        </div>
                    </div>
                    <div className="OnlineOrdersBtn">
                        {/* <Buttons type="button" id="search-btn" style={{ backgroundColor: "#23A3DA", color: "white" }} onClick={handleSearchClick}> Search </Buttons> */}
                        <Buttons type="button" id="clear-btn" style={{ backgroundColor: "white", color: "#EB1313" }} onClick={handleClearClick}> Clear </ Buttons>
                    </div>
                </div>
                <Tabs className="OnlineOrdersTabs" selectedIndex={tabIndex} onSelect={handleTabSelect}>
                    <TabList className="OrderStatusTab">
                        <Tab index={0}>
                            New Orders
                            <Badge className="NewtabBadge" badgeContent={newOrdersCount} />
                        </Tab>
                        <Tab index={1}>
                            Processing
                            <Badge className="ProcessingtabBadge" badgeContent={processingOrdersCount}/>
                        </Tab>
                        <Tab index={2}>
                            Pending Pickup
                            <Badge className="PendingtabBadge" badgeContent={pickupOrdersCount}/>
                        </Tab>
                        <Tab index={3}>
                            Completed
                        </Tab>
                    </TabList>

                    <TabPanel>
                        <NewOrders 
                            selectedBranch={selectedBranch} 
                            setNewOrdersCount={setNewOrdersCount} 
                            searchClicked={searchClicked}
                            selectedOrder={selectedOrder}
                        />
                    </TabPanel>
                    <TabPanel>
                        <ProcessingOrders 
                            selectedBranch={selectedBranch} 
                            setProcessingOrdersCount={setProcessingOrdersCount} 
                            searchClicked={searchClicked}
                            onTabChange={setTabIndex}
                            selectedOrder={selectedOrder}
                        />
                    </TabPanel>
                    <TabPanel>
                        <PendingPickup 
                            selectedBranch={selectedBranch} 
                            setPickupOrdersCount={setPickupOrdersCount} 
                            searchClicked={searchClicked}
                            onTabChange={setTabIndex}
                            selectedOrder={selectedOrder}
                        />
                    </TabPanel>
                    <TabPanel>
                        <CompletedOrder 
                            selectedBranch={selectedBranch} 
                            searchClicked={searchClicked}
                            selectedOrder={selectedOrder}
                        />
                    </TabPanel>
                </Tabs>
            </Layout>
        </>
    );
};

export default OnlineOrders;
