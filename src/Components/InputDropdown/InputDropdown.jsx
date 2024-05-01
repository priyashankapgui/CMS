import React from 'react';
import './InputDropdown.css';

const InputDropdown = ({ id, name, height, width, onChange, editable, options, marginTop, borderRadius }) => {
    if (!options || !Array.isArray(options) || options.length === 0) {
        return <div>Data not available</div>;
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
                onChange={onChange}
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