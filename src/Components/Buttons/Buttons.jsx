import React from 'react';
import styled from 'styled-components';

const Button = styled.button`
  width: ${({ btnWidth }) => btnWidth || '5.125em'};
  height: ${({ btnHeight }) => btnHeight || '2em'};
  border-radius: 0.625em;
  font-weight: 550;
  font-size: 1em;
  border: none;
  box-shadow: 1px 1px 1px 1px rgba(0.1, 0, 0, 0.2);
  margin-top: ${({ margintop }) => margintop || '0.625em'};
  padding: 0.125em;
  text-transform: none;
  text-align: center;
  &:hover {
    box-shadow: 0 6px 8px -1px rgba(0, 0, 0, 0.1),
      0 4px 7px -1px rgba(0, 0, 0, 0.06);
  }
`;

function Buttons({ type, id, style, onClick, alignSelf, btnHeight, btnWidth, margintop, children }) {

    return (
        <div>
            <Button
                type={type}
                id={id}
                style={style}
                onClick={onClick}
                alignSelf={alignSelf}
                btnHeight={btnHeight}
                btnWidth={btnWidth}
                margintop={margintop}
            >
                {children}
            </Button>
        </div>
    );
}

export default Buttons;
