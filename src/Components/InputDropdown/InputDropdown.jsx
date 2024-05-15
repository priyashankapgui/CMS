import React, { useState } from 'react';
import styled from 'styled-components';

const Dropdown = styled.select`
  border-radius: 0.625em;
  border: 1px solid #8D9093;
  height: ${({ height }) => height || '2.25em'};
  width: ${({ width }) => width || '15.625em'};
  margin-top: 0.313em;
  margin-bottom: 0.313em;
  font-size: 0.813em;
  padding-left: 0.625em;
  opacity: ${({ editable }) => (editable ? 1 : 0.5)};
  pointer-events: ${({ editable }) => (editable ? 'auto' : 'none')};
`;

const InputDropdown = ({ id, name, style, height, width, onChange, editable, options }) => {
        const [selectedOption, setSelectedOption] = useState('');

        const handleOptionChange = (event) => {
                const selectedValue = event.target.value;
                setSelectedOption(selectedValue);
                onChange(selectedValue); // Pass the selected value to the parent component
        };

        if (!options || !Array.isArray(options) || options.length === 0) {
                return <div>No options available</div>;
        }

        return (
                <div>
                        <Dropdown
                                id={id}
                                name={name}
                                style={style}
                                height={height}
                                width={width}
                                onChange={handleOptionChange} // Call the handleOptionChange function on change
                                editable={editable}
                                value={selectedOption} // Set the selected value of the dropdown
                        >
                                {options.map((option, index) => (
                                        <option key={index} value={option}>
                                                {option}
                                        </option>
                                ))}
                        </Dropdown>
                </div>
        );
};

export default InputDropdown;