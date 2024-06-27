import React, { useState, useEffect } from 'react';
import ReceiptPopup from '../SalesReceiptTemp/ReceiptPopup/ReceiptPopup';
import './WorkOrderReceipt.css';
import axios from 'axios';

const WorkOrderReceipt = ({ onlineOrdNo, onClose }) => {

    console.log('Work Order receipt component rendered');


    const handleReprintReceipt = () => {
        window.print();
    };


    const workOrderContent = (

        <div className="work-order-receipt-frame">
            <div className="work-order-receipt-header">
                <h5 className='workordertitle'>Work Order</h5>
            </div>
            <div className='workOrderHeadingShopName'>
                <h5>Green Leaf Supe Mart </h5>
            </div>
	</div>

    );

    return (
        <ReceiptPopup bodyContent={workOrderContent} onClose={onClose} onPrint={handleReprintReceipt} />
    );
};

export default  WorkOrderReceipt;