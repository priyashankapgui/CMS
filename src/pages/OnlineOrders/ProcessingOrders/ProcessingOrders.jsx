import React, { useEffect, useState } from "react";
import './ProcessingOrders.css';
import RoundButtons from "../../../Components/Buttons/RoundButtons/RoundButtons";
import { MdDone } from "react-icons/md";
import { getAllOnlineBills, updateOnlineBill } from "../../../Api/OnlineOrders/OnlineOrdersAPI.jsx";
import CustomAlert from '../../../Components/Alerts/CustomAlert/CustomAlert.jsx';

const ProcessingOrders = ({ setProcessingOrdersCount, onTabChange }) => {
    const [orders, setOrders] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [alertDetails, setAlertDetails] = useState({
        severity: 'success',
        title: 'Success',
        message: 'Order processed successfully!',
        duration: 3000
    });

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await getAllOnlineBills();
                const processingOrders = response.filter(order => order.status === "Processing");
                console.log("Processing Orders Fetched:", processingOrders); // Debug log
                setOrders(processingOrders);
                setProcessingOrdersCount(processingOrders.length); 
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };

        fetchOrders();
    }, [setProcessingOrdersCount]);

    const handleProcessingDone = async (order) => {
        try {
            const updates = { status: "Pickup" };
            await updateOnlineBill(order.onlineBillNo, updates);
            setOrders((prevOrders) => prevOrders.filter(o => o.onlineBillNo !== order.onlineBillNo));
            setProcessingOrdersCount((prevCount) => prevCount - 1);
            console.log("Order Processed and Count Updated:", orders.length); // Debug log
            setAlertDetails({
                severity: 'success',
                title: 'Success',
                message: 'Order processed successfully!',
                duration: 3000
            });
            setShowAlert(true);

            // Switch tab to Pending Pickup (index 2)
            onTabChange(2);
        } catch (error) {
            console.error("Error updating order status:", error);
            setAlertDetails({
                severity: 'error',
                title: 'Error',
                message: 'Failed to update order status. Please try again.',
                duration: 3000
            });
            setShowAlert(true);
        }
    };

    const handleCloseAlert = () => {
        setShowAlert(false);
    };

    return (
        <>
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
                        </tr>
                    ))}
                </tbody>
            </table>
            {showAlert && (
                <CustomAlert
                    severity={alertDetails.severity}
                    title={alertDetails.title}
                    message={alertDetails.message}
                    duration={alertDetails.duration}
                    onClose={handleCloseAlert}
                />
            )}
        </>
    );
};

export default ProcessingOrders;
