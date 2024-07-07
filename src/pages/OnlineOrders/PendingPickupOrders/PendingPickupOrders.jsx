import React, { useEffect, useState } from "react";
import './PendingPickupOrders.css';
import RoundButtons from "../../../Components/Buttons/RoundButtons/RoundButtons";
import { MdDone } from "react-icons/md";
import { getAllOnlineBills, updateOnlineBill } from "../../../Api/OnlineOrders/OnlineOrdersAPI.jsx";
import secureLocalStorage from 'react-secure-storage';
import CustomAlert from '../../../Components/Alerts/CustomAlert/CustomAlert.jsx';
import ConfirmationModal from '../../../Components/PopupsWindows/Modal/ConfirmationModal.jsx';
import emailjs from 'emailjs-com';

const PendingPickup = ({ setPickupOrdersCount, onTabChange }) => {
    const [orders, setOrders] = useState([]);
    const [userDetails, setUserDetails] = useState({ username: '' });
    const [showAlert, setShowAlert] = useState(false);
    const [alertDetails, setAlertDetails] = useState({
        severity: 'success',
        title: 'Success',
        message: 'Order picked up successfully!',
        duration: 3000
    });
    const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

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
            }
        };

        fetchOrders();
    }, [setPickupOrdersCount]);

    const handleOrderPickedUp = async () => {
        if (userDetails.username && selectedOrder) {
            const currentTime = new Date().toISOString(); 
            const updates = {
                pickupBy: userDetails.username,
                pickupTime: currentTime,
                status: "Completed"
            };
    
            try {
                await updateOnlineBill(selectedOrder.onlineBillNo, updates);
                setOrders((prevOrders) => prevOrders.filter(o => o.onlineBillNo !== selectedOrder.onlineBillNo));
                setPickupOrdersCount((prevCount) => prevCount - 1);
                setAlertDetails({
                    severity: 'success',
                    title: 'Success',
                    message: 'Order picked up successfully!',
                    duration: 3000
                });
                setShowAlert(true);

                // Send email to customer
                const templateParams = {
                    customer_name: `${selectedOrder.customer.firstName} ${selectedOrder.customer.lastName}`,
                    order_number: selectedOrder.onlineBillNo,
                    email: selectedOrder.customer.email,
                };

                emailjs.send("service_ase4f59","template_1qxggvp", templateParams, 'c0LBbcJjnX0kOW0AK')
                    .then((response) => {
                        console.log('Email sent successfully:', response.status, response.text);
                    }, (error) => {
                        console.error('Failed to send email:', error);
                    });

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
            } finally {
                setConfirmationModalOpen(false); // Close the modal after handling
            }
        }
    };

    const handleOpenConfirmationModal = (order) => {
        setSelectedOrder(order);
        setConfirmationModalOpen(true);
    };

    const handleCloseConfirmationModal = () => {
        setConfirmationModalOpen(false);
        setSelectedOrder(null);
    };

    const handleCloseAlert = () => {
        setShowAlert(false);
    };

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
                            <td>{order.acceptedAt ? new Date(order.acceptedAt).toLocaleString() : 'N/A'}</td>
                            <td>{order.acceptedBy}</td>
                            <td>
                                <RoundButtons 
                                    id={`doneBtn-${order.onlineBillNo}`} 
                                    type="submit" 
                                    name={`doneBtn-${order.onlineBillNo}`} 
                                    icon={<MdDone />} 
                                    onClick={() => handleOpenConfirmationModal(order)} 
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
            <ConfirmationModal
                open={isConfirmationModalOpen}
                onClose={handleCloseConfirmationModal}
                onConfirm={handleOrderPickedUp}
                bodyContent="Are you sure you want to mark this order as Completed?"
                yesBtnBgColor="#23A3DA"
            />
        </>
    );
};

export default PendingPickup;
