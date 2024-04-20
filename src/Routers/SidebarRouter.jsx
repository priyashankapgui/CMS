import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AdjustBranch } from '../pages/BranchMgmt/AdjustBranch/AdjustBranch';
import { Accounts } from '../pages/BranchMgmt/Accounts/UserAccounts/Accounts';
import { UserRoleMgmt } from '../pages/BranchMgmt/Accounts/UserRoles/UserRoleMgmt';
import { Products } from '../pages/InventoryMgmt/Products/Products';
import { Suppliers } from '../pages/InventoryMgmt/Suppliers/Suppliers';
import { GoodReceive } from '../pages/InventoryMgmt/GoodReceive/GoodReceive';
import { StockBalance } from '../pages/InventoryMgmt/StockBalance/StockBalance';
import { StockTransfer } from '../pages/InventoryMgmt/StockTransfer/StockTransfer';
import { CheckPrice } from '../pages/InventoryMgmt/CheckPrice/CheckPrice';
import { Sales } from '../pages/Billing/Sales/Sales';
import { WorkList } from '../pages/Billing/WorkList/WorkList-Billed/WorkList';
import { ViewBill } from '../pages/Billing/WorkList/WorkList-Billed/ViewBill';
import { ReturnBill } from '../pages/Billing/WorkList/WorkList-Returned/ReturnBill';
import { OnlineOrders } from '../pages/OnlineOrders/OnlineOrders';
import { WebMgmt } from '../pages/WebMgmt/WebMgmt';
import { WebFeedbacks } from '../pages/WebFeedbacks/WebFeedbacks';
import { Analysis } from '../pages/Reporting/Analysis/Analysis';
import { Reports } from '../pages/Reporting/Reports/Reports';


export function SidebarRouter() {
  return (
    <Routes>
      {/* Branch Management Routes */}
      <Route path="/adjust-branch" element={<AdjustBranch />} />
      <Route path="/accounts" element={<Accounts />} />
      <Route path="/accounts/user-roles" element={<UserRoleMgmt />} />

      {/* Inventory Management Routes */}
      <Route path="/products" element={<Products />} />
      <Route path="/suppliers" element={<Suppliers />} />
      <Route path="/good-receive" element={<GoodReceive />} />
      <Route path="/stock-balance" element={<StockBalance />} />
      <Route path="/stock-transfer" element={<StockTransfer />} />
      <Route path="/check-price" element={<CheckPrice />} />

      {/* Billing Routes */}
      <Route path="/sales" element={<Sales />} />
      <Route path="/work-list" element={<WorkList />} />
      <Route path="/work-list/viewbill/:billNo" element={<ViewBill/>} />
      <Route path="/work-list/returnbill" element={<ReturnBill />} />

      {/* Online Orders */}
      <Route path="/online-orders" element={<OnlineOrders />} />

      {/* Web Management */}
      <Route path="/web-mgmt" element={<WebMgmt />} />
      <Route path="/web-feedbacks" element={<WebFeedbacks />} />

      {/* Reporting Routes */}
      <Route path="/reporting/analysis" element={<Analysis />} />
      <Route path="/reporting/reports" element={<Reports />} />
    </Routes>
  );
}

