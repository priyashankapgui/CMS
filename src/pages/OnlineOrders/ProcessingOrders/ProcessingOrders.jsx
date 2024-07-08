import React, { useEffect, useState } from "react";
import './ProcessingOrders.css';
import RoundButtons from "../../../Components/Buttons/RoundButtons/RoundButtons";
import { MdDone } from "react-icons/md";
import { getAllOnlineBills, updateOnlineBill } from "../../../Api/OnlineOrders/OnlineOrdersAPI.jsx";
import CustomAlert from '../../../Components/Alerts/CustomAlert/CustomAlert.jsx';
import ConfirmationModal from '../../../Components/PopupsWindows/Modal/ConfirmationModal.jsx';
import emailjs from 'emailjs-com';
import SubSpinner from "../../../Components/Spinner/SubSpinner/SubSpinner.jsx";

const ProcessingOrders = ({ setProcessingOrdersCount, onTabChange,selectedBranch,searchClicked }) => {
    const [orders, setOrders] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [loading, setLoading] = useState(true);
    const [alertDetails, setAlertDetails] = useState({
        severity: 'success',
        title: 'Success',
        message: 'Order processed successfully!',
        duration: 3000
    });
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await getAllOnlineBills();
                let processingOrders = response.filter(order => order.status === "Processing");
                
                if (selectedBranch && selectedBranch !== "All") {
                    processingOrders = processingOrders.filter(order => order.branch.branchName === selectedBranch);
                }
    
                setOrders(processingOrders);
                setProcessingOrdersCount(processingOrders.length); 
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchOrders();
    }, [selectedBranch, searchClicked, setProcessingOrdersCount]);
    
    const handleProcessingDone = async (order) => {
        try {
            const updates = { status: "Pickup" };
            await updateOnlineBill(order.onlineBillNo, updates);
            setOrders((prevOrders) => prevOrders.filter(o => o.onlineBillNo !== order.onlineBillNo));
            setProcessingOrdersCount((prevCount) => prevCount - 1);
            console.log("Order Processed and Count Updated:", orders.length);
            setAlertDetails({
                severity: 'success',
                title: 'Success',
                message: 'Order processed successfully!',
                duration: 3000
            });
            setShowAlert(true);

            onTabChange(2);

            const templateParams = {
                customer_name: `${order.customer.firstName} ${order.customer.lastName}`,
                order_number: order.onlineBillNo,
                email: order.customer.email,
            };

            emailjs.send("service_ase4f59","template_iigr25h", templateParams, 'c0LBbcJjnX0kOW0AK')
                .then((response) => {
                    console.log('Email sent successfully:', response.status, response.text);
                }, (error) => {
                    console.error('Failed to send email:', error);
                });
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

    const openConfirmationModal = (order) => {
        setSelectedOrder(order);
        setIsConfirmationModalOpen(true);
    };

    const closeConfirmationModal = () => {
        setSelectedOrder(null);
        setIsConfirmationModalOpen(false);
    };

    const confirmProcessingDone = () => {
        if (selectedOrder) {
            handleProcessingDone(selectedOrder);
        }
        closeConfirmationModal();
    };

    const handleCloseAlert = () => {
        setShowAlert(false);
    };

    if (loading) {
        return <SubSpinner />;
    }

    if (orders.length === 0) {
        return <div style={{ color: '#dc0808' }}>Processing orders are not here...</div>;
    }

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
                            <td>{order.acceptedAt ? new Date(order.acceptedAt).toLocaleString('en-GB') : 'N/A'}</td>
                            <td>{order.acceptedBy}</td>
                            <td>
                                <RoundButtons 
                                    id={`doneBtn-${order.onlineBillNo}`} 
                                    backgroundColor='#16A8D6'
                                    type="submit" 
                                    name={`doneBtn-${order.onlineBillNo}`} 
                                    icon={<MdDone color="white" />} 
                                    onClick={() => openConfirmationModal(order)} 
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
                onClose={closeConfirmationModal}
                onConfirm={confirmProcessingDone}
                bodyContent="Are you sure you want to mark this order as processed and ready for pickup?"
                yesBtnBgColor="#23A3DA"
            />
        </>
    );
};

export default ProcessingOrders;
