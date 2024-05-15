import React from 'react';
import './RoundButtons.css';

function RoundButtons({ id, name, icon, backgroundColor, onClick }) {
    const buttonStyle = {
        backgroundColor: backgroundColor || 'white'
    };

    return (
        <div id={id} name={name} className="RoundButton" style={buttonStyle} onClick={onClick}>
            {icon}
        </div>
    );
}

export default RoundButtons;