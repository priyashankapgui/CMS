import React, { useEffect, useState } from 'react';
import './WebFeedbacks.css';
import secureLocalStorage from 'react-secure-storage';
import Layout from '../../Layout/Layout';
import Buttons from '../../Components/Buttons/SquareButtons/Buttons';
import { IoIosArrowDropdown, IoIosArrowDropup, IoMdCreate, IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';
import InputLabel from '../../Components/Label/InputLabel';
import BranchDropdown from '../../Components/InputDropdown/BranchDropdown';
import InputDropdown from '../../Components/InputDropdown/InputDropdown';
import DatePicker from '../../Components/DatePicker/DatePicker';
import SubSpinner from '../../Components/Spinner/SubSpinner/SubSpinner.jsx'

import { getWebFeedbacks, putWebFeedback } from '../../Api/WebFeedback/WebFeedbacksAPI.jsx'; 
import { getBranchOptions } from '../../Api/BranchMgmt/BranchAPI.jsx'; 

export const WebFeedbacks = () => {
    const [openRowIndex, setOpenRowIndex] = useState(null);
    const [actionSummary, setActionSummary] = useState('');
    const [editModeId, setEditModeId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const rowsPerPage = 6; 
    const [filtered,setFiltered] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState('');
    const [selectedAction, setSelectedAction] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
   


    const [rows, setRows] = useState([]);
    const [branchOptions, setBranchOptions] = useState([]);
    const [filters, setFilters] = useState({
        branch: 'All',
        toDate: '',
        fromDate: '',
        actionType: '',
    });
    const [userDetails, setUserDetails] = useState({
        username: "",
        userID: "",
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getWebFeedbacks();
    
                const sortedData = data.sort((a, b) => {
                    if (a.action === 'Pending' && b.action !== 'Pending') return -1;
                    if (a.action !== 'Pending' && b.action === 'Pending') return 1;
                    return new Date(a.createdAt) - new Date(b.createdAt);
                });
    
                setFiltered(sortedData);
                setRows(sortedData);
            } catch (error) {

                console.error('Failed to fetch data:', error);
            }
        };
    
        fetchData();
    }, []);
    
    useEffect(() => {
        const fetchBranchOptions = async () => {
            try {
                const data = await getBranchOptions(secureLocalStorage.getItem('accessToken'));
                setBranchOptions([{ branchName: 'All' }, ...data]);
            } catch (error) {

                console.error('Failed to fetch branch data:', error);
            }
        };



        fetchBranchOptions();
    }, []);

    const handleRowClick = (feedbackId) => {
        setOpenRowIndex(openRowIndex === feedbackId ? null : feedbackId);
    };

    const handleSaveActionSummary = async (feedbackId) => {
        setLoading(true);
        const updatedRows = rows.map(row => {
            if (row.feedbackId === feedbackId) {
                const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
                return {
                    ...row,
                    action: actionSummary.trim() === '' ? 'Pending' : 'Taken',
                    actionTakenBy: actionSummary.trim() === '' ? '' : userDetails.username,
                    actionTakenAt: actionSummary.trim() === '' ? '' : currentDate,
                    actionSummary: actionSummary.trim(),
                    lastUpdated: currentDate,


                };

            }
            return row;
        });

        const updatedRow = updatedRows.find(row => row.feedbackId === feedbackId);

        try {
            const response = await putWebFeedback(feedbackId, updatedRow); // Use putWebFeedback function
            console.log('Feedback updated successfully:', response);


            const sortedRows = updatedRows.sort((a, b) => {
                if (a.action === 'Pending' && b.action !== 'Pending') return -1;
                if (a.action !== 'Pending' && b.action === 'Pending') return 1;
                return new Date(a.createdAt) - new Date(b.createdAt);
            });

            setRows(sortedRows);
            setActionSummary('');
            setEditModeId(null);
        } catch (error) {
            console.error('Error updating feedback:', error);
        } finally {
            setLoading(false);
        }
    };


    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filtered.slice(indexOfFirstRow, indexOfLastRow);


    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleString('en-US', options);
    };

    const handleFilterChange = (nameOrEvent, value) => {
        if (typeof nameOrEvent === 'object' && nameOrEvent.target) {

            const { name, value } = nameOrEvent.target;
            setFilters({
                ...filters,
                [name]: value,
            });
        } else {

            const name = nameOrEvent;
            setFilters({
                ...filters,
                [name]: value,
            });
        }
    };

    const handleStartDateChange = (date) => {
        setStartDate(date);
    };

    const handleEndDateChange = (date) => {
        setEndDate(date);
    };

    const handleBranchDropdownChange = (value) => {
        setSelectedBranch(value);
    };

    const handleActionDropdownChange = (value) => {
        setSelectedAction(value);
    };


    const handleSearch = () => {
        
       
            // Normalize the dates to start of the day
            const normalizeDate = (date) => {
                const newDate = new Date(date);
                newDate.setHours(0, 0, 0, 0);
                return newDate;
            };
    
            let filtered = [...rows];
    
            if (selectedBranch) {
                filtered=filtered.filter(item => item.branch === selectedBranch) ;
            }
    
            if (startDate && endDate) {
                const normalizedStartDate = normalizeDate(startDate).getTime();
                const normalizedEndDate = normalizeDate(endDate).getTime();
    
                filtered = filtered.filter(item => {
                    const itemDate = normalizeDate(new Date(item.createdAt)).getTime();
                    return itemDate >= normalizedStartDate && itemDate <= normalizedEndDate;
                });
            } else if (startDate) {
                const normalizedStartDate = normalizeDate(startDate).getTime();
                filtered = filtered.filter(item => {
                    const itemDate = normalizeDate(new Date(item.createdAt)).getTime();
                    return itemDate >= normalizedStartDate;
                });
            } else if (endDate) {
                const normalizedEndDate = normalizeDate(endDate).getTime();
                filtered = filtered.filter(item => {
                    const itemDate = normalizeDate(new Date(item.createdAt)).getTime();
                    return itemDate <= normalizedEndDate;
                });
            }
    
            if (filters.actionType && filters.actionType !== 'All') {
                filtered = filtered.filter(item => item.action === filters.actionType);
            }
    
          
            
    
            setFiltered(filtered);
        
    
    };

    const handleClear = () => {
       
        const currentDate = new Date();
        const previousDate = new Date(currentDate);
        previousDate.setDate(currentDate.getDate() - 1); // Previous date

        setSelectedAction('');
        setSelectedBranch('');
        setStartDate(previousDate); 
        setEndDate(currentDate); // Set to current date
        handleSearch();

    };

    useEffect(() => {
        // Fetch user details from secure local storage
        const userJSON = secureLocalStorage.getItem('user');
        if (userJSON) {
            const user = JSON.parse(userJSON);
            setUserDetails({
                username: user?.userName || user?.employeeName || '',
                userID: user?.userID || user?.employeeId || '',
            });
        }
    }, []); 

    return (
        <>
            <div className="top-nav-blue-text">
                <h4>Web Feedbacks</h4>
            </div>
            <Layout>
             {loading && (
                    <div className="loading-overlay">
                        <SubSpinner spinnerText='Saving' />
                    </div>
                )}
                <div className="feedbackBodyBackground">
                    <div className="feedback-filter-container">
                        <div className="Feed-top-Content">
                            
                            <div className="branchField">
                                <InputLabel htmlFor="branchName" color="#0377A8">Branch</InputLabel>
                                <BranchDropdown
                                    id="branchName"
                                    name="branchName"
                                    editable={true}
                                    options={['All', ...branchOptions.map(branch => branch.branchName)]}
                                    value={filters.branch || 'All'} 
                                    addOptions={["All"]}
                                    onChange={(e) => handleBranchDropdownChange(e)}
                                />
                            </div>
                            <div className="dateField">
                                <InputLabel htmlFor="to-date" color="#0377A8">To</InputLabel>
                                <DatePicker
                                    id="to-date"
                                    name="toDate"
                                    selectedDate={startDate}
                                    onDateChange={handleStartDateChange}
                                />
                            </div>
                            <div className="dateField">
                                <InputLabel htmlFor="from-date" color="#0377A8">From</InputLabel>
                                <DatePicker
                                    id="from-date"
                                    name="fromDate"
                                    selectedDate={endDate}
                                    onDateChange={handleEndDateChange}
                                />
                            </div>
                            <div className="actionField">
                                <InputLabel htmlFor="actionType" color="#0377A8">Action</InputLabel>
                                <InputDropdown
                                    id="actionType"
                                    name="actionType"
                                    editable={true}
                                    options={['All', 'Taken', 'Pending']}
                                    value={filters.actionType || 'All'}
                                    onChange={(e) => handleActionDropdownChange(e)}
                                />
                            </div>
                        </div>
                        <div className="feed-BtnSection">
                            <Buttons type="submit" id="search-btn" style={{ backgroundColor: "#23A3DA", color: "white" }} onClick={handleSearch}>Search</Buttons>
                            <Buttons type="submit" id="clear-btn" style={{ backgroundColor: "white", color: "#EB1313" }} onClick={handleClear}>Clear</Buttons>
                        </div>
                    </div>

                    <div className="feedbackMiddleContent">
                        <table className="feedbackTable">
                            <thead>
                                <tr>
                                    <th />
                                    <th>Feedback Type</th>
                                    <th>Branch</th>
                                    <th>Received At</th>
                                    <th>Action</th>
                                    <th>Action taken by</th>
                                    <th>Action taken At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentRows.map((row) => (
                                    <React.Fragment key={row.feedbackId}>
                                        <tr onClick={() => handleRowClick(row.feedbackId)} style={{ color: row.action === 'Taken' ? 'green' : 'red' }}>
                                            <td style={{ position: 'relative' }}>
                                                {openRowIndex === row.feedbackId ? <IoIosArrowDropdown className="dropdown-icon" /> : <IoIosArrowDropup className="dropdown-icon" />}
                                            </td>
                                            <td>{row.feedbackType}</td>
                                            <td>{row.branch}</td>
                                            <td>{formatDate(row.createdAt)}</td>
                                            <td>{row.action}</td>
                                            <td>{row.actionTakenBy}</td>
                                            <td>{formatDate(row.updatedAt)}</td>
                                        </tr>
                                        {openRowIndex === row.feedbackId && (
                                            <tr>
                                                <td colSpan="7">
                                                    <div className="details" style={{ backgroundColor: row.action === 'Taken' ? '#4cd765' : '#ff9999' }}>
                                                        <h3 className='details-text'>Details</h3>
                                                        <table className='detailsTable'>
                                                            <tbody>
                                                                <tr>
                                                                    <td className='d-t-color-left'>Feedback Content:</td>
                                                                    <td>{row.message}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td className='d-t-color-left'>Customer Name:</td>
                                                                    <td>{row.name}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td className='d-t-color-left'>Contact No:</td>
                                                                    <td>{row.phone}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td className='d-t-color-left'>Email:</td>
                                                                    <td>{row.email}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td className='d-t-color-left'>Summary of Action:</td>
                                                                    <td>
                                                                        {editModeId === row.feedbackId ? (
                                                                            <React.Fragment>
                                                                                <input
                                                                                    type="text"
                                                                                    id='action-summary'
                                                                                    name='action-summary'
                                                                                    placeholder="Type here"
                                                                                    value={actionSummary}
                                                                                    onChange={(e) => setActionSummary(e.target.value)}
                                                                                />
                                                                                <Buttons type="submit" id="submit-btn" style={{ backgroundColor: "#23A3DA", color: "white" }} onClick={() => handleSaveActionSummary(row.feedbackId)}>Save</Buttons>
                                                                                
                                                                            </React.Fragment>
                                                                        ) : (
                                                                            <React.Fragment>
                                                                                {row.actionSummary}
                                                                                <IoMdCreate className="edit-icon" onClick={() => setEditModeId(row.feedbackId)} />
                                                                            </React.Fragment>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td className='d-t-color-left'>Last Updated:</td>
                                                                    <td>{formatDate(row.updatedAt)}</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                        {/* Pagination */}
                        <div className="pagination">
                            <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}><IoIosArrowBack /></button>
                            <button onClick={() => paginate(currentPage + 1)} disabled={indexOfLastRow >= filtered.length}><IoIosArrowForward /></button>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
};

export default WebFeedbacks;
