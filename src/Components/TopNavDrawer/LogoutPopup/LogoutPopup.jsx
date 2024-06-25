import React from 'react';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import secureLocalStorage from 'react-secure-storage';

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
    const handleLogout = async () => {
        try {
            const token = secureLocalStorage.getItem("accessToken");
            const response = await fetch("http://localhost:8080/api/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            });
            if (!response.ok) {
                console.log("Error:", response.statusText);
            }
            secureLocalStorage.removeItem('accessToken');
            secureLocalStorage.removeItem('user');
            window.location.href = '/';
        }
        catch (error) {
            console.error("Error:", error);
            window.alert(error.message);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Button
                sx={style}
                tabIndex={0}
                onClick={handleLogout}
            >
                Logout
            </Button>
        </Modal>
    );
};

export default LogoutPopup;