import { Routes, Route } from "react-router-dom";
import { AdjustBranch } from "../pages/BranchMgmt/AdjustBranch/AdjustBranch";
import { Accounts } from "../pages/BranchMgmt/Accounts/Accounts";
import { Products } from "../pages/InventoryMgmt/Products/Products";
import { Suppliers } from "../pages/InventoryMgmt/Suppliers/Suppliers";
import { GoodReceive } from "../pages/InventoryMgmt/GoodReceive/GoodReceive";
import { StockBalance } from "../pages/InventoryMgmt/StockBalance/StockBalance";
import { StockTransfer } from "../pages/InventoryMgmt/StockTransfer/StockTransfer";
import { StockReturn } from "../pages/InventoryMgmt/StockReturn/StockReturn";
import { CheckPrice } from "../pages/InventoryMgmt/CheckPrice/CheckPrice";
import { Sales } from "../pages/Billing/Sales/Sales";
import { WorkList } from "../pages/Billing/WorkList/WorkList";
import { WebMgmt } from "../pages/WebMgmt/WebMgmt";
import { Reporting } from "../pages/Reporting/Reporting";
import { OnlineOrders } from "../pages/OnlineOrders/OnlineOrders";
import BranchMgmt from "../pages/BranchMgmt/BranchMgmt-Def/BranchMgmt";
import InventoryMgmt from "../pages/InventoryMgmt/InventoryMgmt-Def/InventoryMgmt";
import Billing from "../pages/Billing/Billing-Def/Billing";


export function SidebarRouter() {
  return (
    <Routes>
      <Route path="/branch-mgmt" element={<BranchMgmt />} />
      <Route path="/adjust-branch" element={<AdjustBranch />} />
      <Route path="/accounts" element={<Accounts />} />
      <Route path="/inventory-mgmt" element={<InventoryMgmt/>} />
      <Route path="/products" element={<Products />} />
      <Route path="/suppliers" element={<Suppliers />} />
      <Route path="/good-receive" element={<GoodReceive />} />
      <Route path="/stock-balance" element={<StockBalance />} />
      <Route path="/stock-transfer" element={<StockTransfer />} />
      <Route path="/stock-return" element={<StockReturn />} />
      <Route path="/check-price" element={<CheckPrice/>} />
      <Route path="/billing" element={<Billing/>} />
      <Route path="/sales" element={<Sales />} />
      <Route path="/work-list" element={<WorkList />} />
      <Route path="/online-orders" element={<OnlineOrders />} />
      <Route path="/web-mgmt" element={<WebMgmt />} />
      <Route path="/reporting" element={<Reporting />} />
    </Routes>

  );
}
