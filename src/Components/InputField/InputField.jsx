import React from 'react';
import './InputField.css';

function InputField({ type, id, name, placeholder, onChange, editable, borderRadius, height, width, marginTop, value, textAlign, border, className, children }) {    // Default onChange handler that does nothing
    const noop = () => { };

    return (
        <div className="input-container">
            <input
                type={type}
                id={id}
                name={name}
                placeholder={placeholder}
                onChange={onChange || noop}
                value={value}
                className={`input ${editable ? '' : 'disabled'} ${className}`}

                style={{
                    borderRadius: borderRadius || '0.625em',
                    height: height || '2.6em',
                    width: width || '27em',
                    marginTop: marginTop || '0.313em',
                    textAlign: textAlign || 'left',
                    border: border || '1px solid #8D9093'
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