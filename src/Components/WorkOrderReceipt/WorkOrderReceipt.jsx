import React, { useState, useEffect } from 'react';
import ReceiptPopup from '../SalesReceiptTemp/ReceiptPopup/ReceiptPopup';
import './WorkOrderReceipt.css';
import { getOnlineBillByNumber } from '../../Api/OnlineOrders/OnlineOrdersAPI.jsx';
import { getOnlineBillProductsByBillNo } from '../../Api/OnlineBillProducts/OnlineBillProductsAPI.jsx';

const WorkOrderReceipt = ({ onlineOrdNo, onClose }) => {
    const [orderData, setOrderData] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true); // Add a loading state

    useEffect(() => {
        const fetchOrderData = async () => {
            try {
                const orderResponse = await getOnlineBillByNumber(onlineOrdNo);
                setOrderData(orderResponse);

                const productsResponse = await getOnlineBillProductsByBillNo(onlineOrdNo);
                setProducts(productsResponse);
            } catch (error) {
                console.error('Error fetching order data:', error);
            } finally {
                setLoading(false); // Set loading to false after data is fetched
            }
        };

        fetchOrderData();
    }, [onlineOrdNo]);

    const handleReprintReceipt = () => {
        window.print();
    };

    if (loading) {
        return <div>Loading...</div>; // Display a loading message while data is being fetched
    }

    if (!orderData) {
        return <div>Error: No order data found</div>; // Display an error message if orderData is null
    }

    const workOrderContent = (
        <div className="work-order-receipt-frame">
            <div className="work-order-receipt-header">
                <h5 className='workordertitle'>Green Leaf Super Mart</h5>
            </div>
            <div className='workOrderHeadingShopName'>
                <h5>Work Order</h5>
            </div>
            <hr className='invoice-line-top' />

            <table className='workorder-details-table'>
                <tbody>
                    <tr>
                        <td className='workorder-details-label'>Branch:</td>
                        <td className='workorder-details-value'>{orderData.branch.branchName}</td>
                    </tr>
                    <tr>
                        <td className='workorder-details-label'>ORD No:</td>
                        <td className='workorder-details-value'>{orderData.onlineBillNo}</td>
                    </tr>
                    <tr>
                        <td className='workorder-details-label'>Name:</td>
                        <td className='workorder-details-value'>{orderData.customer.firstName} {orderData.customer.lastName}</td>
                    </tr>
                    <tr>
                        <td className='workorder-details-label'>Accepted At:</td>
                        <td className='workorder-details-value'>{new Date().toLocaleString('en-GB')}</td>
                    </tr>
                    <tr>
                        <td className='workorder-details-label'>Accepted By:</td>
                        <td className='workorder-details-value'>{orderData.acceptedBy}</td>
                    </tr>
                </tbody>
            </table>
            <hr className='invoice-line-top' />

            <table className='WorkOrderTable'>
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th style={{ textAlign: 'left' }}>Qty</th>
                        <th style={{ textAlign: 'center' }}>Batch No</th>
                        <th style={{ textAlign: 'right' }}>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((item, index) => (
                        <React.Fragment key={index}>
                            <tr>
                                <td colSpan={4}>{index + 1}. {item.productName}</td>
                            </tr>
                            <tr>
                                <td>{item.productId}</td>
                                <td style={{ textAlign: 'left' }}>{parseFloat(item.PurchaseQty).toFixed(2)}</td>
                                <td style={{ textAlign: 'center' }}>{item.batchNo}</td>
                                <td style={{ textAlign: 'right' }}>{parseFloat(item.sellingPrice).toFixed(2)}</td>
                            </tr>
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <ReceiptPopup bodyContent={workOrderContent} onClose={onClose} onPrint={handleReprintReceipt} />
    );
};

export default WorkOrderReceipt;
