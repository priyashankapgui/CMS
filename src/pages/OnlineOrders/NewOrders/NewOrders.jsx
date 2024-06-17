import React from "react";
import './NewOrders.css';
import RoundButtons from "../../../Components/Buttons/RoundButtons/RoundButtons";
import { BsEye } from 'react-icons/bs';
import { MdPrint } from "react-icons/md";

const NewOrders = () => {
    return (
        <table className="NewOrderTable">
            <thead>
                <tr>
                    <th>ORD No</th>
                    <th>Ordered At</th>
                    <th>Branch</th>
                    <th>Customer Name</th>
                    <th>Payment Method</th>
                    <th>Hope to Pick Up</th>
                    <th>Comment</th>
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
                    <td><RoundButtons id={`eyeViewBtn`} type="submit" name={`eyeViewBtn`} icon={<BsEye />}/></td>
                    <td><RoundButtons id={`printViewBtn]`} type="print" name={`printViewBtn`} icon={<MdPrint />}/></td>
                </tr>
            </tbody>
        </table>
    );
};

export default NewOrders;
