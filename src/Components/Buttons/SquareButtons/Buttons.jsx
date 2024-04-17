import React from 'react';
import './Buttons.css';

function Buttons({ type, id, style, onClick, btnHeight, btnWidth, marginTop, children }) {
    return (
        <div>
            <button
                type={type}
                style={{
                    ...style,
                    height: btnHeight,
                    width: btnWidth,
                    marginTop: marginTop
                }}
                id={id}
                className="buttons"
                onClick={onClick}
            >
                {children}
            </button>
        </div>
    );
}

export default Buttons;
