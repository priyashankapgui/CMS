import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import './CompletedOrders.css';
import RoundButtons from "../../../Components/Buttons/RoundButtons/RoundButtons";
import { BsEye } from 'react-icons/bs';
import { getAllOnlineBills } from "../../../Api/OnlineOrders/OnlineOrdersAPI.jsx";
import SubSpinner from "../../../Components/Spinner/SubSpinner/SubSpinner.jsx";
import TableWithPagi from "../../../Components/Tables/TableWithPagi.jsx";
const columns = [
    "ORD No", 
    "Ordered At", 
    "Branch", 
    "Customer Name", 
    "Payment Method", 
    "Accepted At", 
    "Accepted By", 
    "Pickup At", 
    "Issued By", 
    "Actions"
];

const mapOrdersToRows = (orders) => {
    return orders.map(order => ({
        orderNo: order.onlineBillNo,
        orderedAt: new Date(order.createdAt).toLocaleString(),
        branch: order.branch.branchName,
        customerName: `${order.customer.firstName} ${order.customer.lastName}`,
        paymentMethod: "Card",
        acceptedAt: order.acceptedAt ? new Date(order.acceptedAt).toLocaleString() : 'N/A',
        acceptedBy: order.acceptedBy,
        pickupAt: order.pickupTime ? new Date(order.pickupTime).toLocaleString() : 'N/A',
        issuedBy: order.pickupBy,
        actions: (
            <Link to={`/online-orders/viewCompleteOrder/${order.onlineBillNo}`}>
                <RoundButtons 
                    id={`eyeViewBtn-${order.onlineBillNo}`} 
                    type="button" 
                    name={`eyeViewBtn-${order.onlineBillNo}`} 
                    icon={<BsEye />} 
                />
            </Link>
        )
    }));
};
const Completed = ({selectedBranch,searchClicked}) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await getAllOnlineBills();
                const completedOrders = response.filter(order => order.status === "Completed");
                const response = await getAllOnlineBills(); 
                let completedOrders = response.filter(order => order.status === "Completed");
                
                if (selectedBranch && selectedBranch !== "All") {
                    completedOrders = completedOrders.filter(order => order.branch.branchName === selectedBranch);
                }
    
                setOrders(completedOrders);
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchOrders();
    }, [selectedBranch, searchClicked]);
    if (loading) {
        return <SubSpinner />;
    }

    if (orders.length === 0) {
        return <div style={{ color: '#dc0808' }}>Completed orders not available...</div>;
    }

    const rows = mapOrdersToRows(orders);

    return (
        <table className="CompletedOrderTable">
            <thead>
                <tr>
                    <th>ORD No</th>
                    <th>Ordered At</th>
                    <th>Branch</th>
                    <th>Customer Name</th>
                    <th>Payment Method</th>
                    <th>Accepted At</th>
                    <th>Accepted By</th>
                    <th>Pickup At</th>
                    <th>Issued By</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {orders.map(order => (
                    <tr key={order.onlineBillNo}>
                        <td>{order.onlineBillNo}</td>
                        <td>{new Date(order.createdAt).toLocaleString('en-GB')}</td>
                        <td>{order.branch.branchName}</td>
                        <td>{order.customer.firstName} {order.customer.lastName}</td>
                        <td>Card</td>
                        <td>{order.acceptedAt ? new Date(order.acceptedAt).toLocaleString('en-GB') : 'N/A'}</td>
                        <td>{order.acceptedBy}</td>
                        <td>{order.pickupTime ? new Date(order.pickupTime).toLocaleString('en-GB') : 'N/A'}</td>
                        <td>{order.pickupBy}</td>
                        <td>
                            <Link to={`/online-orders/viewCompleteOrder/${order.onlineBillNo}`}>
                                <RoundButtons
                                    id={`eyeViewBtn-${order.onlineBillNo}`}
                                    type="button"
                                    name={`eyeViewBtn-${order.onlineBillNo}`}
                                    icon={<BsEye />}
                                />
                            </Link>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        <div className="completed-orders-container">
            <TableWithPagi 
                rows={rows} 
                columns={columns} 
                itemsPerPage={5} 
                headerColor="#262626"
            />
        </div>
    );
};

export default Completed;
