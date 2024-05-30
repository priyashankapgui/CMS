import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AdjustBranch } from '../pages/BranchMgmt/AdjustBranch/AdjustBranch';
import { Accounts } from '../pages/BranchMgmt/Accounts/UserAccounts/Accounts';
import { CreateNewAccounts } from '../pages/BranchMgmt/Accounts/UserAccounts/CreateNewAccounts';
import { UpdateUser } from '../pages/BranchMgmt/Accounts/UserAccounts/UpdateUser';
import { UserRoleMgmt } from '../pages/BranchMgmt/Accounts/UserRoles/UserRoleMgmt';
import { Products } from '../pages/InventoryMgmt/Products/Products';
import { Suppliers } from '../pages/InventoryMgmt/Suppliers/Suppliers';
import { GoodReceive } from '../pages/InventoryMgmt/GoodReceive/GoodReceive';
import { AddNewGRN}  from '../pages/InventoryMgmt/GoodReceive/AddNewGRN';
import { StockBalance } from '../pages/InventoryMgmt/StockBalance/StockBalance';
import { StockTransfer } from '../pages/InventoryMgmt/StockTransfer/StockTransfer';
import { NewStockTransfer } from '../pages/InventoryMgmt/StockTransfer/NewStockTransfer';
import { CheckPrice } from '../pages/InventoryMgmt/CheckPrice/CheckPrice';
import { Sales } from '../pages/Billing/Sales/Sales';
import { WorkList } from '../pages/Billing/WorkList/WorkList-Billed/WorkList';
import { ViewBill } from '../pages/Billing/WorkList/WorkList-Billed/ViewBill';
import { StartReturnItems } from '../pages/Billing/WorkList/WorkList-Returned/StartReturnItems';
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
import ProtectedRoute from './ProtectedRoute';
import UpdateBranchPopup from '../pages/BranchMgmt/AdjustBranch/UpdateBranchPopup';

export function SidebarRouter() {
  return (
    <Routes>

      <Route element={<ProtectedRoute groupName="adjust-branch"/>}>
        <Route path="/adjust-branch" element={<AdjustBranch />} />
      </Route>

      {/* <Route path="/adjust-branch/:branchId" element={<UpdateBranchPopup/>} /> */}
      <Route element={<ProtectedRoute groupName="web-mgmt"/>}>
        <Route path="/web-mgmt" element={<WebMgmt />} />
      </Route>

      <Route element={<ProtectedRoute groupName="accounts"/>}>
        <Route path="/accounts/create-new-accounts" element={<CreateNewAccounts />} />
        <Route path="/accounts/update-account" element={<UpdateUser />} />
      </Route>

      <Route element={<ProtectedRoute groupName="accounts/user-roles"/>}>
        <Route path="/accounts/user-roles" element={<UserRoleMgmt />} />
      </Route>

      <Route element={<ProtectedRoute groupName="products"/>}>
        <Route path="/products" element={<Products />} />
      </Route>

      <Route element={<ProtectedRoute groupName="suppliers"/>}>
        <Route path="/suppliers" element={<Suppliers />} />
      </Route>

      <Route element={<ProtectedRoute groupName="good-receive"/>}>
        <Route path="/good-receive" element={<GoodReceive />} />
        <Route path="/good-receive/new" element={<AddNewGRN />} />
      </Route>

      <Route element={<ProtectedRoute groupName="stock-transfer"/>}>
        <Route path="/stock-transfer" element={<StockTransfer />} />
        <Route path="/stock-transfer/new" element={<NewStockTransfer />} />
      </Route>

      <Route element={<ProtectedRoute groupName="web-feedbacks"/>}>
        <Route path="/web-feedbacks" element={<WebFeedbacks />} />
      </Route>

      <Route element={<ProtectedRoute groupName="stock-balance"/>}>
        <Route path="/stock-balance" element={<StockBalance />} />
      </Route>

      <Route element={<ProtectedRoute groupName="check-price"/>}>
        <Route path="/check-price" element={<CheckPrice />} />
      </Route>

      <Route element={<ProtectedRoute groupName="sales"/>}>
        <Route path="/sales" element={<Sales />} />
      </Route>

      <Route element={<ProtectedRoute groupName="work-list"/>}>
        <Route path="/work-list" element={<WorkList />} />
      </Route>

      <Route element={<ProtectedRoute groupName="work-list"/>}>
        <Route path="/work-list/viewbill/:billNo" element={<ViewBill />} />
        <Route path="/work-list/viewbill/start-return-items/:billNo" element={<StartReturnItems/>} />
        <Route path="/work-list/returnbill-list" element={<ReturnBillList />} />
        <Route path="/work-list/returnbill-list/viewreturnbill/:RTBNo" element={<ViewReturnBill />} />
      </Route>

      <Route element={<ProtectedRoute groupName="online-orders"/>}>
        <Route path="/online-orders" element={<OnlineOrders />} />
      </Route>

      <Route element={<ProtectedRoute groupName="reporting/reports"/>}>
        <Route path="/reporting/reports" element={<Reports />} />
      </Route>
      <Route element={<ProtectedRoute groupName="reporting/analysis"/>}>
        <Route path="/reporting/analysis" element={<Analysis />} />
      </Route>
        <Route path="/accounts" element={<Accounts />} />

    </Routes>
  );
}

