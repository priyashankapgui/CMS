import React, { useEffect, useState } from "react";
import './ProcessingOrders.css';
import RoundButtons from "../../../Components/Buttons/RoundButtons/RoundButtons";
import { MdDone } from "react-icons/md";
import { getAllOnlineBills, updateOnlineBill } from "../../../Api/OnlineOrders/OnlineOrdersAPI.jsx";

const ProcessingOrders = ({ setprocessingOrdersCount }) => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await getAllOnlineBills(); 
                const processingOrders = response.filter(order => order.status === "Processing");
                setOrders(processingOrders);
                setprocessingOrdersCount(processingOrders.length);
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };

        fetchOrders();
    }, [setprocessingOrdersCount]);

    const handleProcessingDone = async (order) => {
        try {
            const updates = { status: "Pickup" };
            await updateOnlineBill(order.onlineBillNo, updates);
            setOrders((prevOrders) => prevOrders.filter(o => o.onlineBillNo !== order.onlineBillNo));
            setprocessingOrdersCount((prevCount) => prevCount - 1);
        } catch (error) {
            console.error("Error updating order status:", error);
        }
    };

    return (
        <table className="ProcessingOrdersTable">
            <thead>
                <tr>
                    <th>ORD No</th>
                    <th>Branch</th>
                    <th>Customer Name</th>
                    <th>Payment Method</th>
                    <th>Accepted At</th>
                    <th>Accepted By</th>
                    <th></th>
                    {/* <th></th> */}
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
                                onClick={() => handleProcessingDone(order)} 
                            />
                        </td>
                        {/* <td><RoundButtons id={`printBtn-${order.onlineBillNo}`} type="print" name={`printBtn-${order.onlineBillNo}`} icon={<MdPrint />}/></td> */}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default ProcessingOrders;
