import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AdjustBranch } from '../pages/BranchMgmt/AdjustBranch/AdjustBranch';
import { Accounts } from '../pages/BranchMgmt/Accounts/UserAccounts/Accounts';
import { CreateNewAccounts } from '../pages/BranchMgmt/Accounts/UserAccounts/CreateNewAccounts';
import { UserRoleMgmt } from '../pages/BranchMgmt/Accounts/UserRoles/UserRoleMgmt';
import { Products } from '../pages/InventoryMgmt/Products/Products';
import { Suppliers } from '../pages/InventoryMgmt/Suppliers/Suppliers';
import { GoodReceive } from '../pages/InventoryMgmt/GoodReceive/GoodReceive';
import { AddNewGRN}  from '../pages/InventoryMgmt/GoodReceive/AddNewGRN';
import { StockBalance } from '../pages/InventoryMgmt/StockBalance/StockBalance';
import { StockTransfer } from '../pages/InventoryMgmt/StockTransfer/StockTransfer';
import {NewStockTransfer} from '../pages/InventoryMgmt/StockTransfer/NewStockTransfer';
import { CheckPrice } from '../pages/InventoryMgmt/CheckPrice/CheckPrice';
import { Sales } from '../pages/Billing/Sales/Sales';
import { WorkList } from '../pages/Billing/WorkList/WorkList-Billed/WorkList';
import { ViewBill } from '../pages/Billing/WorkList/WorkList-Billed/ViewBill';
import { ReturnBillList } from '../pages/Billing/WorkList/WorkList-Returned/ReturnBillList';
import { ViewReturnBill } from '../pages/Billing/WorkList/WorkList-Returned/ViewReturnBill';
import { OnlineOrders } from '../pages/OnlineOrders/OnlineOrders';
import { WebMgmt } from '../pages/WebMgmt/WebMgmt';
import { WebFeedbacks } from '../pages/WebFeedbacks/WebFeedbacks';
import { Analysis } from '../pages/Reporting/Analysis/Analysis';
import { Reports } from '../pages/Reporting/Reports/Reports';
import CashierRoute from "./CashierRoute";
import AdminRoute from "./AdminRoute";
import SuperAdminRoute from "./SuperAdminRoute";
import UpdateBranchPopup from '../pages/BranchMgmt/AdjustBranch/UpdateBranchPopup';

export function SidebarRouter() {
  return (
    <Routes>

      {/* SuperAdmin Routes */}
      {/* <Route element={<SuperAdminRoute />}> */}
      <Route path="/adjust-branch" element={<AdjustBranch />} />
      {/* <Route path="/adjust-branch/:branchId" element={<UpdateBranchPopup/>} /> */}
      <Route path="/web-mgmt" element={<WebMgmt />} />
      {/* </Route> */}

      {/* Admin Routes */}
      {/* <Route element={<AdminRoute />}> */}
      <Route path="/accounts" element={<Accounts />} />
      <Route path="/accounts/create-new-accounts" element={<CreateNewAccounts />} />
      <Route path="/accounts/user-roles" element={<UserRoleMgmt />} />
      <Route path="/products" element={<Products />} />
      <Route path="/suppliers" element={<Suppliers />} />
      <Route path="/good-receive" element={<GoodReceive />} />
      <Route path="/good-receive/new" element={<AddNewGRN />} />
      <Route path="/stock-transfer" element={<StockTransfer />} />
      <Route path="/stock-transfer/new" element={<NewStockTransfer/>} />
      <Route path="/web-feedbacks" element={<WebFeedbacks />} />
      <Route path="/reporting/analysis" element={<Analysis />} />
      <Route path="/reporting/reports" element={<Reports />} />
      {/* </Route> */}

      {/* Cashier Routes */}
      {/* <Route element={<CashierRoute />}> */}
      <Route path="/stock-balance" element={<StockBalance />} />
      <Route path="/check-price" element={<CheckPrice />} />
      <Route path="/sales" element={<Sales />} />
      <Route path="/work-list" element={<WorkList />} />
      <Route path="/work-list/viewbill/:billNo" element={<ViewBill />} />
      <Route path="/work-list/returnbill-list" element={<ReturnBillList />} />
      <Route path="/work-list/returnbill-list/viewreturnbill/:RTBNo" element={<ViewReturnBill />} />
      <Route path="/online-orders" element={<OnlineOrders />} />
      {/* </Route> */}

    </Routes>
  );
}

