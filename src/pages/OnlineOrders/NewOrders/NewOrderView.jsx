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

export function NewOrderView() {
    const { onlineBillNo } = useParams();
    const [showPopup, setShowPopup] = useState(false);
    const [orderData, setOrderData] = useState(null);
    const [products, setProducts] = useState([]);
    const [userDetails, setUserDetails] = useState({ username: '' });

    useEffect(() => {
        const userJSON = secureLocalStorage.getItem("user");
        if (userJSON) {
            const user = JSON.parse(userJSON);
            setUserDetails({
                username: user?.userName || user?.employeeName || "",
            });
        }
   },[]);


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

    const handleAcceptClick = async () => {
        if (userDetails.username) {
            const currentTime = new Date();
            const updates = {
                acceptedBy: userDetails.username,
                status: "Processing"
                // acceptedAt: currentTime // Excluding this line as the backend might handle it
            };
    
            try {
                await updateOnlineBill(onlineBillNo, updates);
                setOrderData((prevData) => ({
                    ...prevData,
                    acceptedBy: updates.acceptedBy,
                    status: updates.status,
                    acceptedAt: currentTime // Locally update acceptedAt
                }));
                setShowPopup(true);
            } catch (error) {
                console.error('Error updating online bill:', error);
            }
        }
    };
    

    const handleClosePopup = () => {
        setShowPopup(false);
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
                            <div className='inputFlex'>
                                <InputLabel for="hopetoPickUp" color="#0377A8">Hope to Pick Up: <span>{orderData.hopeToPickup ? new Date(orderData.hopeToPickup).toLocaleString() : 'N/A'}</span></InputLabel>
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
                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th>Gross Total</th>
                                <td><InputField id="" name="grossTotal" editable={false} width="100%" value={calculateGrossTotal()} /></td>
                            </tr>
                            <tr>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th>Total Discount</th>
                                <td><InputField id="" name="discount" editable={false} width="100%" value={calculateTotalDiscount()} /></td>
                            </tr>
                            <tr>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th>Net Total</th>
                                <td><InputField id="" name="netTotal" editable={false} width="100%" value={calculateNetTotal()} /></td>
                            </tr>
                            <tr>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th>Number of Items</th>
                                <td><InputField id="" name="itemCount" editable={false} width="100%" value={numberOfItems} /></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Layout>
            {showPopup && <WorkOrderReceipt onlineOrdNo={orderData.onlineBillNo} onClose={handleClosePopup} />}
        </>
    );
}
