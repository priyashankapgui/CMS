import React, { useState } from "react";
import Layout from "../../Layout/Layout";
import "./OnlineOrders.css";
import InputLabel from "../../Components/Label/InputLabel";
import BranchDropdown from "../../Components/InputDropdown/BranchDropdown";
import InputField from "../../Components/InputField/InputField";
import Buttons from "../../Components/Buttons/SquareButtons/Buttons";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import NewOrders from '../OnlineOrders/NewOrders/NewOrders';
import ProcessingOrders from './ProcessingOrders/ProcessingOrders';
import PendingPickup from './PendingPickupOrders/PendingPickupOrders';
import CompletedOrder from './CompletedOrders';

export const OnlineOrders = () => {
    const [selectedBranch, setSelectedBranch] = useState('');

    const handleBranchDropdownChange = (value) => {
        setSelectedBranch(value);
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
                        <div className="orderNo">
                            <InputLabel htmlFor="CustomerName" color="#0377A8">Customer Name</InputLabel>
                            <InputField type="text" id="CustomerName" name="CustomerName" editable={true} width="250px" />
                        </div>
                        <div className="ProductID/Name">
                            <InputLabel htmlFor="ProductID/Name" color="#0377A8">Product ID / Name</InputLabel>
                            <InputField type="text" id="ProductID/Name" name="ProductID/Name" editable={true} width="250px" />
                        </div>
                    </div>
                    <div className="OnlineOrdersBtn">
                        <Buttons type="button" id="search-btn" style={{ backgroundColor: "#23A3DA", color: "white" }} onClick={''}> Search </Buttons>
                        <Buttons type="button" id="clear-btn" style={{ backgroundColor: "white", color: "#EB1313" }} onClick={''}> Clear </Buttons>
                    </div>
                </div>
                <Tabs className="OnlineOrdersTabs">
                    <TabList className="OrderStatusTab">
                        <Tab>New Orders</Tab>
                        <Tab>Processing</Tab>
                        <Tab>Pending Pickup</Tab>
                        <Tab>Completed</Tab>
                    </TabList>

                    <TabPanel>
                        <NewOrders/>
                    </TabPanel>
                    <TabPanel>
                        <ProcessingOrders/>
                    </TabPanel>
                    <TabPanel>
                        <PendingPickup/>
                    </TabPanel>
                    <TabPanel>
                        <CompletedOrder/>
                    </TabPanel>
                </Tabs>
            </Layout>
        </>
    );
};

export default OnlineOrders;
