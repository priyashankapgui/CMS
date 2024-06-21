import React, { useState, useEffect } from 'react';
import './DatePicker.css';

const DatePicker = ({ selectedDate, onDateChange }) => {
  const [date, setDate] = useState(selectedDate);

  useEffect(() => {
    setDate(selectedDate); 
  }, [selectedDate]);

  const handleDateChange = (event) => {
    const newDate = new Date(event.target.value);
    setDate(newDate);
    onDateChange(newDate);
  };

  return (
    <div className="datepicker-container">
      <input
        className="datepicker-input"
        id="date"
        name="date"
        type="date"
        value={date ? date.toISOString().split('T')[0] : ''}
        onChange={handleDateChange}
      />
    </div>
  );
};

export default DatePicker;
