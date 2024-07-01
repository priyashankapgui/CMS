import React, { useState, useEffect } from 'react';
import './ConnectionWarning.css';

const ConnectionWarning = () => {
  const [online, setOnline] = useState(navigator.onLine);
  const [showOnlineMessage, setShowOnlineMessage] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setOnline(true);
      setShowOnlineMessage(true);
      setTimeout(() => setShowOnlineMessage(false), 3000); 
    };

    const handleOffline = () => {
      setOnline(false);
      setShowOnlineMessage(false); 
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <>
      {!online && (
        <div className="connection-warning offline">
          You are offline. Please check your internet connection.
        </div>
      )}
      {online && showOnlineMessage && (
        <div className="connection-warning online">
          You are online now.
        </div>
      )}
    </>
  );
};

export default ConnectionWarning;
