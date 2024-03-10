import React from 'react';
import styled from 'styled-components';

const Label = styled.label`
  font-size: ${({ fontsize }) => fontsize || '0.875em'};
  font-family: Poppins;
  font-weight: ${({ fontweight }) => fontweight || '500'};
  color: ${({ color }) => color};
`;

function InputLabel({ htmlFor, color, fontsize, fontweight, children }) {
    return (
        <div>
            <Label htmlFor={htmlFor} color={color} fontsize={fontsize} fontweight={fontweight}>
                {children}
            </Label>
        </div>
    );
}

export default InputLabel;
