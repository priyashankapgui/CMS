import React from 'react';
import './InputField.css';

function InputField({ id, name, placeholder, onChange, editable, borderRadius, height, width, marginTop, children }) {
    return (
        <div className="input-container">
            <input
                id={id}
                name={name}
                placeholder={placeholder}
                onChange={onChange}
                className={`input ${editable ? '' : 'disabled'}`} 
                style={{
                    borderRadius: borderRadius || '0.625em',
                    height: height || '2.25em',
                    width: width || '27em',
                    marginTop: marginTop || '0.313em',
                }}
            />
            {children && (
                <span className="icon-container">
                    {children}
                </span>
            )}
        </div>
    );
}

export default InputField;
