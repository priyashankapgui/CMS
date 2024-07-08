import React, { useEffect, useState } from "react";
import './NewOrders.css';
import RoundButtons from "../../../Components/Buttons/RoundButtons/RoundButtons";
import { BsEye } from 'react-icons/bs';
import { Link } from "react-router-dom";
import { getAllOnlineBills } from "../../../Api/OnlineOrders/OnlineOrdersAPI.jsx";
import SubSpinner from "../../../Components/Spinner/SubSpinner/SubSpinner.jsx";
import { getAllOnlineBills } from "../../../Api/OnlineOrders/OnlineOrdersAPI.jsx";

const NewOrders = ({ selectedBranch, setNewOrdersCount, searchClicked }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await getAllOnlineBills();
                let newOrders = response.filter(order => order.status === "New");
                
                if (selectedBranch && selectedBranch !== "All") {
                    newOrders = newOrders.filter(order => order.branch.branchName === selectedBranch);
                }

                const response = await getAllOnlineBills();
                const newOrders = response.filter(order => order.status === "New");
                setOrders(newOrders);
                setNewOrdersCount(newOrders.length);
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false); // Set loading to false after data is fetched
            }
        };

        fetchOrders();
    }, [selectedBranch, searchClicked, setNewOrdersCount]);

    if (loading) {
        return (
            <div>
                <SubSpinner />
            </div>
        );
    }

    return (
        <table className="NewOrderTable">
            <thead>
                <tr>
                    <th>ORD No</th>
                    <th>Ordered At</th>
                    <th>Branch</th>
                    <th>Customer Name</th>
                    <th>Payment Method</th>
                    <th>Comment</th>
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
                        <td>{order.comment}</td>
                        <td>
                            <Link to={`/online-orders/viewOrder/${order.onlineBillNo}`}>
                                <RoundButtons id={`eyeViewBtn-${order.onlineBillNo}`} type="submit" name={`eyeViewBtn-${order.onlineBillNo}`} icon={<BsEye />} />
                                <RoundButtons id={`eyeViewBtn-${order.onlineBillNo}`} type="submit" name={`eyeViewBtn-${order.onlineBillNo}`} icon={<BsEye />} />
                            </Link>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default NewOrders;
