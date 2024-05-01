import React from 'react';
import './InputRadio.css'; 
const InputRadio = ({ name, options, onChange }) => {
  return (
    <div className="radio-container"> 
      {options.map(option => (
        <label key={option.id} className="radio-label"> 
          <input
            type="radio"
            id={option.id}
            name={name}
            value={option.label}
            onChange={onChange}
          />
          {option.label}
        </label>
      ))}
    </div>
  );
};

export default InputRadio;