import React from 'react';
import { Routes, Route } from 'react-router-dom';
import  AdjustBranch  from '../pages/BranchMgmt/AdjustBranch/AdjustBranch';
import { Accounts } from '../pages/BranchMgmt/Accounts/UserAccounts/Accounts';
import { CreateNewAccounts } from '../pages/BranchMgmt/Accounts/UserAccounts/CreateNewAccounts';
import { UpdateUser } from '../pages/BranchMgmt/Accounts/UserAccounts/UpdateUser';
import { UserRoleMgmt } from '../pages/BranchMgmt/Accounts/UserRoles/UserRoleMgmt';
import { Products } from '../pages/InventoryMgmt/Products/Products';
import { Suppliers } from '../pages/InventoryMgmt/Suppliers/Suppliers';
import { GoodReceive } from '../pages/InventoryMgmt/GoodReceive/GoodReceive';
import { AddNewGRN } from '../pages/InventoryMgmt/GoodReceive/AddNewGRN';
import {ViewGRN} from '../pages/InventoryMgmt/GoodReceive/ViewGRN';
import { StockTransfer } from '../pages/InventoryMgmt/StockTransfer/StockTransfer';
import { NewStockTransfer } from '../pages/InventoryMgmt/StockTransfer/NewStockTransfer';
import { CheckPrice } from '../pages/InventoryMgmt/CheckPrice/CheckPrice';
import { Sales } from '../pages/Billing/Sales/Sales';
import { WorkList } from '../pages/Billing/WorkList/WorkList-Billed/WorkList';
import { ViewBill } from '../pages/Billing/WorkList/WorkList-Billed/ViewBill';
import { ReturnBillList } from '../pages/Billing/WorkList/WorkList-Returned/ReturnBillList';
import  StartReturnItmes  from '../pages/Billing//WorkList/WorkList-Returned/StartReturnItems'
import { ViewReturnBill } from '../pages/Billing/WorkList/WorkList-Returned/ViewReturnBill';
import { OnlineOrders } from '../pages/OnlineOrders/OnlineOrders';
import { WebMgmt } from '../pages/WebMgmt/WebMgmt';
import { WebFeedbacks } from '../pages/WebFeedbacks/WebFeedbacks';
import { Analysis } from '../pages/Reporting/Analysis/Analysis';
import { Reports } from '../pages/Reporting/Reports/Reports';
import ProtectedRoute from './ProtectedRoute';
import StockTransferIssuing from '../pages/InventoryMgmt/StockTransfer/StockTransferIN/StockTransferIssuing';
import ReceivingCompleted from '../pages/InventoryMgmt/StockTransfer/StockTransferOUT/ReceivingCompleted';
import IssuingCompleted from '../pages/InventoryMgmt/StockTransfer/StockTransferIN/IssuingCompleted';
import Cancelled from '../pages/InventoryMgmt/StockTransfer/StockTransferIN/IssuingCancelled';
import ReceivingRaised from '../pages/InventoryMgmt/StockTransfer/StockTransferOUT/ReceivingRaised';
import ReceivingCancelled from '../pages/InventoryMgmt/StockTransfer/StockTransferOUT/ReceivingCancelled';
import StockBalanceMain from '../pages/InventoryMgmt/StockBalance/StockBalanceMain';
import NotFound from '../pages/NotFound/NotFound';
import Login from '../pages/LoginPart/Login/Login';
import ForgetPw from '../pages/LoginPart/ForgetPw/ForgetPw';
import ChangePw from "../pages/LoginPart/ResetPw/ResetPw";
import { NewOrderView } from '../pages/OnlineOrders/NewOrders/NewOrderView';
import { CompletedOrders } from '../pages/OnlineOrders/CompletedOrders/CompleteOrderView';


export function SidebarRouter() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login/fp" element={<ForgetPw />} />
      <Route path="/login/resetpw" element={<ChangePw />} />
      
      <Route element={<ProtectedRoute groupName="adjust-branch" />}>
        <Route path="/adjust-branch" element={<AdjustBranch />} />
      </Route>

      {/* <Route path="/adjust-branch/:branchId" element={<UpdateBranchPopup/>} /> */}
      <Route element={<ProtectedRoute groupName="web-mgmt" />}>
        <Route path="/web-mgmt" element={<WebMgmt />} />
      </Route>

      <Route element={<ProtectedRoute groupName="accounts" />}>
        <Route path="/accounts/create-new-accounts" element={<CreateNewAccounts />} />
        <Route path="/accounts/update-account" element={<UpdateUser />} />
        <Route path="/accounts" element={<Accounts />} />
      </Route>

      <Route element={<ProtectedRoute groupName="accounts/user-roles" />}>
        <Route path="/accounts/user-roles" element={<UserRoleMgmt />} />
      </Route>

      <Route element={<ProtectedRoute groupName="products" />}>
        <Route path="/products" element={<Products />} />
      </Route>

      <Route element={<ProtectedRoute groupName="suppliers" />}>
        <Route path="/suppliers" element={<Suppliers />} />
      </Route>

      <Route element={<ProtectedRoute groupName="good-receive" />}>
        <Route path="/good-receive" element={<GoodReceive />} />
        <Route path="/good-receive/new" element={<AddNewGRN />} />
        <Route path="/good-receive/ViewGRN/:GRNNo" element={<ViewGRN />} />
      </Route>

      <Route element={<ProtectedRoute groupName="stock-transfer" />}>
        <Route path="/stock-transfer" element={<StockTransfer />} />
        <Route path="/stock-transfer/new" element={<NewStockTransfer />} />
        <Route path="/stock-transfer/issuing/:STN_NO" element={<StockTransferIssuing />} />
        <Route path="/stock-transfer/completed/:STN_NO" element={<IssuingCompleted />} />
        <Route path="/stock-transfer/cancelled/:STN_NO" element={<Cancelled />} />
        <Route path="/stock-transfer/OUT/cancelled/:STN_NO" element={<ReceivingCancelled/>} />
        <Route path="/stock-transfer/receiving/:STN_NO" element={<ReceivingCompleted />} />
        <Route path="/stock-transfer/OUT/raised/:STN_NO" element={<ReceivingRaised />} />
      </Route>

      <Route element={<ProtectedRoute groupName="web-feedbacks" />}>
        <Route path="/web-feedbacks" element={<WebFeedbacks />} />
      </Route>

      <Route element={<ProtectedRoute groupName="stock-balance" />}>
        <Route path="/stock-balance" element={<StockBalanceMain />} />
      </Route>

      <Route element={<ProtectedRoute groupName="check-price" />}>
        <Route path="/check-price" element={<CheckPrice />} />
      </Route>

      <Route element={<ProtectedRoute groupName="sales" />}>
        <Route path="/sales" element={<Sales />} />
      </Route>

      <Route element={<ProtectedRoute groupName="work-list" />}>
        <Route path="/work-list" element={<WorkList />} />
      </Route>

      <Route element={<ProtectedRoute groupName="work-list" />}>
        <Route path="/work-list/viewbill/:billNo" element={<ViewBill />} />
        <Route path="/work-list/viewbill/start-return-items/:billNo" element={<StartReturnItmes />} />
        <Route path="/work-list/returnbill-list" element={<ReturnBillList />} />
        <Route path="/work-list/returnbill-list/viewreturnbill/:RTBNo" element={<ViewReturnBill />} />
      </Route>

      <Route element={<ProtectedRoute groupName="online-orders" />}>
        <Route path="/online-orders" element={<OnlineOrders />} />
        <Route path="/online-orders/viewOrder/:onlineBillNo" element={<NewOrderView />} />
        <Route path="/online-orders/viewCompleteOrder/:onlineBillNo" element={<CompletedOrders />} />
      </Route>

      <Route element={<ProtectedRoute groupName="reporting/reports" />}>
        <Route path="/reporting/reports" element={<Reports />} />
      </Route>
      <Route element={<ProtectedRoute groupName="reporting/analysis" />}>
        <Route path="/reporting/analysis" element={<Analysis />} />
      </Route>

      <Route path="*" element={<NotFound />} />

    </Routes>
  );
}
