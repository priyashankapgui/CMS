import React from 'react';
import './InputLabel.css';

function InputLabel({ htmlFor, color, fontSize, fontWeight, textAlign, children }) {
    return (
        <label htmlFor={htmlFor} className="input-label" style={{ fontSize: fontSize, fontWeight: fontWeight, color: color, textAlign: textAlign }}>
            {children}
        </label>
    );
}

export default InputLabel;