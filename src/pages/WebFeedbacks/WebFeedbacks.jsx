import React, { useEffect, useState } from 'react';
import Layout from '../../Layout/Layout';
import Buttons from '../../Components/Buttons/SquareButtons/Buttons';
import { IoIosArrowDropdown, IoIosArrowDropup, IoMdCreate, IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';
import InputLabel from '../../Components/Label/InputLabel';
import InputDropdown from '../../Components/InputDropdown/InputDropdown';
import DatePicker from '../../Components/DatePicker/DatePicker';
import jsonData from '../../Components/Data.json';
import './WebFeedbacks.css';

export const WebFeedbacks = () => {
    const [openRowIndex, setOpenRowIndex] = useState(null);
    const [actionSummary, setActionSummary] = useState('');
    const [editModeIndex, setEditModeIndex] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5; // Number of rows to display per page

    const [rows, setRows] = useState([]);

    useEffect(() => {
       fetchFeedbacks();
        
    }, []);

    const fetchFeedbacks = () => {
        fetch('http://localhost:8080/feedback')
            .then(response => response.json())
            .then(data => {
                setRows(data);
            })
            .catch(error => {
                console.error('Failed to fetch data:', error);
            });
    };

    const handleRowClick = (index) => {
        setOpenRowIndex(openRowIndex === index ? null : index);
    };

    const handleSaveActionSummary = (index) => {
        const updatedRows = [...rows];
        const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
        if (actionSummary.trim() === '') {
            updatedRows[index] = { ...updatedRows[index], action: 'Pending', actionTakenBy: '', actionTakenAt: '', actionSummary: '', lastUpdated: '' };
        } else {
            updatedRows[index] = { ...updatedRows[index], action: 'Taken', actionTakenBy: 'User', actionTakenAt: currentDate, actionSummary: actionSummary, lastUpdated: currentDate };
        }
        setRows(updatedRows);
        setActionSummary('');
        setEditModeIndex(null); // Exit edit mode after saving
    };

    // Calculate start and end indices for current page
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = rows.slice(indexOfFirstRow, indexOfLastRow);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
                                <InputLabel for="branchName" color="#0377A8">Branch</InputLabel>
                                <InputDropdown id="branchName" name="branchName" editable={true} options={jsonData.dropDownOptions.branchOptions} />
                            </div>
                            <div className="dateField">
                                <InputLabel for="to-date" color="#0377A8">To</InputLabel>
                                <DatePicker />
                            </div>
                            <div className="dateField">
                                <InputLabel for="from-date" color="#0377A8">From</InputLabel>
                                <DatePicker />
                            </div>
                            <div className="actionTypeField">
                                <InputLabel for="actionType" color="#0377A8">Action Type</InputLabel>
                                <InputDropdown id="actionType" name="actionType" editable={true} options={['All', 'Taken', 'Pending']} />
                            </div>
                        </div>
                        <div className="feed-BtnSection">
                            <Buttons type="submit" id="search-btn" style={{ backgroundColor: "#23A3DA", color: "white" }}> Search </Buttons>
                            <Buttons type="submit" id="clear-btn" style={{ backgroundColor: "white", color: "#EB1313" }}> Clear </Buttons>
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
                                {currentRows.map((row, index) => (
                                    <React.Fragment key={index}>
                                        <tr onClick={() => handleRowClick(index)} style={{ color: row.action === 'Taken' ? 'green' : 'red' }}>
                                            <td style={{ position: 'relative' }}>
                                                {openRowIndex === index ? <IoIosArrowDropdown className="dropdown-icon" /> : <IoIosArrowDropup className="dropdown-icon" />}
                                            </td>
                                            <td>{row.feedbackType}</td>
                                            <td>{row.branch}</td>
                                            <td>{row.createdAt}</td>
                                            <td>{row.action}</td>
                                            <td>{row.actionTakenBy}</td>
                                            <td>{row.actionTakenAt}</td>
                                        </tr>
                                        {openRowIndex === index && (
                                            <tr>
                                                <td colSpan="7">
                                                    <div className="details" style={{ backgroundColor: row.action === 'Taken' ? '#4cd765' : '#ff9999' }}>
                                                        <h3 className='details-text'>Details</h3>
                                                        <table className='detailsTable'>
                                                            <tbody>
                                                                <tr>
                                                                    <td className='d-t-color-left'>Feedback Content:</td>
                                                                    <td>{row.feedbackContent}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td className='d-t-color-left'>Customer Name:</td>
                                                                    <td>{row.customerName}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td className='d-t-color-left'>Contact No:</td>
                                                                    <td>{row.contactNo}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td className='d-t-color-left'>Email:</td>
                                                                    <td>{row.email}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td className='d-t-color-left'>Summary of Action:</td>
                                                                    <td>
                                                                        {editModeIndex === index ? (
                                                                            <React.Fragment>
                                                                                <input
                                                                                    type="text"
                                                                                    id='action-summary'
                                                                                    name='action-summary'
                                                                                    placeholder="Type here"
                                                                                    value={actionSummary}
                                                                                    onChange={(e) => setActionSummary(e.target.value)}
                                                                                />
                                                                                <Buttons type="submit" id="submit-btn" style={{ backgroundColor: "#23A3DA", color: "white" }} onClick={() => handleSaveActionSummary(index)}> Save </Buttons>
                                                                            </React.Fragment>
                                                                        ) : (
                                                                            <React.Fragment>
                                                                                {row.actionSummary}
                                                                                <IoMdCreate className="edit-icon" onClick={() => setEditModeIndex(index)} />
                                                                            </React.Fragment>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td className='d-t-color-left'>Last Updated:</td>
                                                                    <td>{row.lastUpdated}</td>
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

export default WebFeedbacks;