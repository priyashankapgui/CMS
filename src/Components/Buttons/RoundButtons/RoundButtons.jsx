import React from 'react';
import './RoundButtons.css';

function RoundButtons({ id, type, name, icon, backgroundColor, onClick, onChange }) {
    const buttonStyle = {
        backgroundColor: backgroundColor || 'white'
    };

    return (
        <div id={id} type={type} name={name} className="RoundButton" style={buttonStyle} onClick={onClick} onChange={onChange}>
            {icon}
        </div>
    );
}

export default RoundButtons;