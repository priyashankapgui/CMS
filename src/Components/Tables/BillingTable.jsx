import React, { useState} from 'react';
import InputField from '../InputField/InputField';
import InputDropdown from '../InputDropdown/InputDropdown';
import { FiPlus } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { CiSearch } from "react-icons/ci";


const BillingTable = () => {
 
    const [rows, setRows] = useState([
        { id: 1, productID: '', productName: '', billQty: '', batchNo: '', avbQty: '', unitPrice: '', discount: '', amount: '' }
    ]);

    const handleAddRow = () => {
        const newRow = { id: rows.length + 1, productID: '', productName: '', billQty: '', batchNo: '', avbQty: '', unitPrice: '', discount: '', amount: '' };
        setRows([...rows, newRow]);
    };

    const handleDeleteRow = (id) => {
        if (id === 1) {
            // Clear the entered data in the fields of the first row
            const updatedRows = rows.map(row => {
                if (row.id === 1) {
                    return { ...row, productID: '', productName: '', billQty: '', batchNo: '', avbQty: '', unitPrice: '', discount: '', amount: '' };
                }
                return row;
            });
            setRows(updatedRows);
        } else {
            // Remove the respective row
            const updatedRows = rows.filter(row => row.id !== id);
            setRows(updatedRows);
        }
    };

    const handleInputChange = (id, name, value) => {
        const updatedRows = rows.map(row => {
            if (row.id === id) {
                return { ...row, [name]: value };
            }
            return row;
        });
        setRows(updatedRows);
    };

    return (
        <table>
            <thead style={{ backgroundColor: "#E9E9E9", fontSize: "0.875em" }}>
                <tr>
                    <th>Product ID</th>
                    <th>Product Name</th>
                    <th>Qty</th>
                    <th>Batch No</th>
                    <th>Avb. Qty</th>
                    <th>Unit Price</th>
                    <th>Dis%</th>
                    <th>Amount</th>

                </tr>
            </thead>
            <tbody>
                {rows.map(row => (
                    <tr key={row.id}>
                        <td><InputField type="text" id={`productID_${row.id}`} name="productID" editable={true} width="151px" value={row.productID} onChange={(e) => handleInputChange(row.id, 'productID', e.target.value)} /></td>
                        <td><InputField type="text" id={`productName_${row.id}`} name="productName" editable={true} width="300px" value={row.productName} onChange={(e) => handleInputChange(row.id, 'productName', e.target.value)}><CiSearch /></InputField></td>
                        <td><InputField type="text" id={`billQty_${row.id}`} name="billQty" editable={true} width="90px" value={row.billQty} onChange={(e) => handleInputChange(row.id, 'billQty', e.target.value)} /></td>
                        <td><InputDropdown id={`batchNo_${row.id}`} name="batchNo" width="154px" options={['', '', '']} editable={true} value={row.batchNo} onChange={(e) => handleInputChange(row.id, 'batchNo', e.target.value)} /></td>                        {/* <td><InputField type="text" id={`batchNo_${row.id}`} name="batchNo" editable="true" width="154px" value={row.batchNo} onChange={(e) => handleInputChange(row.id, 'batchNo', e.target.value)} /></td> */}
                        <td><InputField type="text" id={`avbQty_${row.id}`} name="avbQty" editable={false} width="90px" value={row.avbQty} onChange={(e) => handleInputChange(row.id, 'avbQty', e.target.value)} /></td>
                        <td><InputField type="text" id={`unitPrice_${row.id}`} name="unitPrice" editable={false} width="95px" value={row.unitPrice} onChange={(e) => handleInputChange(row.id, 'unitPrice', e.target.value)} /></td>
                        <td><InputField type="text" id={`discount_${row.id}`} name="discount" editable={true} width="60px" value={row.discount} onChange={(e) => handleInputChange(row.id, 'discount', e.target.value)} /></td>
                        <td><InputField type="text" id={`amount_${row.id}`} name="amount" editable={false} width="95px" value={row.amount} onChange={(e) => handleInputChange(row.id, 'amount', e.target.value)} /></td>
                        {row.id === 1 ? (
                            <>
                                <td style={{ paddingRight: '15px' }}><FiPlus onClick={handleAddRow} /></td>
                                <td><AiOutlineDelete onClick={() => handleDeleteRow(row.id)} /></td>
                            </>
                        ) : (
                            <>
                                <td style={{ paddingRight: '15px' }}><FiPlus onClick={handleAddRow} /></td>
                                <td><AiOutlineDelete onClick={() => handleDeleteRow(row.id)} /></td>
                            </>
                        )}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default BillingTable;


