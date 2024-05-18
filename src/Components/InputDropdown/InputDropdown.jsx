import React, { useState, useEffect } from 'react';
import './InputDropdown.css';

const InputDropdown = ({ id, name, height, width, onChange, editable, borderRadius, marginTop, options }) => {
    
    const [selectedOption, setSelectedOption] = useState('');

    useEffect(() => {
        if (options.length > 0) {
            setSelectedOption(options[0]);
        }
    }, [options]);

    const handleOptionChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedOption(selectedValue);
        onChange(selectedValue);
    };

    if (options.length === 0) {
        return <div>Options not available</div>;
    }

    return (
        <div>
            <select
                id={id}
                name={name}
                style={{
                    borderRadius: borderRadius || '0.625em',
                    height: height || '2.25em',
                    width: width || '15.625em',
                    marginTop: marginTop || '0.313em',
                }}
                className={`dropdown ${editable ? '' : 'disabled'}`}
                onChange={handleOptionChange}
                value={selectedOption}
                disabled={!editable}
            >
                {options.map((option, index) => (
                    <option key={index} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default InputDropdown;