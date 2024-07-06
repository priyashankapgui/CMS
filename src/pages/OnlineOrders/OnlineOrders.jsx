import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import Layout from "../../Layout/Layout";
import "./OnlineOrders.css";
import SearchBar from '../../Components/SearchBar/SearchBar';
import InputLabel from "../../Components/Label/InputLabel";
import BranchDropdown from "../../Components/InputDropdown/BranchDropdown";
import InputField from "../../Components/InputField/InputField";
import Buttons from "../../Components/Buttons/SquareButtons/Buttons";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import NewOrders from '../OnlineOrders/NewOrders/NewOrders';
import ProcessingOrders from './ProcessingOrders/ProcessingOrders';
import PendingPickup from './PendingPickupOrders/PendingPickupOrders';
import CompletedOrder from './CompletedOrders/CompletedOrders';
import Badge from '@mui/material/Badge';

export const OnlineOrders = () => {
    const [selectedBranch, setSelectedBranch] = useState('');
    const [newOrdersCount, setNewOrdersCount] = useState(0); 
    const [processingOrdersCount, setProcessingOrdersCount] = useState(0);
    const [pickupOrdersCount, setPickupOrdersCount] = useState(0);
    const [tabIndex, setTabIndex] = useState(0); 

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
                            <InputField type="text" id="orderNo" name="orderNo" editable={true} width="250px" />
                        </div>
                        <div className="customerName">
                            <InputLabel htmlFor="CustomerName" color="#0377A8">Customer Name</InputLabel>
                            <SearchBar />
                        </div>
                    </div>
                    <div className="OnlineOrdersBtn">
                        <Buttons type="button" id="search-btn" style={{ backgroundColor: "#23A3DA", color: "white" }} onClick={''}> Search </Buttons>
                        <Buttons type="button" id="clear-btn" style={{ backgroundColor: "white", color: "#EB1313" }} onClick={''}> Clear </Buttons>
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
                        <NewOrders setNewOrdersCount={setNewOrdersCount} />
                    </TabPanel>
                    <TabPanel>
                        <ProcessingOrders setProcessingOrdersCount={setProcessingOrdersCount} onTabChange={setTabIndex} />
                    </TabPanel>
                    <TabPanel>
                        <PendingPickup setPickupOrdersCount={setPickupOrdersCount} onTabChange={setTabIndex} />
                    </TabPanel>
                    <TabPanel>
                        <CompletedOrder />
                    </TabPanel>
                </Tabs>
            </Layout>
        </>
    );
};

export default OnlineOrders;
