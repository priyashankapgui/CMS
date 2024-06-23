import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NotFound.css'; // Import the CSS file for styling

const NotFound = () => {
    const navigate = useNavigate();

    const redirectToSales = () => {
        navigate('/sales');
    };

    const redirectToHome = () => {
        navigate('/');
    };

    return (
        <div className="not-found">
            <h1 className="not-found__title">404 - Page Not Found</h1>
            <p className="not-found__message">Oops! The page you are looking for does not exist.</p>
            <button className="not-found__button" onClick={redirectToSales}>Go to Sales</button>
            <button className="not-found__button" onClick={redirectToHome}>Go to Login</button>
        </div>
    );
};

export default NotFound;