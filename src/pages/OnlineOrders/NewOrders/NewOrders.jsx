import React, { useEffect, useState } from "react";
import './NewOrders.css';
import RoundButtons from "../../../Components/Buttons/RoundButtons/RoundButtons";
import { BsEye } from 'react-icons/bs';
import { MdPrint } from "react-icons/md";
import { Link } from "react-router-dom";
import { getAllOnlineBills } from "../../../Api/OnlineOrders/OnlineOrdersAPI.jsx"; 

const NewOrders = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await getAllOnlineBills(); 
                setOrders(response);
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };

        fetchOrders();
    }, []);

    return (
        <table className="NewOrderTable">
            <thead>
                <tr>
                    <th>ORD No</th>
                    <th>Ordered At</th>
                    <th>Branch</th>
                    <th>Customer Name</th>
                    <th>Payment Method</th>
                    <th>Hope to Pick Up</th>
                    <th>Comment</th>
                    <th></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {orders.map(order => (
                    <tr key={order.onlineBillNo}>
                        <td>{order.onlineBillNo}</td>
                        <td>{new Date(order.createdAt).toLocaleString()}</td>
                        <td>{order.branch.branchName}</td>
                        <td>{order.customer.firstName} {order.customer.lastName}</td>
                        <td>Card</td>
                        <td>{new Date(order.hopeToPickup).toLocaleString()}</td>
                        <td>{order.comment}</td>
                        <Link to={`/online-orders/viewOrder/${order.onlineBillNo}`}>
                            <td><RoundButtons id={`eyeViewBtn-${order.onlineBillNo}`} type="submit" name={`eyeViewBtn-${order.onlineBillNo}`} icon={<BsEye />}/></td>
                        </Link>
                        <td><RoundButtons id={`printViewBtn`} type="print" name={`printViewBtn`} icon={<MdPrint />}/></td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default NewOrders;
