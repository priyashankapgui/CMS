import React, { useState, useEffect } from 'react';
import TableWithPagi from '../../../Components/Tables/TableWithPagi';
import { Link } from 'react-router-dom';
import RoundButtons from '../../../Components/Buttons/RoundButtons/RoundButtons';
import { BsEye } from "react-icons/bs";
import { RiPrinterFill } from "react-icons/ri";
import { TiTickOutline } from "react-icons/ti";
import { MdOutlineCancel } from "react-icons/md";
import secureLocalStorage from "react-secure-storage";
import StockTranIn from '../../../Components/InventoryDocuments/St-In-Doc/StockTraIn';
import { getAllTransfers } from '../../../Api/Inventory/StockTransfer/StockTransferAPI';

const StockTransferIn = ({ searchParams }) => {
    console.log("searchPramas",searchParams);
    const [stockData, setStockData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSTN_NO, setSelectedSTN_NO] = useState(null); 
    const [showRefundReceipt, setShowRefundReceipt] = useState(false);
    

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
                    response.data = response.data.filter(transfer => transfer.supplyingBranch === user.branchName);
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
                }
                if (searchParams.requestBranch !== 'All' && searchParams.supplyingBranch === 'All') {
                    filteredData = filteredData.filter(
                        (item) => item.requestBranch === searchParams.requestBranch
                    );
                } if (searchParams.supplyingBranch !== 'All' && searchParams.requestBranch === 'All') {
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
        setShowRefundReceipt(true);
    };

    const handleCloseRefundReceipt = () => {
        setShowRefundReceipt(false);
        setSelectedSTN_NO(null);
    };

    return (
        <>
            <div className="stockTransferIN-bodycontainer">
                <div className="stockTransferIN-content-middle">
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
                                        <Link to={`/stock-transfer/issuing/${data.STN_NO}`}>
                                            <RoundButtons
                                                id={`eyeViewBtn-${index}`}
                                                type="submit"
                                                name={`eyeViewBtn-${index}`}
                                                icon={<BsEye />}
                                            />
                                        </Link>
                                    )}
                                    {data.status === 'completed' && (
                                        <>
                                            <Link to={`/stock-transfer/completed/${data.STN_NO}`}>
                                                <RoundButtons
                                                    id={`tickBtn-${index}`}
                                                    type="submit"
                                                    name={`tickBtn-${index}`}
                                                    icon={<TiTickOutline />}
                                                />
                                            </Link>
                                            <RoundButtons
                                                id={`printBtn-${index}`}
                                                type="submit"
                                                name={`printBtn-${index}`}
                                                icon={<RiPrinterFill />}
                                                onClick={() => handleReprintClick(data.STN_NO)}
                                            />
                                        </>
                                    )}
                                    {data.status === 'cancelled' && (
                                        <Link to={`/stock-transfer/cancelled/${data.STN_NO}`}>
                                            <RoundButtons
                                                id={`tickBtn-${index}`}
                                                type="submit"
                                                name={`tickBtn-${index}`}
                                                icon={<MdOutlineCancel />}
                                            />
                                        </Link>
                                    )}
                                </div>
                            ),
                        }))}
                        customTableStyle={{ top: '20%', width: '100%' }}
                        itemsPerPage={10}
                    />
                </div>
            </div>
            {showRefundReceipt && (
                <div className="transfer-doc-popup">
                    <StockTranIn
                        STN_NO={selectedSTN_NO}
                        onClose={handleCloseRefundReceipt}
                    />
                </div>
            )}
        </>
    );
};

export default StockTransferIn;
