import { Routes, Route } from "react-router-dom";
import { AdjustBranch } from "../pages/BranchMgmt/AdjustBranch/AdjustBranch";
import { Accounts } from "../pages/BranchMgmt/Accounts/Accounts";
import { Products } from "../pages/InventoryMgmt/Products/Products";
import { Suppliers } from "../pages/InventoryMgmt/Suppliers/Suppliers";
import { GoodReceive } from "../pages/InventoryMgmt/GoodReceive/GoodReceive";
import { StockBalance } from "../pages/InventoryMgmt/StockBalance/StockBalance";
import { StockTransfer } from "../pages/InventoryMgmt/StockTransfer/StockTransfer";
import { CheckPrice } from "../pages/InventoryMgmt/CheckPrice/CheckPrice";
import { Sales } from "../pages/Billing/Sales/Sales";
import { WorkList } from "../pages/Billing/WorkList/WorkList";
import { WebMgmt } from "../pages/WebMgmt/WebMgmt";
import { OnlineOrders } from "../pages/OnlineOrders/OnlineOrders";
import { Reports } from "../pages/Reporting/Reports/Reports";
import { Analysis } from "../pages/Reporting/Analysis/Analysis";



export function SidebarRouter() {
  return (
    <Routes>
      <Route path="/adjust-branch" element={<AdjustBranch />} />
      <Route path="/accounts" element={<Accounts />} />
      <Route path="/products" element={<Products />} />
      <Route path="/suppliers" element={<Suppliers />} />
      <Route path="/good-receive" element={<GoodReceive />} />
      <Route path="/stock-balance" element={<StockBalance />} />
      <Route path="/stock-transfer" element={<StockTransfer />} />
      <Route path="/check-price" element={<CheckPrice />} />
      <Route path="/sales" element={<Sales />} />
      <Route path="/work-list" element={<WorkList />} />
      <Route path="/online-orders" element={<OnlineOrders />} />
      <Route path="/web-mgmt" element={<WebMgmt />} />
      <Route path="/reporting/analysis" element={<Analysis/>} />
      <Route path="/reporting/reports" element={<Reports />} />
    </Routes>

  );
}
