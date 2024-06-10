import React from 'react';

const InputRadio = ({ options, name }) => {
    return (
        <div>
            {Array.isArray(options) && options.map((option, index) => (
                <label key={index}>
                    <input
                        type="radio"
                        name={name}
                        value={option.value}
                    />
                    {option.label}
                </label>
            ))}
        </div>
    );
};

export default InputRadio;
