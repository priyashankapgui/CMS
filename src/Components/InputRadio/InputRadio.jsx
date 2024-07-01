import React from 'react';

const InputRadio = ({ options, name }) => {
    return (
        <div>
            {Array.isArray(options) && options.map((option, index) => (
                <label key={index} className="radio-container">
                    <input
                        type="radio"
                        name={name}
                        value={option.value}
                    />
                    <span>{option.label}</span>
                </label>
            ))}
        </div>
    );
};

export default InputRadio;
