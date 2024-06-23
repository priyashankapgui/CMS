import React, { useState, useEffect } from 'react';
import ReceiptPopup from '../SalesReceiptTemp/ReceiptPopup/ReceiptPopup';
import './WorkOrderReceipt.css';
import axios from 'axios';

const WorkOrderReceipt = ({ onlineOrdNo, onClose }) => {

    console.log('Work Order receipt component rendered');


    const handleReprintReceipt = () => {
        window.print();
    };


//implement workorder body content here

    const workOrderContent = (

        <div className="work-order-receipt">
            <div className="work-order-receipt-header">
                <h3 className='workordertitle'>Work Order</h3>
            </div>
            <div className='workOrderheading'>
                <h3>Green Leaf Super Mart</h3>
            </div>
	</div>

    );

    return (
        <ReceiptPopup bodyContent={workOrderContent} onClose={onClose} onPrint={handleReprintReceipt} />
    );
};

export default  WorkOrderReceipt;