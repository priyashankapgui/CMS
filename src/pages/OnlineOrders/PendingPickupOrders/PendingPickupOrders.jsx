import React, { useEffect, useState } from "react";
import './PendingPickupOrders.css';
import RoundButtons from "../../../Components/Buttons/RoundButtons/RoundButtons";
import { MdDone } from "react-icons/md";
import { getAllOnlineBills, updateOnlineBill } from "../../../Api/OnlineOrders/OnlineOrdersAPI.jsx";
import secureLocalStorage from 'react-secure-storage';
import CustomAlert from '../../../Components/Alerts/CustomAlert/CustomAlert.jsx';
import SubSpinner from "../../../Components/Spinner/SubSpinner/SubSpinner.jsx";

const PendingPickup = ({ setPickupOrdersCount, onTabChange }) => {
    const [orders, setOrders] = useState([]);
    const [userDetails, setUserDetails] = useState({ username: '' });
    const [showAlert, setShowAlert] = useState(false);
    const [loading, setLoading] = useState(true);
    const [alertDetails, setAlertDetails] = useState({
        severity: 'success',
        title: 'Success',
        message: 'Order picked up successfully!',
        duration: 3000
    });

    useEffect(() => {
        const userJSON = secureLocalStorage.getItem("user");
        if (userJSON) {
            const user = JSON.parse(userJSON);
            setUserDetails({
                username: user?.userName || user?.employeeName || "",
            });
        }
    }, []);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await getAllOnlineBills();
                const pickupOrders = response.filter(order => order.status === "Pickup");
                setOrders(pickupOrders);
                setPickupOrdersCount(pickupOrders.length);
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [setPickupOrdersCount]);

    const handleOrderPickedUp = async (order) => {
        if (userDetails.username) {
            const currentTime = new Date().toISOString();
            const updates = {
                pickupBy: userDetails.username,
                pickupTime: currentTime,
                status: "Completed"
            };

            try {
                await updateOnlineBill(order.onlineBillNo, updates);
                setOrders((prevOrders) => prevOrders.filter(o => o.onlineBillNo !== order.onlineBillNo));
                setPickupOrdersCount((prevCount) => prevCount - 1);
                setAlertDetails({
                    severity: 'success',
                    title: 'Success',
                    message: 'Order picked up successfully!',
                    duration: 3000
                });
                setShowAlert(true);

                // Switch tab to Completed (index 3)
                onTabChange(3);
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
        }
    };

    const handleCloseAlert = () => {
        setShowAlert(false);
    };

    if (loading) {
        return <SubSpinner />;
    }

    if (orders.length === 0) {
        return <div style={{color:'#dc0808'}}>No pending pickups here...</div>;
    }

    return (
        <>
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
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order.onlineBillNo}>
                            <td>{order.onlineBillNo}</td>
                            <td>{order.branch.branchName}</td>
                            <td>{order.customer.firstName} {order.customer.lastName}</td>
                            <td>Card</td>
                            <td>{order.acceptedAt ? new Date(order.acceptedAt).toLocaleString('en-GB') : 'N/A'}</td>
                            <td>{order.acceptedBy}</td>
                            <td>
                                <RoundButtons
                                    id={`doneBtn-${order.onlineBillNo}`}
                                    backgroundColor='#EBBC00'
                                    type="submit"
                                    name={`doneBtn-${order.onlineBillNo}`}
                                    icon={<MdDone color="white" />}
                                    onClick={() => handleOrderPickedUp(order)}
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

export default PendingPickup;
