import React, { useState, useEffect } from 'react';
import Layout from "../../../Layout/Layout";
import axios from 'axios';
import "./StockTransferIN.css";
import TableWithPagi from '../../../Components/Tables/TableWithPagi';
import RoundButtons from '../../../Components/Buttons/RoundButtons/RoundButtons';
import { BsEye } from "react-icons/bs";
import { RiPrinterFill } from "react-icons/ri";
import { Link } from 'react-router-dom';
import SubSpinner from '../../../Components/Spinner/SubSpinner/SubSpinner';
import Completed from './completed';
import { TiTickOutline } from "react-icons/ti";
import { MdOutlineCancel } from "react-icons/md";



export const StockTransferIn = () => {
    
    const [stockData, setStockData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useState({
        fromDate: '',
        toDate: '',
        STNNo: '',
        productId: '',
    });
    const [products, setProducts] = useState([]);

    


    useEffect(() => {
        fetchStockData();
      
        
    }, []);

    const fetchStockData = async () => {
    
        const user = JSON.parse(sessionStorage.getItem("user"));
        console.log("name", user);
    
        if (!user) {
            console.error('User is not available');
            setLoading(false);
            return;
        }
        console.log("useranee", user.role);
    
        try {
          
            let response;
            if (user.role === 'Super Admin') {
                response = await axios.get('http://localhost:8080/allTransfers');
            } else if (user.branchName) {
                response = await axios.get(`http://localhost:8080/stock-transfer/supplying-branch/${user.branchName}`);
            } else {
                console.error('Branch name is not available for the user');
                setLoading(false);
                return;
            }
            setStockData(response.data?.data || []);
            
        } catch (error) {
            console.error('Error fetching Stock transfer data:', error);
        } finally {
            setLoading(false);
        }
       
    };
    return (
        <>
            <div className="stockTransferIN-bodycontainer">
            <div className="stockTransferIN-content-middle">
            {loading ? (
                            <div><SubSpinner/></div>
                        ) : (
                        
                        <TableWithPagi
                            columns={['STN No', 'Created At', 'Request Branch', 'Supplying Branch', 'Status', 'Requested By', 'Submitted By', 'Submitted At', '']}
                            rows={stockData.map((data, index) => ({
                                'STN No': data.STN_NO,
                                'Created At': data.createdAt,
                                'Request Branch': data.requestBranch,
                                'Supplying Branch': data.supplyingBranch,
                                'Status': data.status,
                                'Requested By': data.requestedBy,
                                'Submitted By': data.submittedBy,
                                'Submitted At': data.submittedAt,
                                'Actions': (
                                    <div style={{ display: "flex", gap: "0.5em" }}>
                                        {data.status === 'raised' && (
                                            <Link to={`/stock-transfer/issuing/${data.STN_NO}`}>
                                                <RoundButtons
                                                    id={`eyeViewBtn-${index}`}
                                                    type="submit"
                                                    name={`eyeViewBtn-${index}`}
                                                    icon={<BsEye />}
                                                />
                                            </Link>
                                        )}
                                        {data.status === 'completed' && (
                                            <>
                                                <Link to={`/stock-transfer/completed/${data.STN_NO}`}>
                                                    <RoundButtons
                                                        id={`tickBtn-${index}`}
                                                        type="submit"
                                                        name={`tickBtn-${index}`}
                                                        icon={<TiTickOutline />}
                                                    />
                                                </Link>
                                                <RoundButtons
                                                    id={`printBtn-${index}`}
                                                    type="submit"
                                                    name={`printBtn-${index}`}
                                                    icon={<RiPrinterFill />}
                                                />
                                            </>
                                        )}
                                            
                                        
                                        {data.status === 'cancelled' && (
                                            <Link to={`/stock-transfer/cancelled/${data.STN_NO}`}>
                                                <RoundButtons
                                                    id={`tickBtn-${index}`}
                                                    type="submit"
                                                    name={`tickBtn-${index}`}
                                                    icon={<MdOutlineCancel />}
                                                />
                                            </Link>
                                        )}
                                    </div>
                                ),
                            }))}
                                
                    
                
                customTableStyle={{ top: '20%', width: '100%' }}
                itemsPerPage={10}
            />
           
            )}
             

            </div>
            </div>
          
        </>
    );
};

export default StockTransferIn;
