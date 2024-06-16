import React from "react";
import './ProcessingOrders.css'
import RoundButtons from "../../../Components/Buttons/RoundButtons/RoundButtons";
import { MdPrint } from "react-icons/md";
import { MdDone } from "react-icons/md";

const ProcessingOrders = () => {
    return (
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
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>ORD2312228</td>
                    <td>Galle</td>
                    <td>Anuththara Udeshi</td>
                    <td>Card</td>
                    <td>22-12-2023  10:32</td>
                    <td>Pramu Alwis</td>
                    <td><RoundButtons id={`eyeViewBtn`} type="submit" name={`eyeViewBtn`} icon={<MdDone />}/></td>
                    <td><RoundButtons id={`printViewBtn]`} type="print" name={`printViewBtn`} icon={<MdPrint />}/></td>
                </tr>
            </tbody>
        </table>
    );
};

export default ProcessingOrders;
