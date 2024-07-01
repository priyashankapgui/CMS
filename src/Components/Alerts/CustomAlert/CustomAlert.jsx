import React, { useState, useEffect } from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

export default function CustomAlert({ severity, title, message, duration, onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose(); // Callback to parent component to handle closing
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  // Define text color based on severity
  let textColor;
  switch (severity) {
    case 'success':
      textColor = '#2e7d32';
      break;
    case 'info':
      textColor = '#0288d1';
      break;
    case 'warning':
      textColor = '#ed6c02';
      break;
    case 'error':
      textColor = '#eb1313';
      break;
    default:
      textColor = '#000'; // Default text color
  }

  return (
    <>
      {visible && (
        <Alert
          severity={severity}
          sx={{
            position: 'fixed',
            zIndex: '9999',
            top: '80px',
            right: '10px',
            marginBottom: '30px',
            color: textColor,
            width: 'fit-content',
            borderRadius: '18px 0 ',
            padding: '0 15px 0 15px',
            marginTop: '0',
            boxShadow: '0 6px 8px -1px rgba(3, 119, 168, 0.1),' +
              ' 0 4px 7px -1px rgba(3, 119, 168, 0.5)',
            transition: 'top 0.3s ease-in-out, right 0.3s ease-in-out'
          }}
          onClose={() => {
            setVisible(false);
            onClose(); // Ensure the alert can be closed manually
          }}
        >
          <AlertTitle>{title}</AlertTitle>
          {message}
        </Alert>
      )}
    </>
  );
}
