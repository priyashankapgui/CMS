import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import './CompletedOrders.css';
import RoundButtons from "../../../Components/Buttons/RoundButtons/RoundButtons";
import { BsEye } from 'react-icons/bs';
import { getAllOnlineBills } from "../../../Api/OnlineOrders/OnlineOrdersAPI.jsx";
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
const Completed = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await getAllOnlineBills(); 
                const completedOrders = response.filter(order => order.status === "Completed");
                setOrders(completedOrders);
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };

        fetchOrders();
    }, []);

    const rows = mapOrdersToRows(orders);

    return (
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
