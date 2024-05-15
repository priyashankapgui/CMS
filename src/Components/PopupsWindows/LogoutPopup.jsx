import React from 'react';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';


const style = {
    position: 'absolute',
    top: '10%',
    left: '92%',
    transform: 'translateX(-50%)',
    width: '80vw',
    maxWidth: '12.5em',
    height: '3.125em',
    backgroundColor: 'rgba(235, 19, 19, 0.7)',
    fontSize: '1em',
    border: '1px solid #fff',
    borderRadius: '0.625em',
    fontFamily: 'Poppins',
    color: '#fff',
    boxShadow: '1.25em',
    padding: '0.25em',
    textTransform: 'none',
    '&:hover': {
        backgroundColor: 'rgba(235, 19, 19, 1)',
    },
};


const LogoutPopup = ({ open, onClose }) => {
    const handleLogout = () => {
        // Perform logout actions (e.g., redirect to the login page)
        // ...
        window.location.href = '/';

        // Close the modal
        onClose();
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
        >
            <Button
                sx={style}
                onClick={handleLogout}
            >
                Logout
            </Button>
        </Modal>
    );
};

export default LogoutPopup;