import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from "../../../Layout/Layout";
import "./NewOrderView.css";
import { IoChevronBackCircleOutline } from 'react-icons/io5';
import InputField from '../../../Components/InputField/InputField';
import InputLabel from '../../../Components/Label/InputLabel';
import RoundButtons from '../../../Components/Buttons/RoundButtons/RoundButtons';
import { MdDone } from 'react-icons/md';
import WorkOrderReceipt from '../../../Components/WorkOrderReceipt/WorkOrderReceipt';
import { getOnlineBillByNumber, updateOnlineBill } from '../../../Api/OnlineOrders/OnlineOrdersAPI.jsx';
import { getOnlineBillProductsByBillNo } from '../../../Api/OnlineBillProducts/OnlineBillProductsAPI.jsx';
import secureLocalStorage from 'react-secure-storage';
import CustomAlert from '../../../Components/Alerts/CustomAlert/CustomAlert.jsx';
import ConfirmationModal from '../../../Components/PopupsWindows/Modal/ConfirmationModal.jsx';

export function NewOrderView() {
    const { onlineBillNo } = useParams();
    const [showPopup, setShowPopup] = useState(false);
    const [orderData, setOrderData] = useState(null);
    const [products, setProducts] = useState([]);
    const [userDetails, setUserDetails] = useState({ username: '' });
    const [showAlert, setShowAlert] = useState(false);
    const [alertDetails, setAlertDetails] = useState({
        severity: 'success',
        title: 'Success',
        message: 'You have successfully accepted the order!',
        duration: 3000
    });
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

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
        const fetchOrderData = async () => {
            try {
                const orderResponse = await getOnlineBillByNumber(onlineBillNo);
                setOrderData(orderResponse);

                const productsResponse = await getOnlineBillProductsByBillNo(onlineBillNo);
                setProducts(productsResponse);
            } catch (error) {
                console.error('Error fetching order data:', error);
            }
        };

        fetchOrderData();
    }, [onlineBillNo]);

    const handleAcceptClick = () => {
        setIsConfirmationModalOpen(true);
    };

    const closeConfirmationModal = () => {
        setIsConfirmationModalOpen(false);
    };

    const confirmAcceptOrder = async () => {
        setIsConfirmationModalOpen(false);
        if (userDetails.username) {
            const currentTime = new Date().toISOString(); 
            const updates = {
                acceptedBy: userDetails.username,
                status: "Processing",
                acceptedAt: currentTime 
            };

            try {
                await updateOnlineBill(onlineBillNo, updates);
                setOrderData((prevData) => ({
                    ...prevData,
                    acceptedBy: updates.acceptedBy,
                    status: updates.status,
                    acceptedAt: currentTime 
                }));
                setShowPopup(true);
                setShowAlert(true);
            } catch (error) {
                console.error('Error updating online bill:', error);
                setAlertDetails({
                    severity: 'error',
                    title: 'Error',
                    message: 'Failed to accept the order. Please try again.',
                    duration: 3000
                });
                setShowAlert(true);
            }
        }
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    const handleCloseAlert = () => {
        setShowAlert(false);
    };

    const calculateAmount = (item) => {
        const unitPrice = parseFloat(item.sellingPrice);
        const qty = parseFloat(item.PurchaseQty);
        const discount = parseFloat(item.discount);
        return (unitPrice * qty - (unitPrice * qty * discount / 100)).toFixed(2);
    };

    const calculateGrossTotal = () => {
        return products.reduce((total, item) => total + parseFloat(item.sellingPrice) * item.PurchaseQty, 0).toFixed(2);
    };

    const calculateTotalDiscount = () => {
        return products.reduce((total, item) => {
            const discountAmount = (parseFloat(item.sellingPrice) * item.PurchaseQty) * (parseFloat(item.discount) / 100);
            return total + discountAmount;
        }, 0).toFixed(2);
    };

    const calculateNetTotal = () => {
        return products.reduce((total, item) => total + parseFloat(calculateAmount(item)), 0).toFixed(2);
    };

    const numberOfItems = products.length;

    if (!orderData) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div className='top-nav-blue-text'>
                <div className='ViewOnlineDetails'>
                    <Link to="/online-orders">
                        <IoChevronBackCircleOutline style={{ fontSize: "22px", color: "#0377A8" }} />
                    </Link>
                    <h4>View Order</h4>
                </div>
            </div>
            <Layout>
                <div className='View-onlineorder-top'>
                    <div className='View-onlineorder-top-cont'>
                        <div className='detail1'>
                            <div className='inputFlex'>
                                <InputLabel for="branchName" color="#0377A8">Branch: <span>{orderData.branch.branchName}</span></InputLabel>
                            </div>
                            <div className='inputFlex'>
                                <InputLabel for="ordNo" color="#0377A8">ORD No: <span>{orderData.onlineBillNo}</span></InputLabel>
                            </div>
                            <div className='inputFlex'>
                            <InputLabel for="orderedat" color="#0377A8">Ordered At: <span>{new Date(orderData.createdAt).toLocaleString()}</span></InputLabel>
                            </div>
                        </div>
                        <div className='detail2'>
                            <div className='inputFlex'>
                                <InputLabel for="customerName" color="#0377A8">Customer Name: <span>{orderData.customer.firstName} {orderData.customer.lastName}</span></InputLabel>
                            </div>
                            <div className='inputFlex'>
                                <InputLabel for="paymentMethod" color="#0377A8">Payment Method: <span>Card</span></InputLabel>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div className='View-onlineorder-bottom-cont'>
                        <div className='onlineOrderRBtn'>
                            <InputLabel> Accept </InputLabel>
                            <RoundButtons id="acceptbtn" type="submit" name="acceptbtn" icon={<MdDone />} onClick={handleAcceptClick} />
                        </div>
                    </div>
                </div>
                <div className='viewOnlineOrderItem'>
                    <table className='viewonlineitemtable'>
                        <thead>
                            <tr>
                                <th>Product ID</th>
                                <th>Product Name</th>
                                <th>Qty</th>
                                <th>Unit Price</th>
                                <th>Dis%</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length > 0 ? (
                                products.map(item => (
                                    <tr key={`${item.productId}-${item.batchNo}-${item.branchId}`}>
                                        <td><InputField id="" name="productId" editable={false} width="100%" value={item.productId} /></td>
                                        <td><InputField id="" name="productName" editable={false} width="300px" value={item.productName} /></td>
                                        <td><InputField id="" name="qty" editable={false} width="100%" value={item.PurchaseQty} /></td>
                                        <td><InputField id="" name="unitPrice" editable={false} width="100%" value={item.sellingPrice} /></td>
                                        <td><InputField id="" name="discount" editable={false} width="100%" value={item.discount} /></td>
                                        <td><InputField id="" name="amount" editable={false} width="100%" value={calculateAmount(item)} /></td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6">No items found</td>
                                </tr>
                            )}
                            <tr>
                                <td colSpan="6">
                                    <div className="summary-box">
                                        <div className="summary-row">
                                            <span>Gross Total:</span>
                                            <InputField className="Onlineinput" id="" name="grossTotal" editable={false} width="100%" value={calculateGrossTotal()} />
                                        </div>
                                        <div className="summary-row">
                                            <span>Total Discount:</span>
                                            <InputField className="Onlineinput" id="" name="discount" editable={false} width="100%" value={calculateTotalDiscount()} />
                                        </div>
                                        <div className="summary-row">
                                            <span>Net Total:</span>
                                            <InputField className="Onlineinput" id="" name="netTotal" editable={false} width="100%" value={calculateNetTotal()} />
                                        </div>
                                        <div className="summary-row">
                                            <span>Number of Items:</span>
                                            <InputField className="Onlineinput" id="" name="itemCount" editable={false} width="100%" value={numberOfItems} />
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Layout>
            {showPopup && <WorkOrderReceipt onlineOrdNo={orderData.onlineBillNo} onClose={handleClosePopup} />}
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
                onConfirm={confirmAcceptOrder}
                bodyContent="Are you sure you want to accept this order?"
                yesBtnBgColor="#23A3DA"
            />
        </>
    );
}
