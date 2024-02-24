import React from 'react';
import styled from 'styled-components';

const Button = styled.button`
  width: ${(props) => props.btnWidth || '5.125em'};
  height: ${(props) => props.btnHeight || '2em'};
  border-radius: 0.625em;
  font-weight: 600;
  font-size: 1em;
  border: none;
  box-shadow: 1px 1px rgba(0, 0, 0, 0.2);
  margin-top: 0.625em;
  padding: 0.125em;
  text-transform: none;
  text-align: center;
  &:hover { 
    box-shadow: 0 6px 8px -1px rgba(0, 0, 0, 0.1),
      0 4px 7px -1px rgba(0, 0, 0, 0.06);
  }
`;

function Buttons(props) {
    return (
        <div>
            <Button
                type={props.type}
                id={props.id}
                style={props.style}
                onClick={props.onClick}
                alignSelf={props.alignSelf}
                btnHeight={props.btnHeight}
                btnWidth={props.btnWidth}
            >
                {props.children}
            </Button>
        </div>
    );
}

export default Buttons;
