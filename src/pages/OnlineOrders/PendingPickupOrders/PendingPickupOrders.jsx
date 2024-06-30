import React, { useEffect, useState } from "react";
import './PendingPickupOrders.css';
import RoundButtons from "../../../Components/Buttons/RoundButtons/RoundButtons";
import { MdDone } from "react-icons/md";
import { BsEye } from 'react-icons/bs';
import { getAllOnlineBills,updateOnlineBill } from "../../../Api/OnlineOrders/OnlineOrdersAPI.jsx";

const PendingPickup = ({ setpickupOrdersCount }) => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await getAllOnlineBills(); 
                const pickupOrders = response.filter(order => order.status === "Pickup");
                setOrders(pickupOrders);
                setpickupOrdersCount(pickupOrders.length);
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };

        fetchOrders();
    }, [setpickupOrdersCount]);

    const handleOrderPickedUp = async (order) => {
        try {
            const updates = { status: "Completed" };
            await updateOnlineBill(order.onlineBillNo, updates);
            setOrders((prevOrders) => prevOrders.filter(o => o.onlineBillNo !== order.onlineBillNo));
            setpickupOrdersCount((prevCount) => prevCount - 1);
        } catch (error) {
            console.error("Error updating order status:", error);
        }
    };

    return (
        <table className="PendingPickupTable">
            <thead>
                <tr>
                    <th>ORD No</th>
                    <th>Branch</th>
                    <th>Customer Name</th>
                    <th>Payment Method</th>
                    <th>Accepted At</th>
                    <th>Accepted By</th>
                    <th></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {orders.map(order => (
                    <tr key={order.onlineBillNo}>
                        <td>{order.onlineBillNo}</td>
                        <td>{order.branch.branchName}</td>
                        <td>{order.customer.firstName} {order.customer.lastName}</td>
                        <td>Card</td>
                        <td>{order.acceptedAt ? new Date(order.acceptedAt).toLocaleString() : 'N/A'}</td>
                        <td>{order.acceptedBy}</td>
                        <td>
                            <RoundButtons 
                                id={`doneBtn-${order.onlineBillNo}`} 
                                type="submit" 
                                name={`doneBtn-${order.onlineBillNo}`} 
                                icon={<MdDone />} 
                                onClick={() => handleOrderPickedUp(order)} 
                            />
                        </td>
                        <td>
                            <RoundButtons 
                                id={`eyeViewBtn-${order.onlineBillNo}`} 
                                type="button" 
                                name={`eyeViewBtn-${order.onlineBillNo}`} 
                                icon={<BsEye />} 
                            />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default PendingPickup;
