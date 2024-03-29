import React from 'react';
import styled from 'styled-components';

const InputContainer = styled.div`
  position: relative;
`;

const Input = styled.input`
  border-radius: ${({ borderRadius }) => borderRadius || '0.625em'};
  border: 1px solid #8D9093;
  height: ${({ height }) => height || '2.25em'};
  width: ${({ width }) => width || '27em'};
  margin-top: ${({marginTop }) => marginTop || '0.313em'};
  margin-bottom: 0.313em;
  font-size:  0.813em;
  padding: 0.625em;
  opacity: ${({ editable }) => (editable ? 1 : 0.5)};
  pointer-events: ${({ editable }) => (editable ? 'auto' : 'none')};
`;

const IconContainer = styled.span`
  position: absolute;
  top: 50%;
  right: 0.625em;
  transform: translateY(-50%);
`;

function InputField({ id, name, placeholder, onChange, editable, borderRadius, height, width, marginTop ,children }) {
    return (
        <InputContainer>
            <Input
                id={id}
                name={name}
                placeholder={placeholder}
                onChange={onChange}
                editable={editable}
                borderRadius={borderRadius}
                height={height}
                width={width}
                marginTop={marginTop}
            />
            {children && (
                <IconContainer>
                    {children}
                </IconContainer>
            )}
        </InputContainer>
    );
}

export default InputField;
