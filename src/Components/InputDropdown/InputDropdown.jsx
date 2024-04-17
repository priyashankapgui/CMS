import React from 'react';
import './InputDropdown.css'; 

const InputDropdown = ({ id, name, style, height, width, onChange, editable, options }) => {
    if (!options || !Array.isArray(options) || options.length === 0) {
        return <div>No options available</div>;
    }

    return (
        <div> 
            <select
                id={id}
                name={name}
                style={style}
                className={`dropdown ${editable ? '' : 'disabled'}`} 
                height={height}
                width={width}
                onChange={onChange}
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
