import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Layout from "../../../../Layout/Layout";
import "./ViewBill.css";
import { RiPrinterFill } from "react-icons/ri";
import { MdOutlineAssignmentReturn } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";
import InputField from '../../../../Components/InputField/InputField';
import InputLabel from '../../../../Components/Label/InputLabel';
import RoundButtons from '../../../../Components/Buttons/RoundButtons/RoundButtons';
import { IoChevronBackCircleOutline } from "react-icons/io5";
import SalesReceipt from '../../../../Components/SalesReceiptTemp/SalesReceipt/SalesReceipt';
import MainSpinner from '../../../../Components/Spinner/MainSpinner/MainSpinner';
import secureLocalStorage from "react-secure-storage";
import { getBilledData, postCancelBill } from '../../../../Api/Billing/SalesApi';
import CustomAlert from '../../../../Components/Alerts/CustomAlert/CustomAlert';
import ConfirmationModal from '../../../../Modal/ConfirmationModal';

export const ViewBill = () => {
    const { billNo } = useParams();
    const [billData, setBillData] = useState(null);
    const [showSalesReceipt, setShowSalesReceipt] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [alert, setAlert] = useState({
        severity: '',
        title: '',
        message: '',
        open: false
    });
    const [userDetails, setUserDetails] = useState({
        userName: "", userRole: ""
    });
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getBilledData(billNo);
                console.log('Bill Data:', response);

                if (response.data && Object.keys(response.data).length > 0) {
                    setBillData(response.data);
                } else {
                    setError('Bill not found');
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (billNo) {
            fetchData();
        } else {
            setLoading(false);
            setError('No bill number provided');
        }
    }, [billNo]);

    useEffect(() => {
        const userJSON = secureLocalStorage.getItem("user");
        if (userJSON) {
            const user = JSON.parse(userJSON);
            setUserDetails({
                userName: user?.userName || user?.employeeName || "",
                userRole: user?.userRole || user?.role || "",
            });
        }
    }, []);

    const handleSubmitCancelBill = async () => {
        const payload = {
            billNo,
            branchName: billData.branchName,
            products: billData.billProducts.map(item => ({
                productId: item.productId,
                batchNo: item.batchNo,
                billQty: item.billQty,
                returnQty: item.billQty,
                sellingPrice: item.sellingPrice,
                discount: item.discount
            }))
        };

        console.log("Cancel Bill Payload:", payload);

        try {
            const response = await postCancelBill(payload);
            console.log("Response:", response);
            if (response.success) {
                console.log("Form submitted!");
                setAlert({
                    severity: 'success',
                    title: 'Bill Cancellation Successfully',
                    message: `${billNo}`,
                    open: true
                });
                window.location.reload();
            } else {
                console.error('Error processing return: Unexpected status', response.status);
                setError('Error processing return');
                setAlert({
                    severity: 'error',
                    title: 'Error',
                    message: 'Error processing return: Unexpected status',
                    open: true
                });
            }
        } catch (error) {
            console.error('Error processing return:', error);
            console.error('Error details:', error.response || error.message || error);
            setError('Error processing return');
        }
    };

    const handleReprintClick = () => {
        console.log("Reprint button clicked");
        setShowSalesReceipt(true);
    };

    const handleCloseSalesReceipt = () => {
        setShowSalesReceipt(false);
    };

    const openConfirmationModal = () => {
        setIsConfirmationModalOpen(true);
    };

    const closeConfirmationModal = () => {
        setIsConfirmationModalOpen(false);
    };

    const confirmCancelBill = () => {
        setIsConfirmationModalOpen(false);
        handleSubmitCancelBill();
        getBilledData(billNo)

    };

    if (loading) {
        return <div><MainSpinner /></div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!billData) {
        return <div>Bill not found</div>;
    }

    const { billNo: selectedBillNo, branchName, billedBy, createdAt, customerName, status, paymentMethod, contactNo, billTotalAmount, billProducts } = billData;

    const userRole = userDetails.userRole.toLowerCase();
    const billedDate = new Date(createdAt);
    const currentTime = new Date();
    const timeDifferenceInHours = (currentTime - billedDate) / (1000 * 60 * 60);

    const isCashier = userRole.includes('cashier');
    const isAdmin = userRole.includes('admin');
    const isSuperAdmin = userRole.includes('super admin');

    const showReturnButton = isSuperAdmin || (isCashier ? timeDifferenceInHours <= 24 : !isAdmin || timeDifferenceInHours <= 240);
    const showCancelButton = isSuperAdmin || (!isCashier && (!isAdmin || timeDifferenceInHours <= 240));

    return (
        <>
            <div className="top-nav-blue-text">
                <div className="viewbill-top-link">
                    <Link to="/work-list">
                        <IoChevronBackCircleOutline style={{ fontSize: "22px", color: "#0377A8" }} />
                    </Link>
                    <h4>View Bill</h4>
                </div>
            </div>
            <Layout>
                <div className="view-bill-top">
                    <div className='view-bill-top-cont'>
                        <div className="cont1">
                            <div className='inputFlex'>
                                <InputLabel htmlFor="branchName" color="#0377A8">Branch: <span>{branchName}</span></InputLabel>
                            </div>
                            <div className='inputFlex'>
                                <InputLabel htmlFor="billNo" color="#0377A8">Bill No: <span>{selectedBillNo}</span></InputLabel>
                            </div>
                            <div className='inputFlex'>
                                <InputLabel htmlFor="status" color="#0377A8">Status: <span>{status}</span></InputLabel>
                            </div>
                        </div>
                        <div className="cont2">
                            <div className='inputFlex'>
                                <InputLabel htmlFor="billedAt" color="#0377A8">Billed At: <span>{new Date(createdAt).toLocaleString('en-GB')}</span></InputLabel>
                            </div>
                            <div className='inputFlex'>
                                <InputLabel htmlFor="billedBy" color="#0377A8">Billed By: <span>{billedBy}</span></InputLabel>
                            </div>
                            <div className='inputFlex'>
                                <InputLabel htmlFor="paymentMethod" color="#0377A8">Payment Method: <span>{paymentMethod}</span></InputLabel>
                            </div>
                        </div>
                        <div className="cont3">
                            <div className='inputFlex'>
                                <InputLabel htmlFor="cusName" color="#0377A8">Customer Name: <span>{customerName}</span></InputLabel>
                            </div>
                            <div className='inputFlex'>
                                <InputLabel htmlFor="cusContact" color="#0377A8">Contact No: <span>{contactNo}</span></InputLabel>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div>
                        <div className='TotAmountBar-viewbill'>
                            <h4>Total Amount: <span>Rs. {billTotalAmount.toFixed(2)}</span></h4>
                        </div>
                        <div className="btnSection-viewBill">
                            {status !== "Canceled" && (
                                <>
                                    {showReturnButton && (
                                        <div className="returnBtn">
                                            <InputLabel> Return Items</InputLabel>
                                            <Link to={`/work-list/viewbill/start-return-items/${billNo}`}>
                                                <RoundButtons id="returnBtn" type="submit" name="returnBtn" icon={<MdOutlineAssignmentReturn />} onClick={() => console.log("Return Button clicked")} />
                                            </Link>
                                        </div>
                                    )}
                                    {!isCashier && showCancelButton && (
                                        <div className="cancelBillBtn">
                                            <InputLabel> Cancel Bill </InputLabel>
                                            <RoundButtons id="cancelBillBtn" type="submit" name="cancelBillBtn" backgroundColor="#EB1313" icon={<AiOutlineClose style={{ color: 'white' }} onClick={openConfirmationModal} />} />
                                        </div>
                                    )}

                                    <div className="reprintBtn">
                                        <InputLabel> Reprint </InputLabel>
                                        <RoundButtons id="reprintBtn" type="submit" name="reprintBtn" icon={<RiPrinterFill />} onClick={handleReprintClick} />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <div className="billed-item-container">
                    <table className='billed-item-table'>
                        <thead>
                            <tr>
                                <th>Product ID / Name</th>
                                <th>Qty</th>
                                <th>Batch No</th>
                                <th>Unit Price</th>
                                <th>Dis%</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {billProducts.map((item, index) => (
                                <tr key={index}>
                                    <td><InputField id={`productId-${index}`} name={`productId-${index}`} editable={false} width="100%" value={`${item.productId} ${item.productName}`} /></td>
                                    <td><InputField id={`billQty-${index}`} name={`billQty-${index}`} editable={false} width="100%" value={item.billQty.toFixed(2)} textAlign='center' /></td>
                                    <td><InputField id={`batchNo-${index}`} name={`batchNo-${index}`} editable={false} width="100%" value={item.batchNo} textAlign='center' /></td>
                                    <td><InputField id={`sellingPrice-${index}`} name={`sellingPrice-${index}`} editable={false} width="100%" value={item.sellingPrice.toFixed(2)} textAlign='center' /></td>
                                    <td><InputField id={`discount-${index}`} name={`discount-${index}`} editable={false} width="100%" value={item.discount.toFixed(2)} textAlign='center' /></td>
                                    <td><InputField id={`totalAmount-${index}`} name={`totalAmount-${index}`} editable={false} width="100%" value={item.totalAmount ? item.totalAmount.toFixed(2) : '0.00'} textAlign='center' /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Layout>
            {showSalesReceipt && (
                <SalesReceipt billNo={billNo} onClose={handleCloseSalesReceipt} />
            )}
            {alert.open && (
                <CustomAlert
                    severity={alert.severity}
                    title={alert.title}
                    message={alert.message}
                    duration={4000}
                    open={alert.open}
                    onClose={() => setAlert({ ...alert, open: false })}
                />
            )}
            <ConfirmationModal
                open={isConfirmationModalOpen}
                onClose={closeConfirmationModal}
                onConfirm={confirmCancelBill}
            />
        </>
    );
};
