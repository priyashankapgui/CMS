import React, { useState, useEffect } from 'react';
import './DatePicker.css';

const DatePicker = ({ selectedDate, onDateChange }) => {
  const [date, setDate] = useState(selectedDate);

  useEffect(() => {
    setDate(selectedDate); 
  }, [selectedDate]);

  const handleDateChange = (event) => {
    const newDate = event.target.value ? new Date(event.target.value) : null;
    setDate(newDate);
    onDateChange(newDate);
  };

  const formatDate = (date) => {
    return date ? date.toISOString().split('T')[0] : '';
  };

  return (
    <div className="datepicker-container">
      <input
        className="datepicker-input"
        id="date"
        name="date"
        type="date"
        value={formatDate(date)}
        onChange={handleDateChange}
      />
    </div>
  );
};

export default DatePicker;
