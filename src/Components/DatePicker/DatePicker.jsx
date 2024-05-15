import React, { useState } from 'react';
import styled from 'styled-components';

const DatePickerContainer = styled.div`
 
`;

const DatePickerInput = styled.input`
  border-radius: 0.625em;
  border: 1px solid #8D9093;
  height: 2.25em;
  width: 15.625em;
  margin-top: 0.313em;
  margin-bottom:  0.313em;
  font-size: 0.98em;
  padding: 0 0.625em 0 0.625em;
`;


function DatePicker() {
  const [selectedDate, setSelectedDate] = useState('');

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  return (
    <DatePickerContainer>
      <DatePickerInput
        id="date"
        name="date"
        type="date"
        value={selectedDate}
        onChange={handleDateChange}
      />
   
    </DatePickerContainer>
  );
}

export default DatePicker;