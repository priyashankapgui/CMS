import React, { useState, useEffect } from 'react';
import "./StockTransferOUT.css";
import TableWithPagi from '../../../../Components/Tables/TableWithPagi';
import RoundButtons from '../../../../Components/Buttons/RoundButtons/RoundButtons';
import StockTraOut from '../../../../Components/InventoryDocuments/St-Out-Doc/StockTraOut';
import SubSpinner from '../../../../Components/Spinner/SubSpinner/SubSpinner';
import secureLocalStorage from "react-secure-storage";
import { BsEye, BsCheckCircle, BsXCircle } from "react-icons/bs";
import { RiPrinterFill } from "react-icons/ri";
import { Link } from 'react-router-dom';
import { getAllTransfers } from '../../../../Api/Inventory/StockTransfer/StockTransferAPI';


export const StockTransferOUT = ({ searchParams }) => {
    const [stockData, setStockData] = useState([]);
    const [selectedSTN_NO, setSelectedSTN_NO] = useState(null); 
    const [showStockOUTReceipt, setShowStockOUTReceipt] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStockData();
    }, [searchParams]); 

    const fetchStockData = async () => {
        setLoading(true);
        try {
            const userJSON = secureLocalStorage.getItem("user");
            if (userJSON) {
                const user = JSON.parse(userJSON);
                let response;
                if (user.role === 'Super Admin') {
                    response = await getAllTransfers();
                } else if (user.branchName) {
                    response = await getAllTransfers();
                    response.data = response.data.filter(transfer => transfer.requestBranch === user.branchName);
                } else {
                    console.error('Branch name is not available for the user');
                    setLoading(false);
                    return;
                }

                let filteredData = response.data || [];
                if (searchParams.STN_NO) {
                    filteredData = filteredData.filter((item) =>
                        item.STN_NO.includes(searchParams.STN_NO)
                    );
                }
                if (searchParams.fromDate && searchParams.toDate) {
                    const fromDate = new Date(searchParams.fromDate);
                    const toDate = new Date(searchParams.toDate);
                    filteredData = filteredData.filter((item) => {
                        const createdAt = new Date(item.createdAt);
                        return createdAt >= fromDate && createdAt <= toDate;
                    });
                }  if (searchParams.requestBranch) {
                    filteredData = filteredData.filter(
                        (item) => item.requestBranch === searchParams.requestBranch
                    );
                } if (searchParams.supplyingBranch) {
                    filteredData = filteredData.filter(
                        (item) => item.supplyingBranch === searchParams.supplyingBranch
                    );
                } else if (searchParams.productId) {
                    filteredData = filteredData.filter((item) =>
                        item.products.some(product => product.productId.includes(searchParams.productId))
                    );
                }

                setStockData(filteredData); 
            } else {
                console.error('User details not found in secure storage');
            }
        } catch (error) {
            console.error('Error fetching stock transfer data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (datetime) => {
        const date = new Date(datetime);
        return date.toISOString().split('T')[0];
    };

    const handleReprintClick = (STN_NO) => {
        setSelectedSTN_NO(STN_NO);
        setShowStockOUTReceipt(true);
    };


    const handleCloseStockOUTReceipt = () => {
        setShowStockOUTReceipt(false);
        setSelectedSTN_NO(null);
    };

    return (
        <>
            <div className="stockTransferOUT-bodycontainer">
                <div className="stockTransferOUT-content-middle">
                    {loading ? (
                        <div><SubSpinner/></div> 
                    ) : (
                        <TableWithPagi
                            columns={['STN No', 'Created At', 'Request Branch', 'Supplying Branch', 'Status', 'Requested By', 'Submitted By', 'Submitted At', 'Actions']}
                            rows={stockData.map((data, index) => ({
                                'STN No': data.STN_NO,
                                'Created At': formatDate(data.createdAt),
                                'Request Branch': data.requestBranch,
                                'Supplying Branch': data.supplyingBranch,
                                'Status': data.status,
                                'Requested By': data.requestedBy,
                                'Submitted By': data.submittedBy,
                                'Submitted At': formatDate(data.submittedAt),
                                'Actions': (
                                    <div style={{ display: "flex", gap: "0.5em" }}>
                                        {data.status === 'raised' && (
                                            <Link to={`/stock-transfer/OUT/raised/${data.STN_NO}`}>
                                                <RoundButtons
                                                    id={`eyeViewBtn-${index}`}
                                                    type="submit"
                                                    name={`eyeViewBtn-${index}`}
                                                    icon={<BsEye style={{ fontSize: '15px' }} />}
                                                />
                                            </Link>
                                        )}
                                        {data.status === 'completed' && (
                                            <>
                                                <Link to={`/stock-transfer/receiving/${data.STN_NO}`}>
                                                    <RoundButtons
                                                        id={`tickBtn-${index}`}
                                                        type="submit"
                                                        name={`tickBtn-${index}`}
                                                        icon={<BsCheckCircle style={{ fontSize: '18px' }} />}
                                                    />
                                                </Link>
                                                <RoundButtons
                                                    id={`printBtn-${index}`}
                                                    type="submit"
                                                    name={`printBtn-${index}`}
                                                    icon={<RiPrinterFill style={{ fontSize: '16px' }} />}
                                                    onClick={() => handleReprintClick(data.STN_NO)}
                                                />
                                            </>
                                        )}
                                        {data.status === 'cancelled' && (
                                            <Link to={`/stock-transfer/OUT/cancelled/${data.STN_NO}`}>
                                                <RoundButtons
                                                    id={`cancelBtn-${index}`}
                                                    type="submit"
                                                    name={`cancelBtn-${index}`}
                                                    icon={<BsXCircle style={{ fontSize: '18px' }} />}
                                                />
                                            </Link>
                                        )}
                                    </div>
                                ),
                            }))}
                            customTableStyle={{ top: '20%', width: '100%' }}
                            itemsPerPage={10}
                        />
                    )}
                </div>
            </div>
            {showStockOUTReceipt && (
                <div className="transfer-doc-popup">
                    <StockTraOut
                        STN_NO={selectedSTN_NO}
                        onClose={handleCloseStockOUTReceipt}
                    />
                </div>
            )}
        </>
    );
};

export default StockTransferOUT;
