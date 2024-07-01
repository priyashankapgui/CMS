import React from 'react';
import './Buttons.css';

function Buttons({ type, id, style, onClick, onChange,btnHeight, btnWidth, marginTop, fontSize,children }) {
    return (
        <div>
            <button
                type={type}
                style={{
                    ...style,
                    height: btnHeight,
                    width: btnWidth,
                    marginTop: marginTop,
                    fontSize:fontSize
                }}
                id={id}
                className="buttons"
                onClick={onClick}
                onChange={onChange}
            >
                {children}
            </button>
        </div>
    );
}

export default Buttons;