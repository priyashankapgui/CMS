import React from 'react';
import styled from 'styled-components';

const Label = styled.label`
  font-size: 13px;
  font-family: Poppins;
  font-weight: 500;
  color: ${props => props.color}; 
`;



function InputLabel(props) {
    return (
        <div>
            <Label
                htmlFor={props.for}
                color={props.color}
            >
                {props.children}
            </Label>
        </div>

    );
}

export default InputLabel;