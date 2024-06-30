import React, { useState, useEffect } from 'react';
import ReceiptPopup from '../SalesReceiptTemp/ReceiptPopup/ReceiptPopup';
import './WorkOrderReceipt.css';
import InputLabel from '../Label/InputLabel';
import { getOnlineBillByNumber } from '../../Api/OnlineOrders/OnlineOrdersAPI.jsx';
import { getOnlineBillProductsByBillNo } from '../../Api/OnlineBillProducts/OnlineBillProductsAPI.jsx';

const WorkOrderReceipt = ({ onlineOrdNo, onClose }) => {
    const [orderData, setOrderData] = useState(null);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchOrderData = async () => {
            try {
                const orderResponse = await getOnlineBillByNumber(onlineOrdNo);
                setOrderData(orderResponse);

                const productsResponse = await getOnlineBillProductsByBillNo(onlineOrdNo);
                setProducts(productsResponse);
            } catch (error) {
                console.error('Error fetching order data:', error);
            }
        };

        fetchOrderData();
    }, [onlineOrdNo]);

    const handleReprintReceipt = () => {
        window.print();
    };

    if (!orderData) {
        return <div>Loading...</div>;
    }

    const workOrderContent = (
        <div className="work-order-receipt-frame">
            <div className="work-order-receipt-header">
                <h5 className='workordertitle'>Green Leaf Super Mart</h5>
            </div>
            <div className='workOrderHeadingShopName'>
                <h5>Work Order</h5>
            </div>
            <div className='WorkOrderDetails'>
                <InputLabel for="branchName">Branch: <span>{orderData.branch.branchName}</span></InputLabel>
            </div>
            <div className='WorkOrderDetails'>
                <InputLabel for="ordNo">ORD No: <span>{orderData.onlineBillNo}</span></InputLabel>
            </div>
            <div className='WorkOrderDetails'>
                <InputLabel for="customerName">Customer Name: <span>{orderData.customer.firstName} {orderData.customer.lastName}</span></InputLabel>
            </div>
            <div className='WorkOrderDetails'>
                <InputLabel for="acceptedat">Accepted At: <span>{new Date(orderData.acceptedAt).toLocaleString()}</span></InputLabel>
            </div>
            <div className='WorkOrderDetails'>
                <InputLabel for="acceptedby">Accepted By: <span>{orderData.acceptedBy}</span></InputLabel>
            </div>
            <table className='WorkOrderTable'>
                <thead className='WorkOrderTableHead'>
                    <tr>
                        <th>Product Name</th>
                        <th>Qty</th>
                        <th>BatchNo</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((item, index) => (
                        <React.Fragment key={index}>
                            <tr>
                                <td colSpan={4}>{index + 1}. {item.productName}</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td style={{ textAlign: 'left' }}>{item.PurchaseQty}</td>
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
