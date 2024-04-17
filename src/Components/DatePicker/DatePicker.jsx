import React, { useState } from 'react';
import './DatePicker.css';

function DatePicker() {
  const [selectedDate, setSelectedDate] = useState('');

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
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
}

export default DatePicker;
