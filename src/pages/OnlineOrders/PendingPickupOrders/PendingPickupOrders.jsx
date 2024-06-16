import React from "react";
import './PendingPickupOrders.css'
import RoundButtons from "../../../Components/Buttons/RoundButtons/RoundButtons";
import { MdDone } from "react-icons/md";
import { BsEye } from 'react-icons/bs';

const PendingPickup = () => {
    return (
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
                    <td><RoundButtons id={`eyeViewBtn`} type="submit" name={`eyeViewBtn`} icon={<MdDone/>}/></td>
                    <td><RoundButtons id={`printViewBtn]`} type="print" name={`printViewBtn`} icon={<BsEye />}/></td>
                </tr>
            </tbody>
        </table>
    );
};

export default PendingPickup;
