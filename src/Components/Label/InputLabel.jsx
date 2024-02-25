import React from 'react';
import styled from 'styled-components';

const Label = styled.label`
  font-size: ${(props) => props.fontsize || '0.875em'};
  font-family: Poppins;
  font-weight:${props => props.fontweight || '500'}; 
  color: ${props => props.color}; 
`;



function InputLabel(props) {
    return (
        <div>
            <Label
                htmlFor={props.for}
                color={props.color}
                fontsize={props.fontsize}
                fontweight={props.fontweight}
            >
                {props.children}
            </Label>
        </div>

    );
}

export default InputLabel;