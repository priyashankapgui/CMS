import React from 'react';
import ReceiptPopup from '../../SalesReceiptTemp/ReceiptPopup/ReceiptPopup';
import './GrnDoc.css';
import greenleaf from "../../../Assets/greenleaf.svg";

const GrnDoc = ({ onClose }) => {

    const handleReprintReceipt = () => {
        window.print();
    };

    const GrnDocContent = (
        <div className="GrnDoc-paper-frame">
            <div className="GrnDoc-paper-header">
                <div className="logo">
                    <img className="GrnDoc-paper-sys-logo" src={greenleaf} alt="greenmart logo" />
                    <h4 className='shopName'>Green Leaf Super Mart</h4>
                </div>
            </div>
            <h5 className='GrnDoc-paper-title'>Good Receive Note</h5>
            <div className="GrnDoc-top-details">
                <div className="GrnDoc-top-details-left">
                    <p>GRN No:</p>
                    <p>Branch:</p>
                    <p>Created At:</p>
                </div>
                <div className="GrnDoc-top-details-right">
                    <p>Invoice No:</p>
                    <p>Supplier:</p>
                    <p>Submitted By:</p>
                </div>
            </div>
            <hr className='invoice-line-top' />

            <div className="GrnDoc-bodyContent">
                <table className="GrnDoc-bodyContent-table">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Product ID / Name</th>
                            <th>Batch No</th>
                            <th>Qty</th>
                            <th>Purchase Price</th>
                            <th>Selling Price</th>
                            <th>Free Qty</th>
                            <th>Exp Date</th>
                            <th>Amount</th>
                            <th>Comment</th>
                        </tr>
                    </thead>
                    <tbody>

                    </tbody>
                </table>
            </div>
            <div className="GrnDoc-bottomContent">
                <h5>Total Amount:</h5>
            </div>


            <div className="GrnDoc-paper-footer">
                <hr className='invoice-line-top' />
                <p>© Green Leaf Super Mart - Galle</p>
                <small>- Page <span className="pageNumber"></span> -</small>
            </div>
        </div>
    );

    return (
        <ReceiptPopup bodyContent={GrnDocContent} onClose={onClose} onPrint={handleReprintReceipt} />
    );
};

export default GrnDoc;
