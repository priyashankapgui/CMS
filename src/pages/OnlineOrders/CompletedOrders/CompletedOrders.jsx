import React from "react";
import './CompletedOrders.css'
import RoundButtons from "../../../Components/Buttons/RoundButtons/RoundButtons";
import { BsEye } from 'react-icons/bs';

const Completed = () => {
    return (
        <table className="CompletedOrderTable">
            <thead>
                <tr>
                    <th>ORD No</th>
                    <th>Branch</th>
                    <th>Customer Name</th>
                    <th>Payment Method</th>
                    <th>Accepted At</th>
                    <th>Accepted By</th>
                    <th>Pickup At</th>
                    <th>Issued By</th>
                    <th></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>ORD2312228</td>
                    <td>22-12-2023  11:21</td>
                    <td>Galle</td>
                    <td>Anuththara Udeshi</td>
                    <td>Card</td>
                    <td>22-12-2023  16:00</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td><RoundButtons id={`eyeViewBtn`} type="submit" name={`eyeViewBtn`} icon={<BsEye />}/></td>
                </tr>
            </tbody>
        </table>
    );
};

export default Completed;
