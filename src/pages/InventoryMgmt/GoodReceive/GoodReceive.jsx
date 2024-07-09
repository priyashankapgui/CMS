import React, { useState, useEffect } from "react";
import Layout from "../../../Layout/Layout";
import "./GoodReceive.css";
import InputField from "../../../Components/InputField/InputField";
import TableWithPagi from "../../../Components/Tables/TableWithPagi";
import Buttons from "../../../Components/Buttons/SquareButtons/Buttons";
import InputLabel from "../../../Components/Label/InputLabel";
import RoundButtons from "../../../Components/Buttons/RoundButtons/RoundButtons";
import DatePicker from "../../../Components/DatePicker/DatePicker";
import SearchBar from "../../../Components/SearchBar/SearchBar";
import SubSpinner from "../../../Components/Spinner/SubSpinner/SubSpinner";
import BranchDropdown from "../../../Components/InputDropdown/BranchDropdown";
import GrnDoc from "../../../Components/InventoryDocuments/GrnDoc/GrnDoc";
import secureLocalStorage from "react-secure-storage";
import { useNavigate } from "react-router-dom";
import { BsEye } from "react-icons/bs";
import { RiPrinterFill } from "react-icons/ri";
import { Link, useParams } from "react-router-dom";
import { getProducts } from "../../../Api/Inventory/Product/ProductAPI";
import { getSuppliers } from "../../../Api/Inventory/Supplier/SupplierAPI";
import { getBranchOptions } from "../../../Api/BranchMgmt/BranchAPI";
import { getAllGRN } from "../../../Api/Inventory/GoodReceive/GoodReceiveAPI";

export const GoodReceive = () => {
  const [grnData, setGrnData] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({
    GRN_NO: "",
    fromDate: "",
    toDate: "",
    invoiceNo: "",
    productId: "",
    supplierId: "",
  });
  const [product, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedGRN_NO, setSelectedGRN_NO] = useState(null);
  const [showGRNReceipt, setshowGRNReceipt] = useState(false);
  
  const { GRN_NO } = useParams();
  const navigate = useNavigate();

  const handleReprintClick = (GRN_NO) => {
    setSelectedGRN_NO(GRN_NO);
    setshowGRNReceipt(true);
  };

  const handleCloseGRNReceipt = () => {
    setshowGRNReceipt(false);
    setSelectedGRN_NO(null);
  };

  useEffect(() => {
    fetchGrnData();
    fetchBranches();
    fetchProducts();
    fetchSuppliers();
  }, []);

  const fetchGrnData = async () => {
    try {
      const userJSON = secureLocalStorage.getItem("user");
      if (userJSON) {
        const user = JSON.parse(userJSON);

        const response = await getAllGRN();
        let data = response.data || [];

        if (user.role !== "Super Admin") {
          data = data.filter((item) => item.branchName === user.branchName);
        }
        setGrnData(data);
      } else {
        console.error("User details not found in secure storage");
      }
    } catch (error) {
      console.error("Error fetching GRN data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBranches = async () => {
    try {
      const response = await getBranchOptions();
      console.log('Fetcheds branches:', response);
      setBranches(response);
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await getSuppliers();
      setSuppliers(response.data);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  const handleDropdownChange = (value) => {
    setSelectedBranch(value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDateChange = (name, date) => {
    setSearchParams((prevState) => ({
      ...prevState,
      [name]: date,
    }));
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      let data = grnData;

      const productId = searchParams.productId.split(" ")[0]; // Assuming the productId is the first part
      const supplierId = searchParams.supplierId.split(" ")[0];

      if (searchParams.GRN_NO) {
        data = data.filter((item) => item.GRN_NO.includes(searchParams.GRN_NO));
      }
      if (searchParams.invoiceNo) {
        data = data.filter((item) =>
          item.invoiceNo.includes(searchParams.invoiceNo)
        );
      }
      if (searchParams.fromDate && searchParams.toDate) {
        const fromDate = new Date(searchParams.fromDate);
        const toDate = new Date(searchParams.toDate);
        data = data.filter((item) => {
          const createdAt = new Date(item.createdAt);
          return createdAt >= fromDate && createdAt <= toDate;
        });
      }
      if (supplierId && selectedBranch === 'All' ) {
        data = data.filter(
          (item) => item.supplierId && item.supplierId.includes(supplierId)
        );
      }
      if (productId) {
        data = data.filter(
          (item) =>
            item.productGRNs &&
            item.productGRNs.some(
              (productGRN) =>
                productGRN.productId && productGRN.productId.includes(productId)
            )
        );
      }
      if (selectedBranch && selectedBranch !== "All") {
        data = data.filter((item) => item.branchName === selectedBranch);
      }
      if (supplierId && selectedBranch !== 'All') {
        data = data.filter(
          (item) =>
            item.supplierId &&
            item.supplierId.includes(supplierId) &&
            item.branchName === selectedBranch
        );
      } else if (productId) {
        data = data.filter(
          (item) =>
            item.productGRNs &&
            item.productGRNs.some(
              (productGRN) =>
                productGRN.productId && productGRN.productId.includes(productId)
            )
        );
      }

      setGrnData(data); 
    } catch (error) {
      console.error("Error fetching GRN data:", error);
      setGrnData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    setSearchParams({
      GRN_NO: "",
      fromDate: "",
      toDate: "",
      invoiceNo: "",
      productId: "",
      supplierId: "",
    });
    try {
      setLoading(true);
      const response = await getAllGRN();
      const userJSON = secureLocalStorage.getItem("user");
  
      if (userJSON) {
        const user = JSON.parse(userJSON);
        let data = response.data || [];
  
        if (user.role !== "Super Admin") {
          data = data.filter((item) => item.branchName === user.branchName);
        }
  
        setGrnData(data);
      } else {
        console.error("User details not found in secure storage");
      }
    } catch (error) {
      console.error("Error fetching GRN data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewButtonClick = () => {
    navigate("/good-receive/new");
  };

  
  const fetchProductsSuggestions = async (query) => {
    try {
        const response = await getProducts();
        if (response.data) {
            return response.data
                .filter(product => 
                    product.productName.toLowerCase().includes(query.toLowerCase()) || 
                    product.productId.toLowerCase().includes(query.toLowerCase())
                )
                .map(product => ({
                    id: product.productId,
                    displayText: `${product.productId} ${product.productName}`
                }));
        }
        return [];
    } catch (error) {
        console.error('Error fetching product:', error);
        return [];
    }
};

  const fetchSuppliersSuggestions = async (query) => {
    try {
      const response = await getSuppliers();
      if (response.data && response.data) {
        return response.data.map((supplier) => ({
          id: supplier.supplierId,
          displayText: `${supplier.supplierId} ${supplier.supplierName}`,
        }));
      }
      return [];
    } catch (error) {
      console.error("Error fetching supplier suggestions:", error);
      return [];
    }
  };

  const formatDate = (datetime) => {
    const date = new Date(datetime);
    return date.toISOString().split("T")[0];
  };

  return (
    <>
      <div className="top-nav-blue-text">
        <h4>Good Receive Note</h4>
      </div>
      <Layout>
        <div className="reg-goodReceives-bodycontainer">
          <div className="goodReceive-filter-container">
            <div className="goodReceive-content-top1">
              <div className="branchField">
                <InputLabel htmlFor="branchName" color="#0377A8">
                  Branch
                </InputLabel>
                <BranchDropdown
                  id="branchName"
                  name="branchName"
                  editable={true}
                  onChange={(e) => handleDropdownChange(e)}
                />
              </div>
              <div className="datePickerFrom">
                <InputLabel htmlFor="From" color="#0377A8">
                  From
                </InputLabel>
                <DatePicker
                  id="dateFrom"
                  name="fromDate"
                  onDateChange={(date) => handleDateChange("fromDate", date)}
                />
              </div>
              <div className="datePickerTo">
                <InputLabel htmlFor="To" color="#0377A8">
                  To
                </InputLabel>
                <DatePicker
                  id="dateTo"
                  name="toDate"
                  onDateChange={(date) => handleDateChange("toDate", date)}
                />
              </div>
              <div className="grnNoField">
                <InputLabel htmlFor="GRN_NO" color="#0377A8">
                  GRN No
                </InputLabel>
                <InputField
                  type="text"
                  id="GRN_NO"
                  name="GRN_NO"
                  value={searchParams.GRN_NO}
                  onChange={handleInputChange}
                  editable={true}
                  width="250px"
                />
              </div>
              <div className="invoiceNoField">
                <InputLabel htmlFor="invoiceNo" color="#0377A8">
                  Invoice No
                </InputLabel>
                <InputField
                  type="text"
                  id="invoiceNo"
                  name="invoiceNo"
                  value={searchParams.invoiceNo}
                  onChange={handleInputChange}
                  editable={true}
                  width="250px"
                />
              </div>
            </div>
            <div className="goodReceive-content-top2">
              <div className="productsField">
                <InputLabel htmlFor="productId" color="#0377A8">
                  Product ID / Name
                </InputLabel>
                <SearchBar
                  searchTerm={searchParams.productId}
                  setSearchTerm={(value) =>
                    setSearchParams((prevState) => ({
                      ...prevState,
                      productId: value,
                    }))
                  }
                  onSelectSuggestion={(suggestion) =>
                    setSearchParams((prevState) => ({
                      ...prevState,
                      productId: `${suggestion.displayText}`,
                    }))
                  }
                  fetchSuggestions={fetchProductsSuggestions}
                />
              </div>
              <div className="suppliersField">
                <InputLabel htmlFor="supplierId" color="#0377A8">
                  Supplier ID / Name
                </InputLabel>
                <SearchBar
                  searchTerm={searchParams.supplierId}
                  setSearchTerm={(value) =>
                    setSearchParams((prevState) => ({
                      ...prevState,
                      supplierId: value,
                    }))
                  }
                  onSelectSuggestion={(suggestion) =>
                    setSearchParams((prevState) => ({
                      ...prevState,
                      supplierId: `${suggestion.displayText}`,
                    }))
                  }
                  fetchSuggestions={fetchSuppliersSuggestions}
                />
              </div>
            </div>
            <div className="goodReceive-BtnSection">
              <Buttons
                type="button"
                id="search-btn"
                style={{ backgroundColor: "#23A3DA", color: "white" }}
                onClick={handleSearch}
              >
                {" "}
                Search{" "}
              </Buttons>
              <Buttons
                type="button"
                id="clear-btn"
                style={{ backgroundColor: "white", color: "#EB1313" }}
                onClick={handleClear}
              >
                {" "}
                Clear{" "}
              </Buttons>
              <Buttons
                type="button"
                id="new-btn"
                style={{ backgroundColor: "white", color: "#23A3DA" }}
                onClick={handleNewButtonClick}
              >
                {" "}
                New +{" "}
              </Buttons>
            </div>
          </div>
          <div className="goodReceive-content-middle">
            {loading ? (
              <div>
                <SubSpinner />
              </div>
            ) : (
              <TableWithPagi
                columns={[
                  "GRN No",
                  "Created At",
                  "Branch",
                  "Supplier",
                  "Invoice No",
                  "",
                ]}
                rows={grnData.map((grn, index) => ({
                  "GRN No": grn.GRN_NO,
                  "Created At": formatDate(grn.createdAt),
                  Branch: grn.branchName,
                  Supplier: grn.supplierName,
                  "Invoice No": grn.invoiceNo,

                  Action: (
                    <div style={{ display: "flex", gap: "0.5em" }}>
                      <Link to={`/good-receive/ViewGRN/${grn.GRN_NO}`}>
                        <RoundButtons
                          id={`eyeViewBtn-${index}`}
                          type="submit"
                          name={`eyeViewBtn-${index}`}
                          icon={<BsEye style={{ fontSize: '14px' }} />}
                        />
                      </Link>
                      <RoundButtons
                        id={`printBtn-${index}`}
                        type="submit"
                        name={`printBtn-${index}`}
                        icon={<RiPrinterFill />}
                        onClick={() => handleReprintClick(grn.GRN_NO)}
                      />
                    </div>
                  ),
                }))}
              />
            )}
          </div>
        </div>
      </Layout>
      {showGRNReceipt && (
        <div className="grn-doc-popup">
          <GrnDoc GRN_NO={selectedGRN_NO} onClose={handleCloseGRNReceipt} />
        </div>
      )}
    </>
  );
};

export default GoodReceive;
