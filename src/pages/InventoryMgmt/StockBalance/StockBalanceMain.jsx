import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from "../../../Layout/Layout";
import "./StockBalanceMain.css";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import StockBalance from './StockBalance';
import MinimunStock from './MinimumStock';

export const StockBalanceMain = () => {
    return (
        <>
            <div className="top-nav-blue-text">
                <h4>Stock Balance</h4>
            </div>
            <Layout>
                
                <Tabs className="stockBalanceTabs">
                    <TabList className="balanceStatusTab">
                            <Tab>Stock Balance</Tab>
                            <Tab>Minimun Stock</Tab>
                        </TabList>

                        <TabPanel>
                            <StockBalance/>
                        </TabPanel>
                        <TabPanel>
                            <MinimunStock/>
                        </TabPanel>
                    </Tabs>
                    
                
            </Layout>
        </>
    );
};

export default StockBalanceMain;
