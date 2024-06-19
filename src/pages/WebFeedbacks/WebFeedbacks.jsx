import React, { useEffect, useState, useCallback } from 'react';
import Layout from '../../Layout/Layout';
import Buttons from '../../Components/Buttons/SquareButtons/Buttons';
import { IoIosArrowDropdown, IoIosArrowDropup, IoMdCreate, IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';
import InputLabel from '../../Components/Label/InputLabel';
import BranchDropdown from '../../Components/InputDropdown/BranchDropdown';
import InputDropdown from '../../Components/InputDropdown/InputDropdown';
import DatePicker from '../../Components/DatePicker/DatePicker';
import './WebFeedbacks.css';

export const WebFeedbacks = () => {
    const [openRowIndex, setOpenRowIndex] = useState(null);
    const [actionSummary, setActionSummary] = useState('');
    const [editModeId, setEditModeId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 6; // Number of rows to display per page
    const feedbackApiUrl = 'http://localhost:8080/feedback';
    const branchApiUrl = 'http://localhost:8080/branchesWeb';

    const [rows, setRows] = useState([]);
    const [branchOptions, setBranchOptions] = useState([]);
    const [filters, setFilters] = useState({
        branch: 'All',
        toDate: '',
        fromDate: '',
        actionType: 'All',
    });

    const fetchFeedbacks = useCallback(() => {
        fetch(feedbackApiUrl)
            .then(response => response.json())
            .then(data => {
                let filteredData = data;

                if (filters.branch !== 'All') {
                    filteredData = filteredData.filter(row => row.branch === filters.branch);
                }
                if (filters.toDate) {
                    filteredData = filteredData.filter(row => new Date(row.createdAt) <= new Date(filters.toDate));
                }
                if (filters.fromDate) {
                    filteredData = filteredData.filter(row => new Date(row.createdAt) >= new Date(filters.fromDate));
                }
                if (filters.actionType !== 'All') {
                    filteredData = filteredData.filter(row => row.action === filters.actionType);
                }

                const sortedData = filteredData.sort((a, b) => {
                    if (a.action === 'Pending' && b.action !== 'Pending') return -1;
                    if (a.action !== 'Pending' && b.action === 'Pending') return 1;
                    return new Date(a.createdAt) - new Date(b.createdAt);
                });
                setRows(sortedData);
            })
            .catch(error => {
                console.error('Failed to fetch data:', error);
            });
    }, [feedbackApiUrl, filters]);

    const fetchBranchOptions = useCallback(() => {
        fetch(branchApiUrl)
            .then(response => response.json())
            .then(data => {
                setBranchOptions([{ branchName: 'All' }, ...data]);
            })
            .catch(error => {
                console.error('Failed to fetch branch data:', error);
            });
    }, [branchApiUrl]);

    useEffect(() => {
        fetchFeedbacks();
        fetchBranchOptions();
    }, [fetchFeedbacks, fetchBranchOptions]);

    const handleRowClick = (feedbackId) => {
        setOpenRowIndex(openRowIndex === feedbackId ? null : feedbackId);
    };

    const handleSaveActionSummary = async (feedbackId) => {
        const updatedRows = rows.map(row => {
            if (row.feedbackId === feedbackId) {
                const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
                return {
                    ...row,
                    action: actionSummary.trim() === '' ? 'Pending' : 'Taken',
                    actionTakenBy: actionSummary.trim() === '' ? '' : 'User',
                    actionTakenAt: actionSummary.trim() === '' ? '' : currentDate,
                    actionSummary: actionSummary.trim(),
                    lastUpdated: currentDate,
                };
            }
            return row;
        });

        const updatedRow = updatedRows.find(row => row.feedbackId === feedbackId);

        try {
            const response = await fetch(`${feedbackApiUrl}/${feedbackId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedRow),
            });

            if (!response.ok) {
                throw new Error('Failed to update feedback');
            }

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
        }
    };

    // Calculate start and end indices for current page
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = rows.slice(indexOfFirstRow, indexOfLastRow);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleString('en-US', options);
    };

    const handleFilterChange = (nameOrEvent, value) => {
        if (typeof nameOrEvent === 'object' && nameOrEvent.target) {
            // It's an event
            const { name, value } = nameOrEvent.target;
            setFilters({
                ...filters,
                [name]: value,
            });
        } else {
            // It's a direct value
            const name = nameOrEvent;
            setFilters({
                ...filters,
                [name]: value,
            });
        }
    };

    const handleDateChange = (name, date) => {
        setFilters({
            ...filters,
            [name]: date.toISOString().slice(0, 10),
        });
    };

    const handleSearch = () => {
        fetchFeedbacks();
    };

    const handleClear = () => {
        setFilters({
            branch: 'All',
            toDate: '',
            fromDate: '',
            actionType: 'All',
        });
        fetchFeedbacks();
    };

    return (
        <>
            <div className="top-nav-blue-text">
                <h4>Web Feedbacks</h4>
            </div>
            <Layout>
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
                                    value={filters.branch || 'All'} // Set 'All' as the default value if filters.branch is falsy
                                    onChange={handleFilterChange}
                                />

                            </div>
                            <div className="dateField">
                                <InputLabel htmlFor="to-date" color="#0377A8">To</InputLabel>
                                <DatePicker
                                    id="to-date"
                                    name="toDate"
                                    selected={filters.toDate ? new Date(filters.toDate) : null}
                                    onChange={(date) => handleDateChange('toDate', date)}
                                />
                            </div>
                            <div className="dateField">
                                <InputLabel htmlFor="from-date" color="#0377A8">From</InputLabel>
                                <DatePicker
                                    id="from-date"
                                    name="fromDate"
                                    selected={filters.fromDate ? new Date(filters.fromDate) : null}
                                    onChange={(date) => handleDateChange('fromDate', date)}
                                />
                            </div>
                            <div className="actionField">
                                <InputLabel htmlFor="actionType" color="#0377A8">Action</InputLabel>
                                <InputDropdown
                                    id="actionType"
                                    name="actionType"
                                    editable={true}
                                    options={['All', 'Taken', 'Pending']}
                                    value={filters.actionType}
                                    onChange={handleFilterChange}
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
                            <button onClick={() => paginate(currentPage + 1)} disabled={indexOfLastRow >= rows.length}><IoIosArrowForward /></button>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
};

export default WebFeedbacks;
