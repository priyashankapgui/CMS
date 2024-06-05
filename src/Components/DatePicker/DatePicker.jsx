import React, { useState } from 'react';
import './DatePicker.css';

const DatePicker = ({ onDateChange }) => {
  const [selectedDate, setSelectedDate] = useState('');

  const handleDateChange = (event) => {
    const date = event.target.value;
    setSelectedDate(date);
    onDateChange(date);
  };

  return (
    <div className="datepicker-container">
      <input
        className="datepicker-input"
        id="date"
        name="date"
        type="date"
        value={selectedDate}
        onChange={handleDateChange}
      />
    </div>
  );
};

export default DatePicker;
