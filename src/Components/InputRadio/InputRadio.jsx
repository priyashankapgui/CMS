import React from 'react';
import './InputRadio.css';

const InputRadio = ({ name, options, onChange }) => {
  return (
    <div className="radio-container">
      {options.map(option => (
        <label key={option.id} className="container">
          {option.label}
          <input
            type="radio"
            name={name} 
            value={option.label}
            onChange={onChange}
          />
        </label>
      ))}
    </div>
  );
};

export default InputRadio;
